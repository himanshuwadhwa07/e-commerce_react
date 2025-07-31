import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css';
import { useNavigate } from 'react-router-dom';

// Generate or retrieve a unique userId for this browser session
function getOrCreateUserId() {
  let userId = localStorage.getItem('dummyUserId');
  if (!userId) {
    userId = Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join('');
    localStorage.setItem('dummyUserId', userId);
  }
  return userId;
}

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const userId = getOrCreateUserId();
            const response = await axios.get(`http://localhost:3000/cart/${userId}`);
            setCartItems(response.data.items || []);
            setTotal(response.data.total || 0);
        } catch (error) {
            setMessage('Failed to load cart items');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const userId = getOrCreateUserId();
            await axios.put("http://localhost:3000/cart/update", {
                userId: userId,
                productId: productId,
                quantity: newQuantity
            });
            fetchCartItems();
        } catch (error) {
            setMessage('Failed to update quantity');
        }
    };

    const removeItem = async (productId) => {
        try {
            const userId = getOrCreateUserId();
            await axios.delete("http://localhost:3000/cart/remove", {
                data: {
                    userId: userId,
                    productId: productId
                }
            });
            fetchCartItems();
            setMessage('Item removed from cart');
        } catch (error) {
            setMessage('Failed to remove item');
        }
    };

    const clearCart = async () => {
        try {
            const userId = getOrCreateUserId();
            await axios.delete(`http://localhost:3000/cart/clear/${userId}`);
            setCartItems([]);
            setTotal(0);
            setMessage('Cart cleared successfully');
        } catch (error) {
            setMessage('Failed to clear cart');
        }
    };

    if (loading) {
        return <div className="cart-loading">Loading cart...</div>;
    }

    return (
        <div className="cart-container">
            <h1>Shopping Cart</h1>
            {message && (
                <div className={`cart-message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <h2>Your cart is empty</h2>
                    <p>Add some products to your cart to see them here!</p>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <div className="item-image">
                                    <img src={item.product.image} alt={item.product.title} />
                                </div>
                                <div className="item-details">
                                    <h3>{item.product.title}</h3>
                                    <p>{item.product.description}</p>
                                    <p className="item-price">₹{item.price}</p>
                                </div>
                                <div className="item-actions">
                                    <div className="quantity-controls">
                                        <button 
                                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button 
                                        className="remove-btn"
                                        onClick={() => removeItem(item.product._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="item-total">
                                    ₹{item.price * item.quantity}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <div className="cart-total">
                            <h3>Total: ₹{total}</h3>
                        </div>
                        <div className="cart-actions">
                            <button className="clear-cart-btn" onClick={clearCart}>
                                Clear Cart
                            </button>
                            <button className="checkout-btn" onClick={() => navigate('/payment')}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart; 