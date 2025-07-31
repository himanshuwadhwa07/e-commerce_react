import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import "./productDetail.css"
import axios from 'axios'
import{ useState } from 'react';

// Generate or retrieve a unique userId for this browser session
function getOrCreateUserId() {
  let userId = localStorage.getItem('dummyUserId');
  if (!userId) {
    // Generate a random 24-character hex string (like a MongoDB ObjectId)
    userId = Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join('');
    localStorage.setItem('dummyUserId', userId);
  }
  return userId;
}

const ProductDetail = () => {

   const {productId} = useParams()
   const [productData, setProductData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState('');
   const navigate = useNavigate();
   const user = JSON.parse(localStorage.getItem('user'));
   
    useEffect(() => {
        getProductDetail()

    }, [productId])
    

    const getProductDetail = async()=>{

       await axios.get("https://e-commerce-react-backend-dbam.onrender.com/products/"+productId)
        .then((res)=>{
            console.log(res);
            setProductData(res.data.product);
            
        })
        .catch((err)=>{
            console.log(err);
        })

    }

    const addToCart = async () => {
        setLoading(true);
        setMessage('');
        
        try {
            const userId = getOrCreateUserId();
            const response = await axios.post("https://e-commerce-react-backend-dbam.onrender.com/cart/add", {
                userId: userId,
                productId: productId,
                quantity: 1
            });
            setMessage('Product added to cart successfully!');
            console.log('Cart response:', response.data);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setMessage('Failed to add product to cart. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await axios.get(`https://e-commerce-react-backend-dbam.onrender.com/products/delete/${productId}`);
            alert('Product deleted successfully!');
            navigate('/admin/');
        } catch (error) {
            alert('Failed to delete product.');
        }
    }

    const handleUpdate = () => {
        navigate(`/admin/products/add?updateId=${productId}`);
    }

  return (
    <div className='home'>
     
      <div className="pr">
        <div className="img"> <img src={productData.image} alt="Product"  /></div>
            <div>
                <div>
                  <h1>{productData.title}</h1><br />
                  <h2>Price: ₹{productData.price}</h2><br />
                  <p>{productData.description}</p><br />
                  <p><b>Category:</b> {productData.category}</p><br />

                </div>
                
                <div className="buttons">
                  {/* Show buttons based on user role */}
                  {user && user.role === 'user' && (
                    <>
                      <button 
                        onClick={addToCart} 
                        disabled={loading}
                        style={{ 
                            backgroundColor: loading ? '#ccc' : '#007bff',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {loading ? 'Adding...' : 'Add to Cart'}
                      </button>
                      <button onClick={() => navigate('/payment')}>Buy now</button>
                    </>
                  )}
                  {user && user.role === 'admin' && (
                    <>
                      <button onClick={handleUpdate} style={{backgroundColor: '#ffc107', color: '#333', marginRight: '10px'}}>Update</button>
                      <button onClick={handleDelete} style={{backgroundColor: '#dc3545', color: 'white'}}>Delete</button>
                    </>
                  )}
                </div>
               
               {message && (
                   <div style={{ 
                       marginTop: '10px', 
                       padding: '10px', 
                       backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
                       color: message.includes('successfully') ? '#155724' : '#721c24',
                       borderRadius: '5px',
                       textAlign: 'center'
                   }}>
                       {message}
                   </div>
               )} 

            </div>

      </div>
    </div>
  )
}

export default ProductDetail
