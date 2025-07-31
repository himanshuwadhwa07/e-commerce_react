import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = ({ search }) => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get("https://e-commerce-react-backend-dbam.onrender.com/")
      .then((res) => {
        setProductData(res.data.products);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filteredProducts = productData.filter(product =>
    product.title.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="container">
        {filteredProducts.map((elem, index) => (
          <div className="card" key={index}>
            <div className="top">
              <img src={elem.image} alt="" />
            </div>
            <div className="bottom">
              <Link to={`/admin/products/detail/${elem._id}`}>{elem.title}</Link>
              <p>{elem.description}</p>
              <h2>Price : {elem.price}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
