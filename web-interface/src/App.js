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
