
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Stack,
  Chip,
  Avatar,
} from '@mui/material';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { useServiceContext } from '../Context/MyContext';
import { useNavigate } from 'react-router-dom';

function Container() {
  const {
    selectedService,
    setSelectedService,
    totalPrice,
    setTotalPrice,
    addDocument,
    services,
  } = useServiceContext();

  const navigate = useNavigate();

  const serviceEdited = (service) => {
    const isAlreadySelected = selectedService.find((s) => s.id === service.id);

    if (isAlreadySelected) {
      setSelectedService((prev) => prev.filter((s) => s.id !== service.id));
      setTotalPrice(totalPrice - service.price);
    } else {
      setSelectedService((prev) => [...prev, service]);
      setTotalPrice(totalPrice + service.price);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #c3e4de 0%, #95c9c0ff 100%)',
        p: 4,
        fontFamily: 'Nunito, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
          overflowX: 'hidden',
  overflowY: 'hidden',/* Prevent horizontal scrolling */
  
      }}
    >
   

      {services.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#2c655a"
              strokeWidth="5"
              strokeDasharray="31.415, 31.415"
              transform="rotate(72.0001 25 25)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </Box>
      )}

<Typography
  variant="h6"
  sx={{
    mb: 2,
    fontWeight: 700, // Professional bold
    color: '#2f6b5f',
    textAlign: 'center', // Center text
    fontFamily: "'Roboto', 'Segoe UI', sans-serif",
  }}
>
  Choose Services
</Typography>

      <Grid container spacing={3}>
        {services.map((service) => {
      
          const isSelected = selectedService.some((s) => s.id === service.id);
          return (
            
                <Grid item xs={12} sm={6} md={4} lg={1} sx={{
                width: { xs: '80vw', md: '15vw' },
                maxWidth: { xs: 'none', md: '15vw' },
                minWidth: { xs: 'none', md: '15vw' },
              }}>
              <Card
                onClick={() => serviceEdited(service)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: '18px',
                  border: isSelected
                    ? '2px solid #2c655a'
                    : '1px solid #d8efedff',
                  backgroundColor: isSelected ? '#e1f3f0ff' : '#e4fdfbff',
                  boxShadow: isSelected
                    ? '0 6px 16px rgba(109, 76, 65, 0.2)'
                    : '0 2px 10px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  },
                }}
              >

                <CardContent
                  sx={{
                    minHeight: { xs: 140, sm: 160, md: 180 },
                    maxHeight: { xs: 140, sm: 160, md: 180 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    p: { xs: 2, sm: 3 },
                    boxSizing: 'border-box',
                  }}
                ><Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Avatar
                      sx={{
                        bgcolor: isSelected ? '#2f6b5f' : '#d7ccc8',
                        color: '#fff',
                        width: 44,
                        height: 44,
                        fontWeight: 700,
                      }}
                    >
                      {service.name[0].toUpperCase()}
                    </Avatar>

                    <IconButton>
                      {isSelected ? (
                        <span style={{ color: '#2c655a', fontSize: 24 }}>
                          ✓
                        </span>
                      ) : (
                        <CIcon icon={icon.cilCart} size="lg" />
                      )}
                    </IconButton>
                  </Stack>

                  <Typography
                    variant="h8"
                    sx={{
                      mt: 1,
                      fontWeight: 300,
                      color: '#2c655a',
                      fontSize: '0.8rem',
                    }}
                  >
                    {service.name}
                  </Typography>

                  <Chip
                    label={`₹${service.price}`}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: '#cff0edff',
                      color: '#2c655a',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      borderRadius: '12px',
                      px: 1.5,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600, color: '#2f6b5f' }}
        >
          Total Price: <strong>₹{totalPrice}</strong>
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            onClick={addDocument}
            sx={{
              backgroundColor: '#2f6b5f',
              '&:hover': { backgroundColor: '#4b8d7fff' },
              fontWeight: 700,
              px: 3,
              fontSize: '1rem',
              borderRadius: '12px',
              color: '#fff',
            }}
          >
            📄 Add Services
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate('/MyCart')}
            sx={{
              fontWeight: 700,
              borderColor: '#2c655a',
              color: '#417c70ff',
              px: 3,
              fontSize: '1rem',
              borderRadius: '12px',
              '&:hover': {
                borderColor: '#2f6b5f',
                backgroundColor: '#c5e4ddff',
              },
            }}
          >
            🛒 Go to Cart
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default Container;
