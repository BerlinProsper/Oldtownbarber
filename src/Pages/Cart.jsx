import React, { useState } from 'react';
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
} from '@mui/material';
import PaymentModal from '../Components/paymentoption';

const MyCart = () => {
  const [openPayment, setOpenPayment] = useState(false);
  const {
    selectedService,
    setSelectedService,
    addDocument,
    totalPrice,
    emptyCart,
    setTotalPrice,
  } = useServiceContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const hasItems = selectedService && selectedService.length > 0;

  const handleRemoveItem = (indexToRemove) => {
    setSelectedService((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setTotalPrice((prevTotal) => prevTotal - (selectedService[indexToRemove]?.price || 0));
  };

  return (
    <>
      {openPayment && <PaymentModal onClose={() => setOpenPayment(false)} />}

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #b4d4ceff 0%, #ffffff 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          fontFamily: 'Nunito, sans-serif',
          p: { xs: 1.5, sm: 3 },
        }}
      >
        <Fade in timeout={500}>
          <Paper
            elevation={6}
            sx={{
              width: '100%',
              maxWidth: 500,
              mt: { xs: 4, sm: 8 },
              px: { xs: 3, sm: 5 },
              py: { xs: 3, sm: 5 },
              borderRadius: '20px',
              backgroundColor: '#f7fcfb',
              border: '1px solid #d1e9e4',
              boxShadow: '0 10px 30px rgba(0,0,0,0.07)',
              transition: 'all 0.3s ease',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                fontWeight: 800,
                color: '#2f6b5f',
                mb: 3,
              }}
            >
              🛒 Your Cart
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
                          py: 1.5,
                        }}
                      >
                        <ListItemText
                          primary={item.name}
                          secondary={`₹${item.price}`}
                          primaryTypographyProps={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: '#2f6b5f',
                          }}
                          secondaryTypographyProps={{
                            fontSize: '0.85rem',
                            color: '#417c70',
                          }}
                        />
                        <Button
                          onClick={() => handleRemoveItem(index)}
                          sx={{
                            minWidth: 0,
                            padding: 0,
                            color: '#b71c1c',
                            '&:hover': {
                              backgroundColor: 'transparent',
                              transform: 'scale(1.15)',
                            },
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#b71c1c"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </Button>
                      </ListItem>
                      {index < selectedService.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>

                <Box
                  sx={{
                    backgroundColor: '#eaf7f5',
                    borderRadius: '12px',
                    p: 2,
                    mt: 3,
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: '#2f6b5f' }}
                  >
                    💰 Total Price: <strong>₹{totalPrice}</strong>
                  </Typography>
                </Box>

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
                      borderRadius: '12px',
                      fontSize: '1rem',
                      py: 1.3,
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
                      borderRadius: '12px',
                      fontSize: '1rem',
                      py: 1.3,
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
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
              >
                Your cart is empty 
              </Typography>
            )}
          </Paper>
        </Fade>
      </Box>
    </>
  );
};

export default MyCart;
