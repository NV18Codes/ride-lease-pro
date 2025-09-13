import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';

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
  payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_id?: string;
  payment_method?: string;
  paid_at?: string;
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
  extra_helmet?: boolean;
}

export const useBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
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

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscription for user:', user.id);

    const channel = (supabase as any)
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          console.log('Real-time booking change detected:', payload);
          
          // Invalidate and refetch bookings when any change occurs
          queryClient.invalidateQueries({ queryKey: ['bookings', user.id] });
        }
      )
      .subscribe((status: string) => {
        console.log('Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Real-time subscription error');
        }
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      (supabase as any).removeChannel(channel);
    };
  }, [user, queryClient]);

  return query;
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (bookingData: CreateBookingData) => {
      if (!user) {
        throw new Error('You must be logged in to make a booking');
      }

      // Validate booking data
      if (!bookingData.bike_id || !bookingData.start_date || !bookingData.end_date) {
        throw new Error('Missing required booking information');
      }

      // Calculate total hours and amount
      const startDate = new Date(bookingData.start_date);
      const endDate = new Date(bookingData.end_date);
      
      // Validate dates
      if (startDate >= endDate) {
        throw new Error('End date must be after start date');
      }
      
      if (startDate < new Date()) {
        throw new Error('Start date cannot be in the past');
      }
      
      const totalHours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));

      // Get bike price
      const { data: bike, error: bikeError } = await (supabase as any)
        .from('bikes')
        .select('price_per_day, price_per_hour')
        .eq('id', bookingData.bike_id)
        .single();

      if (bikeError) {
        throw new Error('Failed to get bike pricing');
      }

      // Calculate pricing: 24hrs = ₹500, 24+ hrs = ₹500 + (additional hours × ₹22)
      let totalAmount = 0;
      if (totalHours <= 24) {
        totalAmount = 500; // Flat rate for 24 hours or less
      } else {
        const additionalHours = totalHours - 24;
        totalAmount = 500 + (additionalHours * 22); // ₹500 + additional hours × ₹22
      }

      // Add extra helmet cost if selected
      if (bookingData.extra_helmet) {
        totalAmount += 50;
      }

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
          status: 'pending', // Always start as pending
          payment_status: 'pending', // Always start as pending
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
  start_date?: string;
  end_date?: string;
  pickup_location?: string;
  drop_location?: string;
  special_instructions?: string;
  payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_id?: string;
  payment_method?: string;
  paid_at?: string;
  status?: string;
}

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingData: Partial<Booking> & { id: string }) => {
      const { id, ...updateData } = bookingData;
      
      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update booking: ${error.message}`);
      }

      return data;
    },
    onSuccess: (updatedBooking) => {
      // Update the bookings list in the cache
      queryClient.setQueryData(['bookings'], (oldData: Booking[] | undefined) => {
        if (!oldData) return [updatedBooking];
        
        return oldData.map(booking => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
      });

      // Also update individual booking if it exists in cache
      queryClient.setQueryData(['booking', updatedBooking.id], updatedBooking);
      
      console.log('Booking updated successfully:', updatedBooking);
    },
    onError: (error) => {
      console.error('Error updating booking:', error);
    }
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!user) throw new Error('You must be logged in to cancel a booking');
      
      // Actually delete the booking from the database
      const { error } = await (supabase as any)
        .from('bookings')
        .delete()
        .eq('id', bookingId)
        .eq('user_id', user.id); // Ensure user can only delete their own bookings
      
      if (error) throw new Error(error.message);
      return { id: bookingId };
    },
    onSuccess: (data) => {
      console.log('Booking deletion successful, updating UI...');
      
      // Force immediate UI update by removing the booking from cache
      queryClient.setQueryData(['bookings', user?.id], (oldData: any) => {
        if (!oldData) return [];
        return oldData.filter((booking: any) => booking.id !== data.id);
      });
      
      // Also invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['bookings', user?.id] });
      
      toast({ 
        title: 'Booking Deleted', 
        description: 'Your booking has been successfully deleted.' 
      });
    },
    onError: (error) => {
      toast({ 
        title: 'Deletion Failed', 
        description: error.message, 
        variant: 'destructive' 
      });
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