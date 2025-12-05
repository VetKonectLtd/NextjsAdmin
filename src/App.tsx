import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { ContentPage } from "@/pages/ContentPage";
import { SubscriptionPage } from "@/pages/SubscriptionPage";
import { PromotionPage } from "@/pages/PromotionPage";
import { ActivitiesPage } from "@/pages/ActivitiesPage";
import { BlogPage } from "@/pages/BlogPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users-features"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/content"
          element={
            <ProtectedRoute>
              <Layout>
                <ContentPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <Layout>
                <SubscriptionPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/promotion"
          element={
            <ProtectedRoute>
              <Layout>
                <PromotionPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/activities"
          element={
            <ProtectedRoute>
              <Layout>
                <ActivitiesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog"
          element={
            <ProtectedRoute>
              <Layout>
                <BlogPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
