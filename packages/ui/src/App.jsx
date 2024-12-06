import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layouts/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Account from './pages/Account';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />}/>
            <Route path="login" element={<Login />}/>
            <Route path="register" element={<Register />}/>

            {/* Protected routes for logged in users */}
            <Route path="dashboard/settings" element={<ProtectedRoute> <Settings/> </ProtectedRoute>}/>
            <Route path="dashboard/account" element={<ProtectedRoute> <Account/> </ProtectedRoute>}/>

            {/* Custom 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
