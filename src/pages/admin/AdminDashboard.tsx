import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Bike, 
  Calendar, 
  CreditCard, 
  Users, 
  DollarSign,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Mock data - replace with real data from your backend
  const stats = {
    totalRevenue: 125000,
    totalBookings: 156,
    activeVehicles: 24,
    totalUsers: 89,
    pendingPayments: 12,
    completedPayments: 144,
    monthlyGrowth: 23.5,
    weeklyGrowth: 8.2
  };

  const recentBookings = [
    { id: '1', user: 'John Doe', vehicle: 'Honda Activa', amount: 1200, status: 'completed', time: '2 hours ago' },
    { id: '2', user: 'Jane Smith', vehicle: 'TVS Jupiter', amount: 800, status: 'pending', time: '4 hours ago' },
    { id: '3', user: 'Mike Johnson', vehicle: 'Bajaj Pulsar', amount: 1500, status: 'completed', time: '6 hours ago' },
    { id: '4', user: 'Sarah Wilson', vehicle: 'Hero Splendor', amount: 900, status: 'pending', time: '8 hours ago' },
  ];

  const quickActions = [
    { name: 'Add Vehicle', icon: Plus, href: '/admin/vehicles', color: 'bg-blue-500' },
    { name: 'View Bookings', icon: Calendar, href: '/admin/bookings', color: 'bg-green-500' },
    { name: 'Payment Status', icon: CreditCard, href: '/admin/payments', color: 'bg-purple-500' },
    { name: 'User Management', icon: Users, href: '/admin/users', color: 'bg-orange-500' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/admin/vehicles')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
            <Button onClick={() => navigate('/admin/bookings')}>
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{stats.monthlyGrowth}% this month
              </div>
            </CardContent>
          </Card>

          {/* Bookings Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
              <div className="flex items-center text-sm text-blue-600 mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{stats.weeklyGrowth}% this week
              </div>
            </CardContent>
          </Card>

          {/* Vehicles Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Vehicles</CardTitle>
              <Bike className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.activeVehicles}</div>
              <p className="text-sm text-gray-500 mt-1">Available for rent</p>
            </CardContent>
          </Card>

          {/* Users Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
              <p className="text-sm text-gray-500 mt-1">Registered customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                Payment Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed Payments</span>
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  {stats.completedPayments}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Payments</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  {stats.pendingPayments}
                </Badge>
              </div>
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/admin/payments')}
                >
                  View All Payments
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.name}
                      variant="outline"
                      className="h-20 flex-col gap-2 hover:shadow-md transition-shadow"
                      onClick={() => navigate(action.href)}
                    >
                      <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-medium">{action.name}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/bookings')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {booking.user.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.user}</p>
                      <p className="text-sm text-gray-500">{booking.vehicle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{booking.amount}</p>
                    <Badge className={getStatusColor(booking.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </div>
                    </Badge>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {booking.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
