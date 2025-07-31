import React from 'react';
import './UserNavbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const UserNavbar = ({ setUser, search, setSearch }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'user') return null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="user-navbar">
      <div className="nav-left">
        <Link to="/" className="logo">Shopy</Link>
      </div>
      <div className="nav-center">
        <input
          className="search-bar"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="nav-right">
        <Link to="/cart" className="cart-button">
          <FaShoppingCart />
        </Link>
        <button className="logout-btn" onClick={handleLogout} style={{marginRight: '1rem'}}>Logout</button>
      </div>
    </nav>
  );
};

export default UserNavbar;
