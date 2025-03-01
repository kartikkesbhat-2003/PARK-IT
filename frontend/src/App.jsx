import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import { TermsAndConditionPage } from './components/user/global/TermsAndConditions'
import { Footer } from './components/user/global/Footer'
import { PrivacyPolicy } from './components/user/global/PrivacyPolicy'
import { ReturnRefundPolicy } from './components/user/global/RefundShippingPolicy'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { OpenRoute } from './components/core/auth/OpenRoute'
import { VerifyEmail } from './pages/VerifyEmail'
import { Navbar } from './components/user/global/Navbar'
import { AnimatePresence, motion } from 'framer-motion'
import PrivateRoute from './components/core/auth/PrivateRoute'
import { Spot } from './components/user/spot/Spot'
import { ForgotPassword } from './pages/ForgotPassword'
import { UpdatePassword } from './pages/UpdatePassword'
import { AddSpots } from './components/user/spot/AddSpots'

export const App = () => {
  const location = useLocation();

  return (
    <div className="w-screen min-h-screen flex flex-col background-pure-greys-100">

      <div
        className="absolute inset-x-0 overflow-hidden -top-10 -z-10 transform-gpu blur-3xl sm:-top-10 background-pure-greys-200 "
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#e06d9f] to-[#7d77e5] opacity-50 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.4% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <Navbar />

      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.key}>
          <Route path="/" element={<Home />} />
          <Route path="/terms-conditions" element={<TermsAndConditionPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<ReturnRefundPolicy />} />

          <Route path="signup"
            element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />

          <Route path="login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          <Route path="verify-email"
            element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />

          <Route
            path="forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />

          <Route path='spots'
            element={
              <PrivateRoute>
                <Spot/>
              </PrivateRoute>
            }
          />

          <Route
            path="update-password/:token"
            element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />

          <Route
            path='create-parking-spot'
            element={
              <PrivateRoute>
                <AddSpots/>
              </PrivateRoute>
            }
            />

        </Routes>
      </AnimatePresence>

    </div>
  )
}
