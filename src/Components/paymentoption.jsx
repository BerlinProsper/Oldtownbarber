import React, { useState } from 'react';
import { useServiceContext } from '../Context/MyContext';
import { QRCodeSVG } from 'qrcode.react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import {
  Box,
  Typography,
  TextField,
  Modal,
  Paper,
  Button,
  Stack,
  Divider,
  Fade,
  useMediaQuery,
  useTheme
} from '@mui/material';

const PaymentModal = ({ onClose }) => {
  const {
    setPaymentOption,
    setCashOrUpi,
    addDocument,
    cashOrUpi,
    addButtonClicked,
    setAddButtonClicked,
    totalPrice,
    splitUPI,
    setSplitUPI,
    finalTotal,

  } = useServiceContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // sm = 600px
  const [splitMSG, setSplitMSG] = useState('');
  const [showSplitQR, setShowSplitQR] = useState(false);
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
            <IconButton
  onClick={onClose}
  sx={{
    position: 'absolute',
    top: 16,
    left: 16,
    color: '#2f6b5f',
    backgroundColor: '#e0f2f1',
    '&:hover': {
      backgroundColor: '#c8e6c9',
    },
  }}
>
  <CloseIcon />
</IconButton>

          <Paper
            elevation={4}
            sx={{
              width: '100%',
              maxWidth: 480,
              borderRadius: 4,
              p: isMobile ? 2 : 4,
              bgcolor: '#ffffff',
              position: 'relative',
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                fontWeight: 800,
                color: '#2f6b5f',
                mb: isMobile ? 2 : 3,
                textAlign: 'center',
              }}
            >
              Select Payment Method
            </Typography>

            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 3 }}
            >
              {['Cash', 'UPI', 'CashUPI'].map((method) => (
                <Button
                  key={method}
                  variant={cashOrUpi === method ? 'contained' : 'outlined'}
                  onClick={() => paymentMethod(method)}
                  sx={{
                    minWidth: 120,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    bgcolor: cashOrUpi === method ? '#2f6b5f' : 'transparent',
                    color: cashOrUpi === method ? '#fff' : '#2f6b5f',
                    borderColor: '#2f6b5f',
                    '&:hover': {
                      bgcolor: cashOrUpi === method ? '#417c70' : '#edf8f6',
                    },
                  }}
                >
                  {method === 'Cash'
                    ? '💵 Cash'
                    : method === 'UPI'
                    ? '📱 UPI'
                    : 'Cash ➕UPI'}
                </Button>
              ))}
            </Stack>

            {/* --- UPI QR --- */}
            {cashOrUpi === 'UPI' && finalTotal > 0 && (
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: '#2f6b5f', fontWeight: 600, mb: 1 }}
                >
                  Scan to Pay (₹{finalTotal})
                </Typography>

                <QRCodeSVG
                  value={`upi://pay?pa=akarshmt-2@okaxis&pn=Akarsh&am=${finalTotal}&cu=INR`}
                  width={180}
                  height={180}
                  fgColor="#2f6b5f"
                  bgColor="#ffffff"
                  level="H"
                />
              </Box>
            )}

            {/* --- Cash + UPI Split --- */}
            {cashOrUpi === 'CashUPI' && finalTotal > 0 && (
              <Box sx={{ textAlign: 'center', my: 4 }}>
                {!showSplitQR ? (
                  <>
                    <TextField
                      label="Enter UPI Amount"
                      variant="outlined"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={splitUPI}
                      onChange={(e) => setSplitUPI(e.target.value)}
                      fullWidth
                      required
                      InputProps={{
                        sx: {
                          borderRadius: '12px',
                          backgroundColor: '#fff',
                          fontSize: '1rem',
                        },
                      }}
                    />

                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: '#2f6b5f',
                        '&:hover': { backgroundColor: '#6ca499ff' },
                        fontWeight: 600,
                        borderRadius: '12px',
                        py: 1.2,
                        fontSize: '1rem',
                      }}
                      fullWidth
                      onClick={() => {
                        const upiAmount = parseFloat(splitUPI);
                        if (!upiAmount || isNaN(upiAmount)) {
                          alert("Please enter a valid UPI amount.");
                          return;
                        }
                        if (upiAmount <= finalTotal) {
                          setSplitMSG(
                            `₹${upiAmount} to be paid via UPI and ₹${finalTotal - upiAmount
                            } to be paid in Cash.`
                          );
                          setShowSplitQR(true);
                        } else {
                          setSplitMSG(
                            `Split amount cannot exceed total price ₹${finalTotal}. ₹${upiAmount} is too high.`
                          );
                          setSplitUPI(0);
                        }
                      }}
                    >
                      Next
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: '#2f6b5f', fontWeight: 600, mb: 1 }}
                    >
                      Scan to Pay (₹{splitUPI})
                    </Typography>

                    <QRCodeSVG
                      value={`upi://pay?pa=akarshmt-1@okicici&pn=Akarsh&am=${splitUPI}&cu=INR`}
                      width={180}
                      height={180}
                      fgColor="#2f6b5f"
                      bgColor="#ffffff"
                      level="H"
                    />
                       <Typography
                      variant="subtitle1"
                      sx={{ color: '#2f6b5f', fontWeight: 300, mb: 1 }}
                    >
{splitMSG}                    </Typography>
                       <Button
                  variant="contained"
                  fullWidth
                  disabled={!addButtonClicked}
                  onClick={() => {
                    if (cashOrUpi) setShowConfirmPopup(true);
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
                  </>
                )}
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Confirm Button (if not CashUPI) */}
            {cashOrUpi !== 'CashUPI' && (
              <Box textAlign="center">
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!addButtonClicked}
                  onClick={() => {
                    if (cashOrUpi) setShowConfirmPopup(true);
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
            )}

            {/* Confirm Modal */}
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
