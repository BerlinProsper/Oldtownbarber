import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { useServiceContext } from '../Context/MyContext';

import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';

function AddServices() {
  const { fetchServices, services, freeServices, setFreeServices } = useServiceContext();
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [addFree, setAddFree] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'serviceName') setServiceName(value);
    if (name === 'price') setPrice(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceName || !price) return;

    try {
      await addDoc(collection(db, 'newservices'), {
        name: serviceName,
        price: parseFloat(price),
        freeServices: addFree ? freeServices : [],
      });
      setServiceName('');
      setPrice('');
      setFreeServices([])
      alert('🎉 Service added!');
      fetchServices();
    } catch (error) {
      alert('Error adding service: ' + error.message);
    }
  };

  // Handler for toggling addFree switch
  const handleAddFreeToggle = () => {
    setAddFree((prev) => !prev);
  };
  console.log(services);

  // Handler to add/remove service from freeServices array in context
  const toggleFreeService = (service) => {
    console.log(freeServices);
    console.log("--------------");
    
  setFreeServices((prevFreeServices) => {
    // Check if already selected
    const isSelected = prevFreeServices.some((s) => s.id === service.id);
    if (isSelected) {
      // Remove service
      return prevFreeServices.filter((s) => s.id !== service.id);
    } else {
      // Add service
      return [...prevFreeServices, service];
    }
  });
};


  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        overflowY: 'hidden',
        background: 'linear-gradient(135deg, #b4d4ceff 0%, #2f6b5f 100%)',
        fontFamily: 'Nunito, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 800,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: '10px',
            backgroundColor: '#dff4f0ff',
            border: '1px solid #347467ff',
            mb: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#2f6b5f',
              mb: 3,
              textAlign: 'center',
            }}
          >
            ➕ Add New Service
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Service Name"
                variant="outlined"
                name="serviceName"
                value={serviceName}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                  },
                }}
              />

              <TextField
                label="Price (₹)"
                variant="outlined"
                name="price"
                value={price}
                onChange={handleChange}
                fullWidth
                type="number"
                required
                inputProps={{ min: '0', step: '0.01' }}
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                  },
                }}
              />
        <FormControlLabel
          control={<Switch checked={addFree} onChange={handleAddFreeToggle} color="success" />}
          label="Add Free Services"
          sx={{ color: '#2f6b5f', fontWeight: 600, mb: 2, alignSelf: 'center' }}
        />

        {/* Conditional rendering of free services selector */}
        {addFree && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: '10px',
              backgroundColor: '#e1f0ec',
              border: '1px solid #347467ff',
              mb: 4,
              maxHeight: 200,
              overflowY: 'auto',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, color: '#2f6b5f', fontWeight: 600, textAlign: 'center' }}
            >
              Select Services to Add as Free
            </Typography>

            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              justifyContent="center"
            >
              {services && services.length > 0 ? (
                services.map((service) => {
const selected = (Array.isArray(freeServices) ? freeServices : []).some(
  (s) => String(s.id).trim() === String(service.id).trim()
);
                    return (
                    <Chip
                      key={service.id}
                      label={service.name}
                      color={selected ? 'success' : 'default'}
                      variant={selected ? 'filled' : 'outlined'}
                      onClick={() => toggleFreeService(service)}
                      sx={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      backgroundColor: selected ? '#2f6b5f' : undefined,
                      color: selected ? '#fff' : undefined,
                      borderColor: selected ? '#2f6b5f' : undefined,
                      }}
                    />
                    );
                })
              ) : (
                <Typography sx={{ color: '#91c3b9ff' }}>No services available.</Typography>
              )}
            </Stack>
          </Paper>
        )}
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#2f6b5f',
                  '&:hover': { backgroundColor: '#6ca499ff' },
                  fontWeight: 600,
                  borderRadius: '12px',
                  py: 1.2,
                  fontSize: '1rem',
                }}
                fullWidth
              >
                Add Service
              </Button>
            </Stack>
          </form>
        </Paper>

        {/* Add Free Services Switch */}


        <Divider sx={{ my: 3, borderColor: '#a8cec7ff' }} />

        <Box>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: '#073b31ff', fontWeight: 600, textAlign: 'center' }}
          >
            📋 Existing Services
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 2,
              justifyItems: 'stretch',
            }}
          >
            {services && services.length > 0 ? (
              services.map((service) => (
                <Paper
                  key={service.id}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '10px',
                    background: '#dff4f0ff',
                    border: '1px solid #45756cff',
                    minWidth: 0,
                  }}
                  elevation={1}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#2f6b5f' }}>
                      {service.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#29685cff' }}>
                      ₹{service.price}
                    </Typography>
                  </Box>
                  <Button
                    onClick={async () => {
                      try {
                        const { deleteDoc, doc } = await import('firebase/firestore');
                        await deleteDoc(doc(db, 'newservices', service.id));
                        fetchServices();
                      } catch (err) {
                        alert('Error deleting service: ' + err.message);
                      }
                    }}
                    sx={{
                      minWidth: 0,
                      color: '#b71c1c',
                      ml: 2,
                    }}
                    aria-label="delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="24"
                      fill="#b71c1c"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 19q-.825 0-1.413-.588Q4 17.825 4 17V7H3V5h5V4h8v1h5v2h-1v10q0 .825-.587 1.412Q18.825 19 18 19Zm12-12H6v10q0 .425.288.712Q6.575 18 7 18h10q.425 0 .713-.288Q18 17.425 18 17ZM8 16h2V9H8Zm4 0h2V9h-2ZM6 7v10Z" />
                    </svg>
                  </Button>
                </Paper>
              ))
            ) : (
              <Typography
                variant="body2"
                sx={{ color: '#91c3b9ff', textAlign: 'center', gridColumn: '1/-1' }}
              >
                No services found.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AddServices;
