
import * as React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { useServiceContext } from "../Context/MyContext";
export default function Header() {
  const navigate = useNavigate();

const {handleDrawerClose, handleDrawerOpen, drawerOpen } = useServiceContext();

  const handleNavigate = (path) => {
    navigate(path);
    handleDrawerClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#2f6b5f',  // beige background
        boxShadow: "0 2px 8px rgba(102, 73, 49, 0.15)" // subtle shadow with dark brown tint
      }}
    >
      <Toolbar>
        {/* Logo Button */}
        <IconButton
          size="large"
          edge="start"
          aria-label="menu"
          onClick={() => handleNavigate("/")}
          sx={{
            mr: 2,
            color: '#2f6b5f',  // dark brown icon color
            padding: 0,
            "&:hover": { backgroundColor: "transparent" } // no highlight on hover
          }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: 32, marginRight: 8, borderRadius: '4px' }}
          />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          onClick={() => handleNavigate("/password")}
          sx={{
            flexGrow: 1,
            fontFamily: "'Dancing Script', cursive",
            color: '#f3f7f6ff',
            cursor: "pointer",
            userSelect: "none",
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.6rem' }, // responsive font size
            transition: "color 0.3s ease",
            "&:hover": {
              color: "#a67b5b"
            }
          }}
        >
           Old Town Barber
        </Typography>

        {/* Menu Icon */}
      <IconButton
  size="large"
  edge="end"
  aria-label="cart"
  onClick={() => handleNavigate("/MyCart")}
  sx={{
    color: '#f3f7f6ff',
    mr: 1,
    "&:hover": {
      backgroundColor: "transparent",
      color: "#a67b5b"
    }
  }}
>
  <ShoppingCartIcon />
</IconButton>

      </Toolbar>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: (theme) => ({
            width: { xs: '80vw', sm: '40vw', md: '20vw' },
            maxWidth: 300,
            backgroundColor: '#c1dad5ff', // very light beige background
            color: '#2f6b5f', // dark brown text
            boxShadow: "0 3px 12px rgba(102, 73, 49, 0.15)"
          })
        }}
      >
        <List>
          {[
            { text: "Recent", path: "/history" },
              { text: "History", path: "/records" },
            { text: "Add Services", path: "/addservices" },
          ].map(({ text, path }) => (
            <ListItem
              button
              key={text}
              onClick={() => handleNavigate(path)}
              sx={{
                '&:hover': {
                  backgroundColor: '#2f6b5f',
                  color: '#c8e0dbff',
                },
                color: '#2f6b5f',
                fontWeight: '600',
                borderRadius: '6px',
                mx: 1,
                my: 0.5,
              }}
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
