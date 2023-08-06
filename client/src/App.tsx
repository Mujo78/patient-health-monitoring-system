import React from 'react'

import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom'
import AppLayout from './pages/AppLayout'
import LandingPage from './pages/LandingPage'
import HomeLayout from './pages/HomeLayout'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/auth/ForgotPassword'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<AppLayout />}>
    <Route index element={<LandingPage />} />
    <Route path='/' element={<HomeLayout />}>
      <Route path='/dashboard' element={<Dashboard />} />
    </Route>
    <Route path='api/v1/user/reset-password/:token' element={<ForgotPassword />} />
  </Route>
))

const App: React.FC = () => {
  return <RouterProvider router={router} />
}

export default App
