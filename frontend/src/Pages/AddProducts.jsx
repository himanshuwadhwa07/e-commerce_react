import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProducts.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../dark-theme.css';

const AddProducts = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const updateId = searchParams.get('updateId');

    const [title, settitle] = useState('');
    const [image, setimage] = useState('');
    const [description, setdescription] = useState('');
    const [category, setcategory] = useState('');
    const [price, setprice] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch product details if updateId is present
    useEffect(() => {
        if (updateId) {
            setLoading(true);
            axios.get(`http://localhost:3000/products/${updateId}`)
                .then(res => {
                    const product = res.data.product;
                    settitle(product.title || '');
                    setdescription(product.description || '');
                    setcategory(product.category || '');
                    setprice(product.price || '');
                    setimage(''); // Don't prefill file input
                })
                .catch(err => {
                    alert('Failed to fetch product details');
                })
                .finally(() => setLoading(false));
        }
    }, [updateId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);

        if (updateId) {
            // Update product
            axios.post(`http://localhost:3000/products/update/${updateId}`, formData)
                .then((res) => {
                    alert('Product updated successfully!');
                    navigate('/admin/');
                })
                .catch((err) => {
                    alert('Failed to update product.');
                });
        } else {
            // Add new product
            axios.post("http://localhost:3000/products/add", formData)
                .then((res) => {
                    alert('Product added successfully!');
                    navigate("/");
                })
                .catch((err) => {
                    alert('Failed to add product.');
                });
        }
    };

    return (
        <div className='formContainer'>
            <form onSubmit={handleSubmit}>
                <div className="formGroup">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        placeholder="Enter product title"
                        value={title}
                        onChange={(e) => settitle(e.target.value)}
                        name="title"
                        id="title"
                        required
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setimage(e.target.files[0])}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        placeholder="Enter product description"
                        name="description"
                        id="description"
                        value={description}
                        onChange={(e) => setdescription(e.target.value)}
                        required
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        placeholder="Enter product category"
                        name="category"
                        id="category"
                        value={category}
                        onChange={(e) => setcategory(e.target.value)}
                        required
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        placeholder="Enter product price"
                        name="price"
                        id="price"
                        value={price}
                        onChange={(e) => setprice(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {updateId ? (loading ? 'Updating...' : 'Update Product') : (loading ? 'Adding...' : 'Add Product')}
                </button>
            </form>
        </div>
    );
};

export default AddProducts;