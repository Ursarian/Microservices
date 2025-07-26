import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import ProductPage from './pages/ProductPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './components/NotFound';
import { AuthProvider } from './context/AuthContext';
import styles from './App.module.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className={styles.container}>
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/" element={<ProductPage />} />

            {/* Catch 404 Not Found routes */}
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
