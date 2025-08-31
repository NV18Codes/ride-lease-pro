-- Create bookings table for AMILIE'S BIKE RENTAL
-- Run this in your Supabase SQL Editor

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bike_id UUID REFERENCES public.bikes(id) ON DELETE CASCADE,
    pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
    return_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_hours INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    pickup_location TEXT NOT NULL,
    return_location TEXT,
    special_instructions TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_id TEXT,
    payment_method TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bikes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.bikes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    type TEXT NOT NULL,
    year INTEGER,
    engine_cc INTEGER,
    fuel_type TEXT,
    transmission TEXT,
    price_per_day DECIMAL(10,2) NOT NULL,
    price_per_hour DECIMAL(10,2),
    image_url TEXT,
    description TEXT,
    features JSONB,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'unavailable')),
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for bikes
CREATE POLICY "Anyone can view available bikes" ON public.bikes
    FOR SELECT USING (status = 'available');

CREATE POLICY "Authenticated users can view all bikes" ON public.bikes
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_bike_id ON public.bookings(bike_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bikes_status ON public.bikes(status);
CREATE INDEX IF NOT EXISTS idx_bikes_type ON public.bikes(type);
CREATE INDEX IF NOT EXISTS idx_bikes_price ON public.bikes(price_per_day);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bikes_updated_at BEFORE UPDATE ON public.bikes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample bikes data if table is empty
INSERT INTO public.bikes (name, brand, model, type, year, engine_cc, fuel_type, transmission, price_per_day, price_per_hour, image_url, description, features, location)
SELECT * FROM (VALUES
    ('Activa 6G', 'Honda', 'Activa 6G', 'Scooter', 2023, 110, 'Petrol', 'Automatic', 500.00, 50.00, '/images/activa-6g.jpg', 'Reliable and fuel-efficient scooter perfect for city commuting', '["Fuel Efficient", "Easy to Ride", "Good Storage"]', 'Malpe, Udupi'),
    ('Access 125', 'Suzuki', 'Access 125', 'Scooter', 2023, 125, 'Petrol', 'Automatic', 600.00, 60.00, '/images/access-125.jpg', 'Premium scooter with advanced features and comfortable riding', '["Premium Design", "Advanced Features", "Comfortable"]', 'Malpe, Udupi'),
    ('FZ-S V4', 'Yamaha', 'FZ-S V4', 'Motorcycle', 2023, 149, 'Petrol', 'Manual', 800.00, 80.00, '/images/fz-s-v4.jpg', 'Sporty motorcycle with aggressive styling and excellent performance', '["Sporty Design", "High Performance", "Stylish"]', 'Malpe, Udupi'),
    ('Splendor Plus', 'Hero', 'Splendor Plus', 'Motorcycle', 2023, 97, 'Petrol', 'Manual', 700.00, 70.00, '/images/splendor-plus.jpg', 'Classic commuter bike known for reliability and fuel efficiency', '["Reliable", "Fuel Efficient", "Low Maintenance"]', 'Malpe, Udupi'),
    ('Pulsar NS200', 'Bajaj', 'Pulsar NS200', 'Sports Bike', 2023, 200, 'Petrol', 'Manual', 1000.00, 100.00, '/images/pulsar-ns200.jpg', 'Powerful sports bike with modern design and excellent performance', '["High Performance", "Modern Design", "Powerful Engine"]', 'Malpe, Udupi'),
    ('Apache RTR 160', 'TVS', 'Apache RTR 160', 'Sports Bike', 2023, 160, 'Petrol', 'Manual', 900.00, 90.00, '/images/apache-rtr160.jpg', 'Racing-inspired motorcycle with track-focused features', '["Racing Inspired", "Track Focused", "High Performance"]', 'Malpe, Udupi'),
    ('Classic 350', 'Royal Enfield', 'Classic 350', 'Cruiser', 2023, 349, 'Petrol', 'Manual', 1200.00, 120.00, '/images/classic-350.jpg', 'Iconic cruiser with classic design and thumping engine sound', '["Classic Design", "Iconic Sound", "Premium Feel"]', 'Malpe, Udupi'),
    ('Ola S1 Pro', 'Ola Electric', 'S1 Pro', 'Electric Scooter', 2023, 0, 'Electric', 'Automatic', 800.00, 80.00, '/images/ola-s1-pro.jpg', 'Modern electric scooter with smart features and zero emissions', '["Electric", "Smart Features", "Zero Emissions"]', 'Malpe, Udupi')
) AS v(name, brand, model, type, year, engine_cc, fuel_type, transmission, price_per_day, price_per_hour, image_url, description, features, location)
WHERE NOT EXISTS (SELECT 1 FROM public.bikes LIMIT 1);

-- Grant necessary permissions
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.bikes TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Enable realtime for bookings (optional, for real-time updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bikes;
