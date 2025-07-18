import { Link } from 'react-router-dom';

function Header() {
    return (
        <nav style={{ padding: '10px', background: '#eee' }}>
            <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
            <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
            <Link to="/profile">Profile</Link>
        </nav>
    );
}

export default Header;