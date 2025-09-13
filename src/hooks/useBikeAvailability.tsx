import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface BikeAvailability {
  isAvailable: boolean;
  nextAvailableDate?: string;
  currentBooking?: {
    end_date: string;
    status: string;
  };
}

export const useBikeAvailability = (bikeId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['bike-availability', bikeId],
    queryFn: async (): Promise<BikeAvailability> => {
      const now = new Date().toISOString();

      // Get current active bookings for this bike
      const { data: bookings, error } = await (supabase as any)
        .from('bookings')
        .select('end_date, status')
        .eq('bike_id', bikeId)
        .in('status', ['confirmed', 'active', 'pending'])
        .gte('end_date', now)
        .order('end_date', { ascending: true })
        .limit(1);

      if (error) {
        console.error('Error fetching bike availability:', error);
        // If database error, assume bike is available but log the error
        return { isAvailable: true };
      }

      // If no active bookings, bike is available
      if (!bookings || bookings.length === 0) {
        return { isAvailable: true };
      }

      // Get the earliest ending booking
      const currentBooking = bookings[0];
      const endDate = new Date(currentBooking.end_date);

      return {
        isAvailable: false,
        nextAvailableDate: endDate.toISOString(),
        currentBooking: {
          end_date: currentBooking.end_date,
          status: currentBooking.status
        }
      };
    },
    refetchInterval: 60000, // Refetch every minute to keep availability current
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // Set up real-time subscription for bike availability
  useEffect(() => {
    if (!bikeId) return;

    console.log('Setting up real-time subscription for bike availability:', bikeId);

    const channel = (supabase as any)
      .channel(`bike-availability-${bikeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `bike_id=eq.${bikeId}`,
        },
        (payload: any) => {
          console.log('Real-time bike availability change detected:', payload);
          
          // Invalidate and refetch bike availability when any change occurs
          queryClient.invalidateQueries({ queryKey: ['bike-availability', bikeId] });
          queryClient.invalidateQueries({ queryKey: ['all-bikes-availability'] });
        }
      )
      .subscribe((status: string) => {
        console.log('Bike availability subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to bike availability updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Bike availability subscription error');
        }
      });

    return () => {
      console.log('Cleaning up bike availability subscription');
      (supabase as any).removeChannel(channel);
    };
  }, [bikeId, queryClient]);

  return query;
};

export const useAllBikesAvailability = () => {
  return useQuery({
    queryKey: ['all-bikes-availability'],
    queryFn: async () => {
      const now = new Date().toISOString();

      // Get all active bookings
      const { data: bookings, error } = await (supabase as any)
        .from('bookings')
        .select('bike_id, end_date, status')
        .in('status', ['confirmed', 'active', 'pending'])
        .gte('end_date', now)
        .order('bike_id, end_date', { ascending: true });

      if (error) {
        console.error('Error fetching all bikes availability:', error);
        return {};
      }

      // Group bookings by bike_id and get the earliest end date for each
      const availabilityMap: Record<string, BikeAvailability> = {};
      
      if (bookings && bookings.length > 0) {
        const bikeBookings = bookings.reduce((acc: any, booking: any) => {
          if (!acc[booking.bike_id] || new Date(booking.end_date) < new Date(acc[booking.bike_id].end_date)) {
            acc[booking.bike_id] = booking;
          }
          return acc;
        }, {});

        // Set availability for bikes with bookings
        Object.entries(bikeBookings).forEach(([bikeId, booking]: [string, any]) => {
          availabilityMap[bikeId] = {
            isAvailable: false,
            nextAvailableDate: booking.end_date,
            currentBooking: {
              end_date: booking.end_date,
              status: booking.status
            }
          };
        });
      }

      return availabilityMap;
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};
