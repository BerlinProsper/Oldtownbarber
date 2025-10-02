import React, { useState, useEffect } from 'react';
import { useServiceContext } from '../Context/MyContext';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  Fade,
  TextField,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import PaymentModal from '../Components/paymentoption';

const MyCart = () => {
  const [openPayment, setOpenPayment] = useState(false);
  const [showInputs, setShowInputs] = useState(false);

  const {
    selectedService,
    setSelectedService,
    addDocument,
    totalPrice,
    setTipValue,
    tipValue,
    setDiscountValue,
    discountValue,
    emptyCart,
    setTotalPrice,
    discount,
    addATip,
    finalTotal,
    setFinalTotal
  } = useServiceContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const hasItems = selectedService && selectedService.length > 0;

  useEffect(() => {
    setFinalTotal(totalPrice);
  }, []);

  const handleRemoveItem = (indexToRemove) => {
    setSelectedService((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setTotalPrice((prevTotal) => prevTotal - (selectedService[indexToRemove]?.price || 0));
  };

  const handleApplyAdjustments = () => {
    const tip = parseFloat(tipValue) || 0;
    const disc = parseFloat(discountValue) || 0;
    setFinalTotal(totalPrice + tip - disc);
    addATip(tip);
    discount(disc);
    setShowInputs(false);
    setTipValue('');
    setDiscountValue('');
  };

  return (
    <>
      {openPayment && <PaymentModal onClose={() => setOpenPayment(false)} />}

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #d9f0ec 0%, #ffffff 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: 2,
          fontFamily: 'Nunito, sans-serif',
        }}
      >
        <Fade in timeout={500}>
          <Paper
            elevation={6}
            sx={{
              width: '100%',
              maxWidth: 380,
              mt: 5,
              px: 3,
              py: 3.5,
              borderRadius: '16px',
              backgroundColor: '#f9fefc',
              border: '1px solid #c6e6dd',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                fontWeight: 800,
                color: '#2f6b5f',
                mb: 2,
              }}
            >
             Cart
            </Typography>

            {hasItems ? (
              <>
                <List disablePadding>
                  {selectedService.map((item, index) => (
                    <React.Fragment key={item.id || index}>
                      <ListItem
                        disableGutters
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 1,
                        }}
                      >
                        <ListItemText
                          primary={item.name}
                          secondary={`₹${item.price}`}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            fontSize: '1rem',
                            color: '#2f6b5f',
                          }}
                          secondaryTypographyProps={{
                            fontSize: '0.85rem',
                            color: '#417c70',
                          }}
                        />
                        <IconButton
                          onClick={() => handleRemoveItem(index)}
                          sx={{ color: '#b71c1c' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                      {index < selectedService.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>

                {/* Final Total Box */}
                <Box
                  sx={{
                    backgroundColor: '#e4f7f2',
                    borderRadius: '10px',
                    p: 1.5,
                    mt: 3,
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: '#1d5c4f',
                      fontSize: '1.05rem',
                    }}
                  >
                    💰 Final Total: ₹{finalTotal.toFixed(2)}
                  </Typography>
                </Box>

                {/* Tip & Discount Inputs */}
                <Box sx={{ mt: 3 }}>
                  <Button
                    onClick={() => setShowInputs((prev) => !prev)}
                    sx={{
                      fontWeight: 600,
                      textTransform: 'none',
                      color: '#2f6b5f',
                      mb: 1,
                      '&:hover': { backgroundColor: '#e0f2f1' },
                    }}
                  >
                    ➕ Tip & Discount
                  </Button>

                  {showInputs && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        size="small"
                        type="number"
                        value={tipValue}
                        onChange={(e) => setTipValue(e.target.value)}
                        placeholder="Tip"
                        variant="outlined"
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        size="small"
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        placeholder="Discount"
                        variant="outlined"
                        sx={{ flex: 1 }}
                      />
                      <Button
                        variant="outlined"
                        onClick={handleApplyAdjustments}
                        sx={{ minWidth: 40, px: 2 }}
                      >
                        OK
                      </Button>
                    </Stack>
                  )}
                </Box>

                {/* Action Buttons */}
                <Stack
                  direction={isMobile ? 'column' : 'row'}
                  spacing={2}
                  sx={{ mt: 4 }}
                  justifyContent="center"
                >
                  <Button
                    variant="contained"
                    onClick={() => setOpenPayment(true)}
                    fullWidth={isMobile}
                    sx={{
                      backgroundColor: '#2f6b5f',
                      '&:hover': { backgroundColor: '#417c70' },
                      fontWeight: 700,
                      borderRadius: '10px',
                      fontSize: '1rem',
                      py: 1.2,
                      textTransform: 'none',
                    }}
                  >
                    ✅ Confirm Order
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={emptyCart}
                    fullWidth={isMobile}
                    sx={{
                      borderColor: '#2f6b5f',
                      color: '#2f6b5f',
                      fontWeight: 700,
                      borderRadius: '10px',
                      fontSize: '1rem',
                      py: 1.2,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#e3f1f0',
                        borderColor: '#2f6b5f',
                      },
                    }}
                  >
                    🗑️ Empty Cart
                  </Button>
                </Stack>
              </>
            ) : (
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  color: '#2f6b5f',
                  mt: 4,
                  fontWeight: 600,
                }}
              >
                💤  cart is empty
              </Typography>
            )}
          </Paper>
        </Fade>
      </Box>
    </>
  );
};

export default MyCart;
