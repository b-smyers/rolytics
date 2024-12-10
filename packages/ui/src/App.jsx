import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Experiences from './pages/Experiences';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />}/>
            <Route path="dashboard/settings" element={<Settings />}/>
            <Route path="dashboard/experiences" element={<Experiences />}/>
            <Route path="login" element={<Login />}/>
            <Route path="register" element={<Register />}/>

            {/* Custom 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
