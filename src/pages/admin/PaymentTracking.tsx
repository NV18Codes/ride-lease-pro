import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  Eye,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import PaymentTracker from '../../components/PaymentTracker';

interface PaymentActivity {
  id: string;
  paymentId: string;
  orderId?: string;
  userId: string;
  userName: string;
  vehicleName: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded' | 'cancelled';
  method?: string;
  timestamp: Date;
  notes?: Record<string, string>;
}

export default function PaymentTracking() {
  const [payments, setPayments] = useState<PaymentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { toast } = useToast();

  // Mock data for demonstration - replace with real data from your backend
  const mockPayments: PaymentActivity[] = [
    {
      id: '1',
      paymentId: 'pay_test_123',
      orderId: 'order_test_123',
      userId: 'user_001',
      userName: 'John Doe',
      vehicleName: 'Honda Activa',
      status: 'captured',
      amount: 350,
      currency: 'INR',
      method: 'card',
      timestamp: new Date(),
      notes: { booking_id: 'booking_123' }
    },
    {
      id: '2',
      paymentId: 'pay_test_456',
      orderId: 'order_test_456',
      userId: 'user_002',
      userName: 'Jane Smith',
      vehicleName: 'TVS Jupiter',
      status: 'failed',
      amount: 500,
      currency: 'INR',
      method: 'upi',
      timestamp: new Date(Date.now() - 300000),
      notes: { booking_id: 'booking_456' }
    },
    {
      id: '3',
      paymentId: 'pay_test_789',
      orderId: 'order_test_789',
      userId: 'user_003',
      userName: 'Mike Johnson',
      vehicleName: 'Bajaj Pulsar',
      status: 'authorized',
      amount: 750,
      currency: 'INR',
      method: 'netbanking',
      timestamp: new Date(Date.now() - 600000),
      notes: { booking_id: 'booking_789' }
    },
    {
      id: '4',
      paymentId: 'pay_test_101',
      orderId: 'order_test_101',
      userId: 'user_004',
      userName: 'Sarah Wilson',
      vehicleName: 'Hero Splendor',
      status: 'captured',
      amount: 600,
      currency: 'INR',
      method: 'card',
      timestamp: new Date(Date.now() - 900000),
      notes: { booking_id: 'booking_101' }
    }
  ];

  useEffect(() => {
    setPayments(mockPayments);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refreshPayments();
    }, 15000); // 15 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const refreshPayments = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsLoading(false);
    toast({
      title: "Payments Refreshed",
      description: "Payment data has been updated",
      variant: "default",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'captured':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'authorized':
        return <Activity className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
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
      case 'created':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.method?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const successfulPayments = filteredPayments.filter(p => p.status === 'captured').length;
  const failedPayments = filteredPayments.filter(p => p.status === 'failed').length;
  const pendingPayments = filteredPayments.filter(p => p.status === 'authorized').length;

  const exportPayments = () => {
    // In production, this would generate and download a CSV/Excel file
    toast({
      title: "Export Started",
      description: "Payment data export is being prepared",
      variant: "default",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Tracking</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all payment activities</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={refreshPayments} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={exportPayments}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">From all payments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Successful</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{successfulPayments}</div>
              <p className="text-sm text-gray-500 mt-1">Completed payments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{failedPayments}</div>
              <p className="text-sm text-gray-500 mt-1">Failed payments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              <Activity className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{pendingPayments}</div>
              <p className="text-sm text-gray-500 mt-1">Authorized payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="captured">Captured</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="authorized">Authorized</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="autoRefresh" className="text-sm text-gray-600">
                  Auto-refresh (15s)
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Payment ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Vehicle</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-mono text-sm text-gray-900">{payment.paymentId}</div>
                        {payment.orderId && (
                          <div className="text-xs text-gray-500">Order: {payment.orderId}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{payment.userName}</div>
                        <div className="text-xs text-gray-500">ID: {payment.userId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{payment.vehicleName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">₹{payment.amount}</div>
                        <div className="text-xs text-gray-500">{payment.currency}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(payment.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(payment.status)}
                            {payment.status}
                          </div>
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="capitalize text-gray-900">{payment.method || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">
                          {payment.timestamp.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {payment.timestamp.toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Track
                        </Button>
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

        {/* Payment Tracker Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Live Payment Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPayments.slice(0, 2).map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Tracking: {payment.paymentId}</h3>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                  <PaymentTracker
                    paymentId={payment.paymentId}
                    onStatusUpdate={(status) => {
                      console.log('Payment status updated:', status);
                      // Update payment status in the list
                      setPayments(prev => prev.map(p => 
                        p.paymentId === payment.paymentId 
                          ? { ...p, status: status.status as any }
                          : p
                      ));
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
