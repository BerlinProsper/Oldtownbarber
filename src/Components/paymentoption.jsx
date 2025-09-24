import React, { useState } from 'react';
import { useServiceContext } from '../Context/MyContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  Box,
  Typography,
  Modal,
  Paper,
  Button,
  Stack,
  Divider,
  Fade,
} from '@mui/material';

const PaymentModal = ({ onNext }) => {
  const {
    setPaymentOption,
    setCashOrUpi,
    addDocument,
    cashOrUpi,
    addButtonClicked,
    setAddButtonClicked,
    totalPrice,
  } = useServiceContext();

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isYesDisabled, setIsYesDisabled] = useState(false);

  const paymentMethod = (pay) => {
    setAddButtonClicked(true);
    setCashOrUpi(pay);
  };

  const handleConfirm = () => {
    setIsYesDisabled(true);
    addDocument();
    setShowConfirmPopup(false);
    setTimeout(() => setIsYesDisabled(false), 5000);
  };

  return (
    <Modal open onClose={() => setPaymentOption(null)}>
      <Fade in>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(0,0,0,0.5)',
            p: 2,
          }}
        >
          <Paper
            elevation={4}
            sx={{
              width: '100%',
              maxWidth: 480,
              borderRadius: 4,
              p: 4,
              bgcolor: '#ffffff',
              position: 'relative',
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: '#2f6b5f', mb: 3, textAlign: 'center' }}
            >
              Select Payment Method
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
              <Button
                variant={cashOrUpi === 'Cash' ? 'contained' : 'outlined'}
                onClick={() => paymentMethod('Cash')}
                sx={{
                  minWidth: 120,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  bgcolor: cashOrUpi === 'Cash' ? '#2f6b5f' : 'transparent',
                  color: cashOrUpi === 'Cash' ? '#fff' : '#2f6b5f',
                  borderColor: '#2f6b5f',
                  '&:hover': {
                    bgcolor: cashOrUpi === 'Cash' ? '#417c70' : '#edf8f6',
                  },
                }}
              >
                💵 Cash
              </Button>

              <Button
                variant={cashOrUpi === 'UPI' ? 'contained' : 'outlined'}
                onClick={() => paymentMethod('UPI')}
                sx={{
                  minWidth: 160,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  bgcolor: cashOrUpi === 'UPI' ? '#2f6b5f' : 'transparent',
                  color: cashOrUpi === 'UPI' ? '#fff' : '#2f6b5f',
                  borderColor: '#2f6b5f',
                  '&:hover': {
                    bgcolor: cashOrUpi === 'UPI' ? '#417c70' : '#edf8f6',
                  },
                }}
              >
                📱 UPI Transaction
              </Button>
            </Stack>

            {cashOrUpi === 'UPI' && totalPrice > 0 && (
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: '#2f6b5f', fontWeight: 600, mb: 1 }}
                >
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

            <Divider sx={{ my: 3 }} />

            <Box textAlign="center">
              <Button
                variant="contained"
                fullWidth
                disabled={!addButtonClicked}
                onClick={() => {
                  if (cashOrUpi) {
                    setShowConfirmPopup(true);
                  }
                }}
                sx={{
                  backgroundColor: addButtonClicked ? '#2f6b5f' : '#bdbdbd',
                  color: '#fff',
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  py: 1.3,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: addButtonClicked ? '#417c70' : '#bdbdbd',
                  },
                }}
              >
                Confirm Payment →
              </Button>
            </Box>

            {/* Confirm Popup Modal */}
            {showConfirmPopup && (
              <Modal open onClose={() => setShowConfirmPopup(false)}>
                <Fade in>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      bgcolor: '#fff',
                      p: 4,
                      borderRadius: 3,
                      boxShadow: 24,
                      textAlign: 'center',
                      width: '90%',
                      maxWidth: 360,
                    }}
                  >
                    <Typography sx={{ mb: 2, fontWeight: 600 }}>
                      Are you sure about this order?
                    </Typography>

                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Button
                        variant="contained"
                        onClick={handleConfirm}
                        disabled={isYesDisabled}
                        sx={{
                          bgcolor: isYesDisabled ? '#9e9e9e' : '#2f6b5f',
                          color: '#fff',
                          fontWeight: 600,
                          px: 3,
                          '&:hover': {
                            bgcolor: isYesDisabled ? '#9e9e9e' : '#417c70',
                          },
                        }}
                      >
                        {isYesDisabled ? 'Processing...' : 'Yes'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setShowConfirmPopup(false)}
                        sx={{
                          borderColor: '#2f6b5f',
                          color: '#2f6b5f',
                          fontWeight: 600,
                          px: 3,
                          '&:hover': {
                            bgcolor: '#edf8f6',
                          },
                        }}
                      >
                        No
                      </Button>
                    </Stack>
                  </Box>
                </Fade>
              </Modal>
            )}
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PaymentModal;
