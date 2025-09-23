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
  useTheme} from '@mui/material';
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
          background: 'linear-gradient(135deg, #b4d4ceff 0%, #2f6b5f 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          fontFamily: 'Nunito, sans-serif',
          p: { xs: 1.5, sm: 3 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 450,
            mt: { xs: 4, sm: 8 },
            px: { xs: 2, sm: 4 },
            py: { xs: 3, sm: 4 },
            borderRadius: '16px',
            backgroundColor: '#f2fdfc',
            border: '1px solid #90cfc6',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              color: '#2f6b5f',
              fontSize: { xs: '1.1rem', sm: '1.4rem' },
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
                        py: 1,
                        px: 0,
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
                          color: '#417c70ff',
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
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
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
                   <Typography
                          variant="body1"
                          sx={{ mb: 2, fontWeight: 600, color: '#2f6b5f' }}
                        >
                          Total Price: <strong>₹{totalPrice}</strong>
                        </Typography>
              </List>

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
                    '&:hover': { backgroundColor: '#4e9c8f' },
                    fontWeight: 700,
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    py: 1.2,
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
                    fontSize: '0.95rem',
                    py: 1.2,
                    '&:hover': {
                      backgroundColor: '#edf8f6',
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
              Your cart is empty 😔
            </Typography>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default MyCart;
