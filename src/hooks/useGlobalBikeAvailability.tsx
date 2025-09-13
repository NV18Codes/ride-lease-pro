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
        }
      )
      .subscribe((status: string) => {
        console.log('Global bike availability subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to global bike availability updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Global bike availability subscription error');
          // Retry subscription after a delay
          setTimeout(() => {
            console.log('Retrying global bike availability subscription...');
            (supabase as any).removeChannel(channel);
            // The useEffect will re-run and create a new subscription
          }, 5000);
        } else if (status === 'CLOSED') {
          console.log('Global bike availability subscription closed');
        }
      });

    return () => {
      console.log('Cleaning up global bike availability subscription');
      (supabase as any).removeChannel(channel);
    };
  }, [queryClient]);
};
