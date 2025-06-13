import React, { useEffect, useState, useRef } from 'react';
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
import gsap from 'gsap';

// Animated Underline Button with progressive line fill effect
const AnimatedUnderlineButton = React.forwardRef(({ children, ...props }, ref) => {
  const underlineRef = useRef(null);
  const tl = useRef(null);

  useEffect(() => {
    tl.current = gsap.timeline({ paused: true });
    tl.current.to(underlineRef.current, {
      width: '100%',
      duration: 0.8,
      ease: 'power2.out',
      boxShadow: '0 0 10px #90caf9',
    });
    gsap.set(underlineRef.current, { width: '0%', boxShadow: 'none' });
  }, []);

  const handleMouseEnter = () => {
    tl.current.play();
  };

  const handleMouseLeave = () => {
    tl.current.reverse();
  };

  return (
    <Button
      {...props}
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disableRipple
      sx={{
        color: '#ffff', // lighter blue for good contrast
        textTransform: 'none',
        fontWeight: 600,
        position: 'relative',
        paddingBottom: '6px',
        overflow: 'visible',
        '&:hover': {
          backgroundColor: 'transparent',
          color: '#e3f2fd',
        },
      }}
    >
      {children}
      <span
        ref={underlineRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '4px',
          width: '0%',
          background: 'linear-gradient(90deg, #90caf9, #42a5f5)',
          borderRadius: '2px',
          pointerEvents: 'none',
        }}
      />
    </Button>
  );
});

export default function AgentNavbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [agentName, setAgentName] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const publicPaths = ['/agentlogin', '/agentreg'];

  useEffect(() => {
    const token = localStorage.getItem('agentToken');
    const name = localStorage.getItem('agentname');
    const approved = localStorage.getItem('isApproved') === 'true';

    setAgentName(name || '');
    setIsApproved(approved);

    if (!token && !publicPaths.includes(location.pathname)) {
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
    { label: 'Map View', path: '/AgentMapView' },
  ];

  if (!agentName) {
    return (
      <AppBar position="fixed" elevation={0} sx={{ backgroundColor: '#AF3E3E' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#e3f2fd' }}>
            AgentZone
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AnimatedUnderlineButton component={Link} to="/agentlogin">
              Sign In
            </AnimatedUnderlineButton>
            <AnimatedUnderlineButton component={Link} to="/agentreg">
              Sign Up
            </AnimatedUnderlineButton>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="fixed" elevation={0} sx={{ backgroundColor: '#AF3E3E' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#e3f2fd' }}>
          AgentZone
        </Typography>

        {isMobile ? (
          <>
            <IconButton edge="end" onClick={handleMenu} sx={{ color: '#e3f2fd' }}>
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
              <AnimatedUnderlineButton key={label} component={Link} to={path}>
                {label}
              </AnimatedUnderlineButton>
            ))}
            <Typography variant="body1" sx={{ fontWeight: 500, color: '#e3f2fd' }}>
              Hi, {agentName}
            </Typography>
            <AnimatedUnderlineButton onClick={handleLogout}>Logout</AnimatedUnderlineButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
