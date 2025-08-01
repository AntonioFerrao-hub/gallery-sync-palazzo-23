import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { useAuth } from "./hooks/useAuth";
import { LoginForm } from "./components/LoginForm";
import { PublicGallery } from "./pages/PublicGallery";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminCategories } from "./pages/AdminCategories";
import { AdminPhotos } from "./pages/AdminPhotos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <LoginForm />;
  }

  return <>{children}</>;
}

// Admin Route Component  
function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={PublicGallery} />
          <Route path="/login" component={LoginForm} />
          
          {/* Admin Routes */}
          <Route path="/admin">
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </Route>
          <Route path="/admin/categories">
            <AdminRoute>
              <AdminCategories />
            </AdminRoute>
          </Route>
          <Route path="/admin/photos">
            <AdminRoute>
              <AdminPhotos />
            </AdminRoute>
          </Route>
          
          {/* Catch-all route for 404 */}
          <Route component={NotFound} />
        </Switch>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
