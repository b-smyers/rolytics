import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Experiences from './pages/Experiences';
import Experience from './pages/Experience';
import Place from './pages/Place';
import Connect from './pages/Connect';
import Account from './pages/Account';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Landing />}/>
            <Route path="login" element={<Login />}/>
            <Route path="register" element={<Register />}/>

            {/* Protected routes for logged in users */}
            <Route path="dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
            <Route path="dashboard/settings" element={<ProtectedRoute> <Settings /> </ProtectedRoute>}/>
            <Route path="dashboard/account" element={<ProtectedRoute> <Account /> </ProtectedRoute>}/>
            <Route path="dashboard/experiences" element={<ProtectedRoute> <Experiences /> </ProtectedRoute>}/>
            <Route path="dashboard/experiences/connect" element={<ProtectedRoute> <Connect /> </ProtectedRoute>}/>
            <Route path="dashboard/experiences/:experience_id" element={<ProtectedRoute> <Experience /> </ProtectedRoute>}/>
            <Route path="dashboard/experiences/:experience_id/:place_id" element={<ProtectedRoute> <Place /> </ProtectedRoute>}/>

            {/* Custom 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
