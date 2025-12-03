import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { ContentPage } from "@/pages/ContentPage";
import { SubscriptionPage } from "@/pages/SubscriptionPage";
import { PromotionPage } from "@/pages/PromotionPage";
import { ActivitiesPage } from "@/pages/ActivitiesPage";
import { BlogPage } from "@/pages/BlogPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/users"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/content"
          element={
            <Layout>
              <ContentPage />
            </Layout>
          }
        />
        <Route
          path="/subscription"
          element={
            <Layout>
              <SubscriptionPage />
            </Layout>
          }
        />
        <Route
          path="/promotion"
          element={
            <Layout>
              <PromotionPage />
            </Layout>
          }
        />
        <Route
          path="/activities"
          element={
            <Layout>
              <ActivitiesPage />
            </Layout>
          }
        />
        <Route
          path="/blog"
          element={
            <Layout>
              <BlogPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
