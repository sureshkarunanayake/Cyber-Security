import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import Product from './Pages/Product';
import Bill from './Pages/Bill';
import Profile from './Pages/Profile';
import AddProduct from './Pages/Product/AddProduct';
import UpdateProduct from './Pages/Product/UpdateProduct';
import User from './Pages/User';
import DashboardCashier from './Pages/DashboardCashier';
import DashboardUser from './Pages/DashboardUser';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/product" element={<ProtectedRoute><Product /></ProtectedRoute>} />
          <Route path="/bill" element={<ProtectedRoute><Bill /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path="/update-product" element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
          <Route path="/dashboard-cashier" element={<ProtectedRoute><DashboardCashier /></ProtectedRoute>} />
          <Route path="/dashboard-user" element={<ProtectedRoute><DashboardUser /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
