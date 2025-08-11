import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { getPaymentStatus, PaymentStatus } from '../utils/razorpayWebhookHandler';

interface PaymentTrackerProps {
  paymentId?: string;
  onStatusUpdate?: (status: PaymentStatus) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'captured':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'failed':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'authorized':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'refunded':
      return <DollarSign className="w-5 h-5 text-blue-500" />;
    default:
      return <AlertCircle className="w-5 h-5 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'captured':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'authorized':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'refunded':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function PaymentTracker({ paymentId, onStatusUpdate }: PaymentTrackerProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const checkPaymentStatus = async () => {
    if (!paymentId) return;

    setIsLoading(true);
    try {
      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_GcDzPwQK0veSM9';
      const keySecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'VkTuJp7eIpzdbMUm8BnYYX7Y';
      
      const status = await getPaymentStatus(paymentId, keyId, keySecret);
      
      if (status) {
        setPaymentStatus(status);
        setLastChecked(new Date());
        onStatusUpdate?.(status);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh every 10 seconds if enabled
  useEffect(() => {
    if (!autoRefresh || !paymentId) return;

    const interval = setInterval(() => {
      checkPaymentStatus();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, paymentId]);

  // Initial check
  useEffect(() => {
    if (paymentId) {
      checkPaymentStatus();
    }
  }, [paymentId]);

  if (!paymentId) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center">No payment ID provided</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Payment Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment ID */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Payment ID:</span>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{paymentId}</code>
        </div>

        {/* Status */}
        {paymentStatus && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <Badge className={getStatusColor(paymentStatus.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(paymentStatus.status)}
                  {paymentStatus.status.toUpperCase()}
                </div>
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Amount:</span>
              <span className="font-semibold">
                ₹{paymentStatus.amount} {paymentStatus.currency}
              </span>
            </div>

            {paymentStatus.method && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Method:</span>
                <span className="text-sm">{paymentStatus.method}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Last Updated:</span>
              <span className="text-sm">
                {paymentStatus.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}

        {/* Last Checked */}
        {lastChecked && (
          <div className="text-xs text-gray-500 text-center">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            onClick={checkPaymentStatus}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Checking...' : 'Check Status'}
          </Button>

          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            size="sm"
            variant={autoRefresh ? 'default' : 'outline'}
            className="flex-1"
          >
            {autoRefresh ? 'Auto On' : 'Auto Off'}
          </Button>
        </div>

        {/* Auto-refresh info */}
        {autoRefresh && (
          <div className="text-xs text-gray-500 text-center">
            Auto-refreshing every 10 seconds
          </div>
        )}
      </CardContent>
    </Card>
  );
}
