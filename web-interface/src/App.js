import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import ProductPage from './pages/ProductPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Header />
      <h2>Path to products: {process.env.REACT_APP_PRODUCT_SERVICE}</h2>
      <h2>Path to user: {process.env.REACT_APP_USER_SERVICE}</h2>
      <ProductPage />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
