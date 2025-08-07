import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Bike {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: string;
  image_url: string;
  price_per_day: number;
  rating: number;
  total_ratings: number;
  location: string;
  fuel_type: string;
  status: string;
  features: string[];
  description: string;
  mileage?: string;
  license_required: boolean;
}

export const useBikes = (filters?: {
  location?: string;
  type?: string;
  priceRange?: [number, number];
  availability?: string;
  searchQuery?: string;
}) => {
  return useQuery({
    queryKey: ['bikes', filters],
    queryFn: async () => {
      let query = (supabase as any)
        .from('bikes')
        .select('*')
        .eq('status', 'available');

      // Apply filters
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.priceRange) {
        query = query
          .gte('price_per_day', filters.priceRange[0])
          .lte('price_per_day', filters.priceRange[1]);
      }

      if (filters?.searchQuery) {
        query = query.or(
          `name.ilike.%${filters.searchQuery}%,model.ilike.%${filters.searchQuery}%,brand.ilike.%${filters.searchQuery}%`
        );
      }

      const { data, error } = await (query as any).order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as Bike[];
    },
  });
};

export const useBike = (id: string) => {
  return useQuery({
    queryKey: ['bike', id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('bikes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Bike;
    },
    enabled: !!id,
  });
};