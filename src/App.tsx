import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layout & Global Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingActions } from './components/common/FloatingActions';
import { CustomCursor } from './components/common/CustomCursor';
import { ScrollToTop } from './components/common/ScrollToTop';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { TrainersPage } from './pages/TrainersPage';
import { MembershipPage } from './pages/MembershipPage';
import { FreeTrialPage } from './pages/FreeTrialPage';
import { TransformationsPage } from './pages/TransformationsPage';
import { GalleryPage } from './pages/GalleryPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';

// Calculators & Tools
import { BmiCalculatorPage } from './pages/BmiCalculatorPage';
import { CalorieCalculatorPage } from './pages/CalorieCalculatorPage';
import { WorkoutPlannerPage } from './pages/WorkoutPlannerPage';

// Legal Pages
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

// Admin Pages & Protected Routing
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminMemberships } from './pages/admin/AdminMemberships';
import { AdminPrograms } from './pages/admin/AdminPrograms';
import { AdminTrainers } from './pages/admin/AdminTrainers';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';

// 404 Page
import { NotFoundPage } from './pages/NotFoundPage';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-[#FAFAFA] antialiased selection:bg-[#FFD400] selection:text-black">
      {/* Top Sticky Navigation (Public routes only) */}
      {!isAdminRoute && <Navbar />}

      {/* Dynamic Route Viewports */}
      <div className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/programs/:slug" element={<ProgramDetailPage />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/free-trial" element={<FreeTrialPage />} />
          <Route path="/transformations" element={<TransformationsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Interactive Fitness Calculation Tools */}
          <Route path="/bmi-calculator" element={<BmiCalculatorPage />} />
          <Route path="/calorie-calculator" element={<CalorieCalculatorPage />} />
          <Route path="/workout-planner" element={<WorkoutPlannerPage />} />

          {/* Legal */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* ==================================================== */}
          {/* ADMIN AUTHENTICATION & PORTAL                        */}
          {/* ==================================================== */}
          {/* /admin/login opens Admin Login page */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Core Master Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />

          <Route
            path="/admin/memberships"
            element={
              <AdminProtectedRoute>
                <AdminMemberships />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/programs"
            element={
              <AdminProtectedRoute>
                <AdminPrograms />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/trainers"
            element={
              <AdminProtectedRoute>
                <AdminTrainers />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <AdminProtectedRoute>
                <AdminBookings />
              </AdminProtectedRoute>
            }
          />
          <Route path="/admin/trainer-bookings" element={<Navigate to="/admin/bookings" replace />} />

          <Route
            path="/admin/messages"
            element={
              <AdminProtectedRoute>
                <AdminMessages />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <AdminProtectedRoute>
                <AdminSettings />
              </AdminProtectedRoute>
            }
          />

          {/* Subroutes & Lead Management (Preserved for backward compatibility) */}
          <Route
            path="/admin/leads"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage view="leads" />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/free-trials"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage view="free-trials" />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage view="gallery" />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/transformations"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage view="transformations" />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage view="testimonials" />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/faqs"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage view="faqs" />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/storage"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage view="storage" />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage view="profile" />
              </AdminProtectedRoute>
            }
          />

          {/* 404 Not Found Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Global Footer (Public routes only) */}
      {!isAdminRoute && <Footer />}

      {/* Quick Contact Floaters (WhatsApp & Call) (Public routes only) */}
      {!isAdminRoute && <FloatingActions />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CustomCursor />
      <AppLayout />
    </BrowserRouter>
  );
}
