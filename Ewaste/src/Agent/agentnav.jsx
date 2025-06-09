import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const UnderlineButton = styled(Button)(({ theme }) => ({
  color: '#000',
  textTransform: 'none',
  fontWeight: 500,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '0%',
    height: '2px',
    bottom: -2,
    left: 0,
    backgroundColor: '#1976d2',
    transition: 'width 0.3s',
  },
  '&:hover::after': {
    width: '100%',
  },
}));

export default function AgentNavbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [agentName, setAgentName] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth state once
  useEffect(() => {
    const token = localStorage.getItem('agentToken');
    const name = localStorage.getItem('agentname');
    const approved = localStorage.getItem('isApproved') === 'true';

    setAgentName(name || '');
    setIsApproved(approved);

    // Redirect if no token and not already on login page
    if (!token && location.pathname !== '/agentlogin') {
      navigate('/agentlogin');
    }
  }, [location.pathname, navigate]);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/agentlogin');
  };

  const navLinks = [
    { label: 'Home', path: '/agenthome' },
    ...(isApproved ? [{ label: 'Requests', path: '/viewuserRequest' }] : []),
    { label: 'Profile', path: '/profile' },
    { label: 'Register', path: '/agentreg' },
  ];

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
          AgentZone
        </Typography>

        {isMobile ? (
          <>
            <IconButton edge="end" onClick={handleMenu}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              {navLinks.map(({ label, path }) => (
                <MenuItem key={label} onClick={handleClose} component={Link} to={path}>
                  {label}
                </MenuItem>
              ))}
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleLogout();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navLinks.map(({ label, path }) => (
              <UnderlineButton key={label} component={Link} to={path}>
                {label}
              </UnderlineButton>
            ))}
            <Typography variant="body1" sx={{ fontWeight: 500, color: '#333' }}>
              Hi, {agentName}
            </Typography>
            <UnderlineButton onClick={handleLogout}>Logout</UnderlineButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
