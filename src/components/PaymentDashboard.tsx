import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RefreshCw, Search, Filter, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { getPaymentStatus, PaymentStatus } from '../utils/razorpayWebhookHandler';

interface PaymentActivity {
  paymentId: string;
  orderId?: string;
  status: string;
  amount: number;
  currency: string;
  method?: string;
  timestamp: Date;
  notes?: Record<string, string>;
}

export default function PaymentDashboard() {
  const [payments, setPayments] = useState<PaymentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock data for demonstration - replace with real data from your backend
  const mockPayments: PaymentActivity[] = [
    {
      paymentId: 'pay_test_123',
      orderId: 'order_test_123',
      status: 'captured',
      amount: 350,
      currency: 'INR',
      method: 'card',
      timestamp: new Date(),
      notes: { booking_id: 'booking_123' }
    },
    {
      paymentId: 'pay_test_456',
      orderId: 'order_test_456',
      status: 'failed',
      amount: 500,
      currency: 'INR',
      method: 'upi',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      notes: { booking_id: 'booking_456' }
    },
    {
      paymentId: 'pay_test_789',
      orderId: 'order_test_789',
      status: 'authorized',
      amount: 750,
      currency: 'INR',
      method: 'netbanking',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      notes: { booking_id: 'booking_789' }
    }
  ];

  useEffect(() => {
    setPayments(mockPayments);
  }, []);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshPayments();
    }, 15000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const refreshPayments = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'captured':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'authorized':
        return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'refunded':
        return <DollarSign className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
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

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.method?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const successfulPayments = filteredPayments.filter(p => p.status === 'captured').length;
  const failedPayments = filteredPayments.filter(p => p.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Dashboard</h2>
          <p className="text-gray-600">Real-time payment monitoring and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={refreshPayments}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
          >
            {autoRefresh ? 'Auto On' : 'Auto Off'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalAmount}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{filteredPayments.length}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{successfulPayments}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failedPayments}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="captured">Captured</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="authorized">Authorized</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-600">Payment ID</th>
                  <th className="text-left p-3 font-medium text-gray-600">Order ID</th>
                  <th className="text-left p-3 font-medium text-gray-600">Status</th>
                  <th className="text-left p-3 font-medium text-gray-600">Amount</th>
                  <th className="text-left p-3 font-medium text-gray-600">Method</th>
                  <th className="text-left p-3 font-medium text-gray-600">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.paymentId} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {payment.paymentId}
                      </code>
                    </td>
                    <td className="p-3">
                      {payment.orderId && (
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {payment.orderId}
                        </code>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(payment.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(payment.status)}
                          {payment.status.toUpperCase()}
                        </div>
                      </Badge>
                    </td>
                    <td className="p-3 font-semibold">
                      ₹{payment.amount} {payment.currency}
                    </td>
                    <td className="p-3 text-sm capitalize">
                      {payment.method || 'N/A'}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {payment.timestamp.toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No payments found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto-refresh info */}
      {autoRefresh && (
        <div className="text-center text-sm text-gray-500">
          Auto-refreshing every 15 seconds • Last updated: {new Date().toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
