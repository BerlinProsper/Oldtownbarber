import React, { useState } from 'react';
import './PaymentModal.css'; // Add styles here or use styled-components
import { useServiceContext } from '../Context/MyContext';
const PaymentModal = ({ onNext }) => {
  const {setPaymentOption, setCashOrUpi, addDocument, cashOrUpi, addButtonClicked, setAddButtonClicked} = useServiceContext();
   
function paymentMethod(pay){
            setAddButtonClicked(true);
setCashOrUpi(pay)
}
return (
    <div className="modal-overlay">
        <div className="modal-container">
            <h2>Select Payment Method</h2>
            <div className="button-group">
                <button
                    className={`option-btn ${cashOrUpi === 'Cash' ? 'selected' : ''}`}
                    onClick={() =>paymentMethod('Cash') }
                >
                    💵 Cash
                </button>
                <button
                    className={`option-btn ${cashOrUpi === 'UPI' ? 'selected' : ''}`}
                    onClick={() => paymentMethod('UPI')}
                >
                    📱 UPI Transaction
                </button>
            </div>

            <button
                className={`next-btn${!cashOrUpi ? ' disabled' : ''}`}
                onClick={() => {
                    if (cashOrUpi) {
                        addDocument();
                    }
                }}
                disabled={!addButtonClicked}
            >
                Add Services →
            </button>
        </div>
    </div>
);
};

export default PaymentModal;
