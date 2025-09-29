import React, { useEffect, useState } from 'react';
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
  TextField,
  InputBase
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { useServiceContext } from '../Context/MyContext';
import MyCart from '../Pages/Cart';

function Container() {
  const {
    selectedService,
    setSelectedService,
    totalPrice,
    setTotalPrice,
    addDocument,
    services,
    paymentOption
  } = useServiceContext();

  const [searchText, setSearchText] = useState('');
  const [customClickId, setCustomClickId] = useState(null);
  const [customPrice, setCustomPrice] = useState('');

const handleCustomPriceSubmit = (service) => {
  const price = parseInt(customPrice);
  if (!isNaN(price) && price > 0) {
    // Clone and update price locally
    const updatedService = { ...service, price };

    // Add to selectedService
    setSelectedService(prev => [...prev, updatedService]);
    setTotalPrice(prev => prev + price);

    // Update the original service in the services array (optional: if you control that state)
    const index = services.findIndex(s => s.id === service.id);
    if (index !== -1) {
      services[index].price = price; // Direct mutation since services isn't in state
    }

    // Reset input UI
    setCustomClickId(null);
    setCustomPrice('');
  }
};


  const handleServiceClick = (service) => {
    const isAlreadySelected = selectedService.some((s) => s.id === service.id);

    if (isAlreadySelected) {
      const matched = selectedService.find((s) => s.id === service.id);
      if (matched && matched.price > 0) {
        setTotalPrice(prev => Math.max(0, prev - matched.price));
      }

      setSelectedService(prev => prev.filter((s) => s.id !== service.id));

      if (service.freeServices?.length > 0) {
        const freeNames = service.freeServices.map(f => f.name.trim().toLowerCase());
        setSelectedService(prev =>
          prev.filter(
            (s) => !(s.price === 0 && freeNames.includes(s.name.trim().toLowerCase()))
          )
        );
      }
    } else {
      if (service.price === 0) {
        setCustomClickId(service.id);
        return;
      }

      setSelectedService(prev => [...prev, service]);
      setTotalPrice(prev => prev + service.price);

      if (service.freeServices?.length > 0) {
        const freeNames = service.freeServices.map(f => f.name.trim().toLowerCase());
        const matchedFree = services.filter(
          (s) =>
            freeNames.includes(s.name.trim().toLowerCase()) &&
            !selectedService.some(sel => sel.id === s.id)
        );
        const freeVersion = matchedFree.map((s) => ({
          ...s,
          price: 0,
          isFree: true,
          sourceServiceId: service.id,
        }));
        setSelectedService(prev => [...prev, ...freeVersion]);
      }
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      {paymentOption === 1 ? (
        <MyCart />
      ) : (
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #d6f2f1ff 0%, #f5f9f9 100%)',
            p: 4,
            fontFamily: '"Inter", "Nunito", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            overflowX: 'hidden',
            overflowY: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2f6b5f', mb: 1 }}>
                <strong>Choose Your Services</strong>
              </Typography>
              <TextField
                placeholder="Search services..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#2f6b5f', mr: 1 }} />,
                  sx: {
                    backgroundColor: '#ffffffcc',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    border: '1px solid #d9e2ec',
                    transition: '0.3s',
                    '&:hover': {
                      borderColor: '#2f6b5f',
                    },
                    '&.Mui-focused': {
                      borderColor: '#2f6b5f',
                      boxShadow: '0 0 0 3px rgba(47, 91, 111, 0.15)',
                    },
                  },
                }}
                size="small"
                sx={{ width: { xs: '100%', md: '60%' }, mb: 2 }}
              />
            </Box>
          </Box>

          <Grid container spacing={3}>
            {services
              .filter((service) => {
                const query = searchText.toLowerCase().trim();
                const name = service.name.toLowerCase();
                return query.split(' ').every((word) =>
                  name.split(' ').some((part) => part.startsWith(word) || part.includes(word))
                );
              })
              .map((service) => {
                const isSelected = selectedService.some((s) => s.id === service.id);
                const isCustomSelected = customClickId === service.id;

                return (
                  <Grid
                    key={service.id}
                    item
                    xs={6}
                    sm={6}
                    md={4}
                    lg={1}
                    sx={{
                      width: { xs: '80vw', md: '15vw' },
                      maxWidth: { xs: 'none', md: '15vw' },
                      minWidth: { xs: 'none', md: '15vw' },
                    }}
                  >
                    <Card
                      onClick={() => handleServiceClick(service)}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: '20px',
                        border: isSelected
                          ? '2px solid #2f6b5f'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                        background: isSelected
                          ? 'rgba(47, 91, 111, 0.1)'
                          : 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: isSelected
                          ? '0 6px 20px rgba(47, 91, 111, 0.2)'
                          : '0 4px 12px rgba(0, 0, 0, 0.06)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.035)',
                          boxShadow: '0 10px 28px rgba(0,0,0,0.1)',
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
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Avatar
                            sx={{
                              bgcolor: isSelected ? '#2f6b5f' : '#ccd6dd',
                              color: '#fff',
                              width: 44,
                              height: 44,
                              fontWeight: 600,
                              fontSize: '1rem',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                          >
                            {service.name[0].toUpperCase()}
                          </Avatar>
                          <IconButton>
                            {isSelected ? (
                              <span style={{ color: '#2c655a', fontSize: 24 }}>✓</span>
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

                        {isCustomSelected ? (
                        <Box
  onClick={(e) => e.stopPropagation()}
  sx={{
    mt: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    border: '1px solid #ccd6dd',
    borderRadius: '10px',
    px: 1.5,
    py: 0.5,
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
  }}
>
  <InputBase
    value={customPrice}
    onChange={(e) => setCustomPrice(e.target.value)}
    type="number"
    inputProps={{
      min: 1,
      style: {
        textAlign: 'center',
        width: '60px',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        color: '#2f6b5f',
      },
    }}
    placeholder="₹0"
    onClick={(e) => e.stopPropagation()}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCustomPriceSubmit(service);
      }
    }}
    sx={{
      flex: 1,
      mr: 1,
    }}
  />
  <Button
    onClick={(e) => {
      e.stopPropagation();
      handleCustomPriceSubmit(service);
    }}
    size="small"
    variant="contained"
    sx={{
      fontSize: '0.75rem',
      px: 2,
      py: 0.5,
      borderRadius: '8px',
      backgroundColor: '#2f6b5f',
      color: '#fff',
      textTransform: 'none',
      '&:hover': { backgroundColor: '#3c7089' },
    }}
  >
    Add
  </Button>
</Box>

                        ) : (
                          <Chip
                            label={
                              service.price === 0 && !isSelected
                                ? 'Custom'
                                : `₹${service.price}`
                            }
                            size="small"
                            sx={{
                              mt: 1,
                              backgroundColor: isSelected ? '#2f6b5f' : '#e0f7f9',
                              color: isSelected ? '#fff' : '#2f6b5f',
                              fontWeight: 'bold',
                              fontSize: '0.85rem',
                              borderRadius: '10px',
                              px: 1.5,
                              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2f6b5f' }}>
              Total Price: <strong>₹{totalPrice}</strong>
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={addDocument}
              sx={{
                backgroundColor: '#2f6b5f',
                '&:hover': { backgroundColor: '#3c7089' },
                fontWeight: 400,
                px: 4,
                fontSize: '1rem',
                borderRadius: '14px',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              📄 Add Services
            </Button>
          </Stack>
        </Box>
      )}
    </div>
  );
}

export default Container;
