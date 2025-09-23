import React, { useState } from 'react';
import './PaymentModal.css'; // Add styles here or use styled-components
import { useServiceContext } from '../Context/MyContext';
import { QRCodeSVG } from 'qrcode.react';
import { Box, Typography } from '@mui/material';

const PaymentModal = ({ onNext }) => {
  const {setPaymentOption, setCashOrUpi, addDocument, cashOrUpi, addButtonClicked, setAddButtonClicked , totalPrice} = useServiceContext();
   const [showConfirmPopup, setShowConfirmPopup] = useState(false);
const [isYesDisabled, setIsYesDisabled] = useState(false);

function paymentMethod(pay){
            setAddButtonClicked(true);
setCashOrUpi(pay)
}
  const upiId = 'akarshmt-1@okicici';
  const upiUrl = `upi://pay?pa=${upiId}&pn=Akarsh%20MT&am=${totalPrice}&cu=INR`;



return (
    <div className="modal-overlay">
        {showConfirmPopup && (
  <div
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      zIndex: 9999,
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}
  >
    <p style={{ marginBottom: '1rem' }}>Are you sure about this order?</p>
 <button
  onClick={() => {
    setIsYesDisabled(true); // disable the button
    addDocument();          // call your function
    setShowConfirmPopup(false); // close the popup
    setTimeout(() => {
      setIsYesDisabled(false); // re-enable after 5 sec
    }, 5000);
  }}
  disabled={isYesDisabled}
  style={{
    marginRight: '10px',
    backgroundColor: isYesDisabled ? '#9e9e9e' : '#2f6b5f',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: isYesDisabled ? 'not-allowed' : 'pointer',
  }}
>
  {isYesDisabled ? 'Processing...' : 'Yes'}
</button>

    <button
      onClick={() => setShowConfirmPopup(false)}
      style={{
        backgroundColor: '#ccc',
        color: '#333',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
    >
      No
    </button>
  </div>
)}

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

            {cashOrUpi === 'UPI' && totalPrice > 0 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6" sx={{ color: '#2f6b5f', mb: 2 }}>
                  Scan to Pay (₹{totalPrice})
                </Typography>
                      <QRCodeSVG
    value={`upi://pay?pa=akarshmt-1@okicici&pn=Akarsh&am=${totalPrice}&cu=INR`}
    width={200}
    height={200}
    fgColor="#2f6b5f"
    bgColor="#ffffff"
    level="H"
  />
</Box>

            )}

           <button
  className={`next-btn${!cashOrUpi ? ' disabled' : ''}`}
  onClick={() => {
    if (cashOrUpi) {
      setShowConfirmPopup(true); // Show popup
    }
  }}
  disabled={!addButtonClicked}
>
  Confirm Payment →
</button>

        </div>
    </div>
);
};

export default PaymentModal;
