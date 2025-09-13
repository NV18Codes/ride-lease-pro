-- Fix double booking issue by adding availability check and constraints

-- 1. Add a function to check bike availability
CREATE OR REPLACE FUNCTION check_bike_availability(
  p_bike_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_exclude_booking_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  -- Check if there are any overlapping bookings
  IF EXISTS (
    SELECT 1 
    FROM bookings 
    WHERE bike_id = p_bike_id
      AND id != COALESCE(p_exclude_booking_id, '00000000-0000-0000-0000-000000000000'::UUID)
      AND status IN ('confirmed', 'active', 'pending')
      AND (
        -- New booking starts during existing booking
        (start_date <= p_start_date AND end_date > p_start_date) OR
        -- New booking ends during existing booking  
        (start_date < p_end_date AND end_date >= p_end_date) OR
        -- New booking completely contains existing booking
        (start_date >= p_start_date AND end_date <= p_end_date) OR
        -- Existing booking completely contains new booking
        (start_date <= p_start_date AND end_date >= p_end_date)
      )
  ) THEN
    RETURN FALSE; -- Bike is not available
  END IF;
  
  RETURN TRUE; -- Bike is available
END;
$$ LANGUAGE plpgsql;

-- 2. Add a trigger to prevent double bookings
CREATE OR REPLACE FUNCTION prevent_double_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if bike is available for the new/updated booking
  IF NOT check_bike_availability(
    NEW.bike_id, 
    NEW.start_date, 
    NEW.end_date, 
    NEW.id
  ) THEN
    RAISE EXCEPTION 'Bike is already booked for the selected time period. Please choose different dates or another bike.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger for INSERT and UPDATE
DROP TRIGGER IF EXISTS prevent_double_booking_trigger ON bookings;
CREATE TRIGGER prevent_double_booking_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION prevent_double_booking();

-- 4. Add an index for better performance on availability checks
CREATE INDEX IF NOT EXISTS idx_bookings_availability_check 
ON bookings (bike_id, start_date, end_date, status) 
WHERE status IN ('confirmed', 'active', 'pending');

-- 5. Update RLS policies to ensure users can only see their own bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bookings" ON bookings;
CREATE POLICY "Users can insert own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bookings" ON bookings;
CREATE POLICY "Users can delete own bookings" ON bookings
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Ensure RLS is enabled
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
