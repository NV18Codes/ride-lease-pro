-- Diagnostic script to check bookings table structure and policies
-- Run this in your Supabase SQL Editor to see what's configured

-- 1. Check if bookings table exists and its structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;

-- 2. Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'bookings';

-- 3. Check existing RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'bookings';

-- 4. Check table permissions
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'bookings';

-- 5. Check if there are any constraints
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'bookings';

-- 6. Test a simple insert (this will help identify the issue)
-- Note: Run this only if you're logged in as an authenticated user
-- INSERT INTO public.bookings (user_id, bike_id, pickup_date, return_date, total_hours, total_amount, pickup_location)
-- VALUES (
--     auth.uid(), 
--     '00000000-0000-0000-0000-000000000000', -- Replace with actual bike ID
--     NOW(), 
--     NOW() + INTERVAL '1 hour', 
--     1, 
--     100.00, 
--     'Test Location'
-- );
