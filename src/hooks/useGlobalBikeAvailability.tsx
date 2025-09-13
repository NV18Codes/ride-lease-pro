import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useGlobalBikeAvailability = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up global bike availability subscription');

    const channel = (supabase as any)
      .channel('global-bike-availability')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
        },
        (payload: any) => {
          console.log('Global bike availability change detected:', payload);
          
          // Invalidate all bike-related queries
          queryClient.invalidateQueries({ queryKey: ['bike-availability'] });
          queryClient.invalidateQueries({ queryKey: ['all-bikes-availability'] });
          queryClient.invalidateQueries({ queryKey: ['bikes'] });
          
          // Force refetch of all bike availability queries
          queryClient.refetchQueries({ queryKey: ['bike-availability'] });
          queryClient.refetchQueries({ queryKey: ['all-bikes-availability'] });
        }
      )
      .subscribe((status: string) => {
        console.log('Global bike availability subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to global bike availability updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Global bike availability subscription error');
        }
      });

    return () => {
      console.log('Cleaning up global bike availability subscription');
      (supabase as any).removeChannel(channel);
    };
  }, [queryClient]);
};
