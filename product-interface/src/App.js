import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductPage from './pages/ProductPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <ProductPage />
    </Router>
  );
}

export default App;
