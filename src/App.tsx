import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Bookings from "./pages/Bookings";
import Payment from "./pages/Payment";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import WhatsAppButton from "@/components/WhatsAppButton";
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import VehicleManagement from './pages/admin/VehicleManagement';
import PaymentTracking from './pages/admin/PaymentTracking';
import { useAdmin } from './hooks/useAdmin';
import ErrorBoundary from './components/ErrorBoundary';
import PaymentErrorBoundary from './components/PaymentErrorBoundary';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading } = useAdmin();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Test route for debugging */}
      <Route path="/test" element={<div className="p-8 text-center"><h1 className="text-2xl">Test Route Working!</h1></div>} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin/dashboard" 
        element={<AdminRoute><AdminDashboard /></AdminRoute>} 
      />
      <Route 
        path="/admin/vehicles" 
        element={<AdminRoute><VehicleManagement /></AdminRoute>} 
      />
      <Route 
        path="/admin/payments" 
        element={<AdminRoute><PaymentTracking /></AdminRoute>} 
      />
      
      {/* Protected User Routes */}
      <Route 
        path="/bookings" 
        element={<ProtectedRoute><Bookings /></ProtectedRoute>} 
      />
      
      {/* Payment Route - Accessible but handles auth internally */}
      <Route path="/payment" element={<PaymentErrorBoundary><Payment /></PaymentErrorBoundary>} />
      
      {/* Additional fallback routes for common paths */}
      <Route path="/payment/*" element={<PaymentErrorBoundary><Payment /></PaymentErrorBoundary>} />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <AppRoutes />
            <WhatsAppButton phoneNumber="917892227029" message="Hi! I need help with my bike booking." />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
