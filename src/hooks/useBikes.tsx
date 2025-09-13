import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { bikesData } from '@/data/bikesData';

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
        console.warn('Database error, falling back to static data:', error.message);
        // Fallback to static data if database fails
        return bikesData.map(bike => ({
          ...bike,
          brand: 'Yamaha',
          image_url: bike.image,
          price_per_day: bike.pricePerDay,
          total_ratings: bike.reviews,
          status: bike.available ? 'available' : 'unavailable',
          license_required: true,
          features: bike.features || []
        })) as Bike[];
      }

      // If no data from database, use static data
      if (!data || data.length === 0) {
        return bikesData.map(bike => ({
          ...bike,
          brand: 'Yamaha',
          image_url: bike.image,
          price_per_day: bike.pricePerDay,
          total_ratings: bike.reviews,
          status: bike.available ? 'available' : 'unavailable',
          license_required: true,
          features: bike.features || []
        })) as Bike[];
      }

      // Ensure features is always an array
      return data.map(bike => ({
        ...bike,
        features: bike.features || []
      })) as Bike[];
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
        console.warn('Database error, falling back to static data:', error.message);
        // Fallback to static data if database fails
        const staticBike = bikesData.find(bike => bike.id === id);
        if (staticBike) {
          return {
            ...staticBike,
            brand: 'Yamaha',
            image_url: staticBike.image,
            price_per_day: staticBike.pricePerDay,
            total_ratings: staticBike.reviews,
            status: staticBike.available ? 'available' : 'unavailable',
            license_required: true,
            features: staticBike.features || []
          } as Bike;
        }
        throw new Error('Bike not found');
      }

      // Ensure features is always an array
      return {
        ...data,
        features: data.features || []
      } as Bike;
    },
    enabled: !!id,
  });
};