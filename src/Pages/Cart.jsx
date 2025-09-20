


import React from 'react';
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
} from '@mui/material';

const MyCart = () => {
  const { selectedService, setSelectedService, addDocument, emptyCart, setTotalPrice } = useServiceContext();

  const hasItems = selectedService && selectedService.length > 0;

const handleRemoveItem = (indexToRemove) => {
    setSelectedService(prev =>
        prev.filter((_, idx) => idx !== indexToRemove)
    );
    setTotalPrice(prevTotal =>
        prevTotal - (selectedService[indexToRemove]?.price || 0)
    );
};

return (
    <Box
        sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #b4d4ceff 0%, #2f6b5f 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Nunito, sans-serif',
            p: 3,
        }}
    >
        <Paper
            elevation={4}
            sx={{
                p: 4,
                maxWidth: 500,
                width: '100%',
                backgroundColor: '#dff4f0ff',
                borderRadius: '20px',
                border: '1px solid #477e72ff',
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    mb: 3,
                    fontWeight: 700,
                    textAlign: 'center',
                    color: '#2f6b5f',
                }}
            >
                🛒  Cart
            </Typography>

            {hasItems ? (
                <>
                    <List>
                        {selectedService.map((item, index) => (
                            <React.Fragment key={item.id || index}>
                                <ListItem
                                    sx={{
                                        px: 0,
                                        py: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                    secondaryAction={null}
                                > 
                                    <ListItemText
                                        primary={item.name}
                                        secondary={`₹${item.price}`}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                            color: '#2f6b5f',
                                        }}
                                        secondaryTypographyProps={{
                                            color: '#6aa095ff',
                                        }}
                                    />
                                    <Button
                                        onClick={() => handleRemoveItem(index)}
                                        sx={{
                                            minWidth: 0,
                                            ml: 2,
                                            color: '#b71c1c',
                                            '&:hover': { backgroundColor: '#b5dbd4ff' },
                                        }}
                                        aria-label="Remove"
                                    >
                                        {/* Trashbox SVG icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="22"
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

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ mt: 4 }}
                        justifyContent="center"
                    >
                        <Button
                            variant="contained"
                            onClick={addDocument}
                            sx={{
                                backgroundColor: '#2f6b5f',
                                '&:hover': { backgroundColor: '#b5dbd4ff' },
                                fontWeight: 600,
                                borderRadius: '12px',
                                px: 3,
                            }}
                        >
                            📄 Add Services
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={emptyCart}
                            sx={{
                                borderColor: '#2f6b5f',
                                color: '#2f6b5f',
                                fontWeight: 600,
                                borderRadius: '12px',
                                px: 3,
                                '&:hover': {
                                    backgroundColor: '#f5f0e1',
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
                    sx={{ textAlign: 'center', color: '#2f6b5f', mt: 2 }}
                >
                     cart is empty 
                </Typography>
            )}
        </Paper>
    </Box>
);
};

export default MyCart;
