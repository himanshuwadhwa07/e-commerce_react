import React, { useState } from 'react';
import './Payment.css';

const Payment = () => {
  const [paid, setPaid] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setPaid(true);
  };

  return (
    <div className="payment-container">
      <form className="payment-form" onSubmit={handlePay}>
        <h2>Demo Payment</h2>
        <input type="text" placeholder="Card Number" required />
        <input type="text" placeholder="MM/YY" required />
        <input type="text" placeholder="CVC" required />
        <button type="submit">Pay</button>
        {paid && <div className="payment-success">Payment Successful! (Demo)</div>}
      </form>
    </div>
  );
};

export default Payment;