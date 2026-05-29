import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';

const RoomExperience = lazy(() => import('@/features/room/RoomExperience'));
const RecruiterPage = lazy(() => import('@/features/recruiter/RecruiterPage'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<main className="loading-screen">Preparing the portfolio...</main>}>
          <Routes>
            <Route path="/" element={<RoomExperience />} />
            <Route path="/recruiter" element={<RecruiterPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
