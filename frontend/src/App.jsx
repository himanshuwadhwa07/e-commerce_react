import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UserNavbar from './components/UserNavbar';
import 'remixicon/fonts/remixicon.css';
import AddProducts from "./Pages/AddProducts";
import { Routes , Route, useLocation } from 'react-router-dom';
import UserHome from './Pages/UserHome';
import ProductDetail from './Pages/ProductDetail';
import Home from './Pages/Home';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Payment from './Pages/Payment';

const App = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [search, setSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, [location.pathname]);

  return (
    <div>
      {user && user.role === 'admin' && <Navbar setUser={setUser} search={search} setSearch={setSearch} />}
      {user && user.role === 'user' && <UserNavbar setUser={setUser} search={search} setSearch={setSearch} />}
      <Routes>
        <Route path='/login' element={<Login setUser={setUser} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={
          <ProtectedRoute>
            <UserHome search={search} />
          </ProtectedRoute>
        }/>
        <Route path='/products/detail/:productId' element={
          <ProtectedRoute>
            <ProductDetail/>
          </ProtectedRoute>
        }/>
        <Route path='/cart' element={
          <ProtectedRoute>
            <Cart/>
          </ProtectedRoute>
        }/>
        <Route path='/payment' element={<Payment />} />
        <Route path='/admin/' element={
          <ProtectedRoute>
            <Home search={search} />
          </ProtectedRoute>
        }/>
        <Route path='/admin/products/add' element={
          <ProtectedRoute>
            <AddProducts/>
          </ProtectedRoute>
        }/>
        <Route path='/admin/products/detail/:productId' element={
          <ProtectedRoute>
            <ProductDetail/>
          </ProtectedRoute>
        }/>
      </Routes> 
    </div>
  )
}

export default App;
