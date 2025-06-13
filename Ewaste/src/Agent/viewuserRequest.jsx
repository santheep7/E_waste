import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { gsap } from 'gsap';
import AgentNavbar from './agentnav';
import './agentuserReq.css';

export default function ViewApprovedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowsRef = useRef([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/req/approvedrequests');
        setRequests(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching approved requests:', err);
        setError('Failed to load approved requests.');
        setLoading(false);
      }
    };
    fetchApproved();
  }, []);

  useEffect(() => {
    if (requests.length > 0) {
      gsap.fromTo(
        rowsRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.15,
        }
      );
    }
  }, [requests]);

  const handleTogglePickup = async (requestId, currentStatus) => {
    try {
      const updated = await axios.patch(
        `http://localhost:9000/api/req/updatepickupstatus/${requestId}`,
        { isPickedUp: !currentStatus }
      );
      setRequests((prev) =>
        prev.map((req) => (req._id === requestId ? updated.data.request : req))
      );
    } catch (err) {
      console.error('Failed to update pickup status:', err);
      setError('Could not update pickup status.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 3, textAlign: 'center' }}>
        {error}
      </Alert>
    );
  }

  if (requests.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 3, textAlign: 'center' }}>
        No approved requests found.
      </Alert>
    );
  }

  return (
    <>
      <AgentNavbar />
      <Box
        sx={{
          minHeight: '100vh',
          py: 4,
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          // No background here!
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          {requests.map((req, idx) => (
            <Box
              key={req._id}
              ref={(el) => (rowsRef.current[idx] = el)}
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 3,
                mb: 3,
                p: 2,
                gap: 2,
                cursor: 'default',
                userSelect: 'none',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                },
              }}
            >
              <Box sx={{ flex: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Request #{idx + 1}
                </Typography>
                <Typography>
                  <strong>User:</strong> {req.user?.name || 'N/A'}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {req.user?.email || 'N/A'}
                </Typography>
                <Typography>
                  <strong>E-Waste Type:</strong> {req.ewasteType}
                </Typography>
                <Typography>
                  <strong>Quantity:</strong> {req.quantity}
                </Typography>
                <Typography>
                  <strong>Pickup Date:</strong>{' '}
                  {new Date(req.pickupDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Typography>
                <Typography>
                  <strong>Slot:</strong> {req.timeSlot}
                </Typography>
                <Typography>
                  <strong>Notes:</strong> {req.notes || '-'}
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMobile ? 'flex-start' : 'flex-end',
                  gap: 1,
                  minWidth: 140,
                }}
              >
                <Typography variant="subtitle2" color="primary" fontWeight={600}>
                  Status: {req.status}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color={req.isPickedUp ? 'success.main' : 'error.main'}
                  fontWeight={600}
                >
                  Picked Up: {req.isPickedUp ? 'Yes' : 'No'}
                </Typography>
                <Button
                  variant={req.isPickedUp ? 'outlined' : 'contained'}
                  color={req.isPickedUp ? 'warning' : 'primary'}
                  size="small"
                  onClick={() => handleTogglePickup(req._id, req.isPickedUp)}
                  fullWidth={isMobile}
                >
                  {req.isPickedUp ? 'Undo Pickup' : 'Mark as Picked Up'}
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
