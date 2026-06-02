import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LazyMotion, domMax } from 'framer-motion';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const RoomExperience = lazy(() => import('@/features/room/RoomExperience'));
const RecruiterPage = lazy(() => import('@/features/recruiter/RecruiterPage'));
const AdminLoginPage = lazy(() => import('@/features/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('@/features/admin/AdminDashboard'));

const App: React.FC = () => {
  return (
    <LazyMotion features={domMax}>
      <HashRouter>
        <ErrorBoundary>
          <Suspense fallback={<main className="loading-screen">Preparing the portfolio…</main>}>
            <Routes>
              <Route path="/" element={<RoomExperience />} />
              <Route path="/recruiter" element={<RecruiterPage />} />

              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/dashboard/*"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </HashRouter>
    </LazyMotion>
  );
};

export default App;
