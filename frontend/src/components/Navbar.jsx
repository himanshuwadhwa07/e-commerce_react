import React from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const Navbar = ({ setUser, search, setSearch }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'admin') return null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-left">
        <Link to="/admin" className="logo">Shopy</Link>
      </div>
      <div className="navbar-center">
        <input
          className="search-bar"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="navbar-right">
        <Link to="/admin/products/add" className="add-btn">
          <FaPlus /> Add Product
        </Link>
        <button className="logout-btn" onClick={handleLogout} style={{marginRight: '1rem'}}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

