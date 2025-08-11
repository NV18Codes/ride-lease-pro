-- Database Migration: Add Payment Fields to Bookings Table
-- Run this script in your Supabase SQL editor

-- Add payment-related columns to the bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Update existing bookings to have default payment status
UPDATE bookings 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;

-- Create index on payment_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_payment_id ON bookings(payment_id);

-- Create index on payment_status for filtering
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

-- Add comments to the new columns
COMMENT ON COLUMN bookings.payment_status IS 'Current payment status of the booking';
COMMENT ON COLUMN bookings.payment_id IS 'External payment gateway ID (e.g., Razorpay payment ID)';
COMMENT ON COLUMN bookings.payment_method IS 'Payment method used (e.g., razorpay, card, upi)';
COMMENT ON COLUMN bookings.paid_at IS 'Timestamp when payment was completed';

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'bookings' 
  AND column_name IN ('payment_status', 'payment_id', 'payment_method', 'paid_at')
ORDER BY column_name;
