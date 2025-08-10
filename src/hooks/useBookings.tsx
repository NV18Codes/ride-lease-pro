import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Booking {
  id: string;
  user_id: string;
  bike_id: string;
  start_date: string;
  end_date: string;
  total_hours: number;
  total_amount: number;
  pickup_location: string;
  drop_location?: string;
  special_instructions?: string;
  status: string;
  created_at: string;
  updated_at: string;
  bikes?: {
    name: string;
    brand: string;
    model: string;
    image_url: string;
  };
}

export interface CreateBookingData {
  bike_id: string;
  start_date: string;
  end_date: string;
  pickup_location: string;
  drop_location?: string;
  special_instructions?: string;
}

export const useBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await (supabase as any)
        .from('bookings')
        .select(`
          *,
          bikes (
            name,
            brand,
            model,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as Booking[];
    },
    enabled: !!user,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (bookingData: CreateBookingData) => {
      if (!user) {
        throw new Error('You must be logged in to make a booking');
      }

      // Calculate total hours and amount
      const startDate = new Date(bookingData.start_date);
      const endDate = new Date(bookingData.end_date);
      const totalHours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));

      // Get bike price
      const { data: bike, error: bikeError } = await (supabase as any)
        .from('bikes')
        .select('price_per_day')
        .eq('id', bookingData.bike_id)
        .single();

      if (bikeError) {
        throw new Error('Failed to get bike pricing');
      }

      const totalAmount = Math.ceil(totalHours / 24) * bike!.price_per_day;

      const { data, error } = await (supabase as any)
        .from('bookings')
        .insert({
          user_id: user.id,
          bike_id: bookingData.bike_id,
          start_date: bookingData.start_date,
          end_date: bookingData.end_date,
          total_hours: totalHours,
          total_amount: totalAmount,
          pickup_location: bookingData.pickup_location,
          drop_location: bookingData.drop_location,
          special_instructions: bookingData.special_instructions,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Booking Created',
        description: 'Your booking has been created successfully!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export interface UpdateBookingData {
  id: string;
  start_date: string;
  end_date: string;
  pickup_location: string;
  drop_location?: string;
  special_instructions?: string;
}

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: UpdateBookingData) => {
      if (!user) throw new Error('You must be logged in to modify a booking');

      const { data: bikeData, error: bikeError } = await (supabase as any)
        .from('bikes')
        .select('price_per_day')
        .eq('id', (await (supabase as any).from('bookings').select('bike_id').eq('id', data.id).single()).data.bike_id)
        .single();

      if (bikeError) throw new Error('Failed to get bike pricing');

      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      const totalHours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
      const totalAmount = Math.ceil(totalHours / 24) * bikeData!.price_per_day;

      const { data: updated, error } = await (supabase as any)
        .from('bookings')
        .update({
          start_date: data.start_date,
          end_date: data.end_date,
          pickup_location: data.pickup_location,
          drop_location: data.drop_location,
          special_instructions: data.special_instructions,
          total_hours: totalHours,
          total_amount: totalAmount,
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Booking Updated', description: 'Your booking has been updated successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
    }
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!user) throw new Error('You must be logged in to cancel a booking');
      const { data, error } = await (supabase as any)
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Booking Cancelled', description: 'Your booking has been cancelled.' });
    },
    onError: (error) => {
      toast({ title: 'Cancellation Failed', description: error.message, variant: 'destructive' });
    }
  });
};

export const useSimulatePayment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (booking: Booking) => {
      if (!user) throw new Error('You must be logged in to pay for a booking');

      const txId = `test_${Math.random().toString(36).slice(2, 10)}`;

      const { error: payError } = await (supabase as any)
        .from('payments')
        .insert({
          booking_id: booking.id,
          amount: booking.total_amount,
          status: 'success',
          payment_method: 'razorpay_test',
          transaction_id: txId,
          payment_gateway_response: { simulated: true }
        });

      if (payError) throw new Error(payError.message);

      const { error: bookError } = await (supabase as any)
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', booking.id);

      if (bookError) throw new Error(bookError.message);

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Payment Successful', description: 'Your booking is now confirmed.' });
    },
    onError: (error) => {
      toast({ title: 'Payment Failed', description: error.message, variant: 'destructive' });
    }
  });
};