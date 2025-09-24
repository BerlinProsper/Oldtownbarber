import PaymentPage from '../Pages/Payment'
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';

import { useEffect , useState} from 'react';
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
  TextField
} from '@mui/material';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { useServiceContext } from '../Context/MyContext';
import { useNavigate } from 'react-router-dom';
import PaymentModal from './paymentoption';
import MyCart from '../Pages/Cart';

function Container() {
  const {
    selectedService,
    setSelectedService,
    totalPrice,
    setTotalPrice,
    addDocument,
    services,
    paymentOption, 
    setPaymentOption
  } = useServiceContext();
const [searchText, setSearchText] = useState('');

  const navigate = useNavigate();

 const serviceEdited = (service) => {
  const isAlreadySelected = selectedService.find((s) => s.id === service.id);

  if (isAlreadySelected) {
    // Remove the clicked service
    setSelectedService((prev) => prev.filter((s) => s.id !== service.id));

    // Adjust total price
    setTotalPrice(totalPrice - service.price);

    // Remove any free services added by this service
    if (service.freeServices && service.freeServices.length > 0) {
      const freeNames = service.freeServices.map((f) => f.name.trim().toLowerCase());

      setSelectedService((prev) =>
        prev.filter((s) => {
          const isFree = s.price === 0;
          const nameMatch = freeNames.includes(s.name.trim().toLowerCase());
          return !(isFree && nameMatch);
        })
      );
    }

  } else {
    // Add clicked service
    setSelectedService((prev) => [...prev, service]);
    setTotalPrice(totalPrice + service.price);

    // Check and add associated free services (by name)
    if (service.freeServices && service.freeServices.length > 0) {
      const freeNames = service.freeServices.map((f) => f.name.trim().toLowerCase());

      const matchedFreeServices = services.filter(
        (s) =>
          freeNames.includes(s.name.trim().toLowerCase()) &&
          !selectedService.some((sel) => sel.id === s.id)
      );

      const freeVersion = matchedFreeServices.map((s) => ({
        ...s,
        price: 0,
        isFree: true,
        sourceServiceId: service.id, // optional, useful for tracking
      }));

      setSelectedService((prev) => [...prev, ...freeVersion]);
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
       {paymentOption==1?
   
  <div>
<MyCart/>
  </div>
  :
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

  
   <div>
    
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

<Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, width: '100%' }}>
  <Typography
    variant="h6"
    sx={{
      fontWeight: 800,
      color: '#2f6b5f',
      mb: 1,
    }}
  >
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
  sx={{
    width: { xs: '100%', md: '60%' },
    mb: 2,
  }}
/>

</Box>


</Box>

      <Grid container spacing={3}>
{services
  .filter((service) => {
    const query = searchText.toLowerCase().trim();
    const name = service.name.toLowerCase();

    // Allow match by any word, starting with or containing the query
    return query
      .split(' ')
      .every((word) =>
        name
          .split(' ')
          .some((part) => part.startsWith(word) || part.includes(word))
      );
  })
  .map((service) => {
      
          const isSelected = selectedService.some((s) => s.id === service.id);
          return (
            
             <Grid item xs={6} sm={6} md={4} lg={1} sx={{
  width: { xs: '80vw', md: '15vw' },
  maxWidth: { xs: 'none', md: '15vw' },
  minWidth: { xs: 'none', md: '15vw' },
}}>

             <Card
  onClick={() => serviceEdited(service)}
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
                ><Stack
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
    backgroundColor: isSelected ? '#2f6b5f' : '#e0f7f9',
    color: isSelected ? '#fff' : '#2f6b5f',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    borderRadius: '10px',
    px: 1.5,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  }}
/>

                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

<Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    mb: 2, // optional margin below
  }}
>
  <Typography
    variant="h6"
    sx={{ fontWeight: 600, color: '#2f6b5f' }}
  >
    Total Price: <strong>₹{totalPrice}</strong>
  </Typography>
</Box>

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

      </div>

    </Box>
}
      </div>
  );
}

export default Container;
