// src/components/agent/ViewApprovedRequests.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { gsap } from 'gsap';

export default function ViewApprovedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bgRef = useRef(null);
  const cardsRef = useRef([]);

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
    if (bgRef.current) {
      gsap.fromTo(
        bgRef.current,
        { backgroundPositionX: '0%' },
        {
          backgroundPositionX: '200%',
          duration: 12,
          repeat: -1,
          ease: 'linear'
        }
      );
    }
  }, []);

  useEffect(() => {
    if (requests.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.15
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
      setRequests(prev =>
        prev.map(req => (req._id === requestId ? updated.data.request : req))
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
    return <Alert severity="error" sx={{ mt: 3, textAlign: 'center' }}>{error}</Alert>;
  }

  if (requests.length === 0) {
    return <Alert severity="info" sx={{ mt: 3, textAlign: 'center' }}>No approved requests found.</Alert>;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        px: 2,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        ref={bgRef}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://www.transparenttextures.com/patterns/asfalt-dark.png)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'contain',
          opacity: 0.3,
          zIndex: 0
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        {requests.map((req, idx) => (
          <Card
            key={req._id}
            ref={el => (cardsRef.current[idx] = el)}
            sx={{
              width: 260,
              height: 300,
              bgcolor: 'white',
              boxShadow: 3,
              borderRadius: 2,
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.03)' },
              overflow: 'auto'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Request #{idx + 1}
              </Typography>
              <Typography variant="subtitle2">User:</Typography>
              <Typography>{req.user?.name || 'N/A'}</Typography>
              <Typography variant="subtitle2">Email:</Typography>
              <Typography mb={1}>{req.user?.email || 'N/A'}</Typography>
              <Typography variant="subtitle2">E-Waste Type:</Typography>
              <Typography>{req.ewasteType}</Typography>
              <Typography variant="subtitle2">Qty:</Typography>
              <Typography>{req.quantity}</Typography>
              <Typography variant="subtitle2">Pickup Date:</Typography>
              <Typography>
                {new Date(req.pickupDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Typography>
              <Typography variant="subtitle2">Slot:</Typography>
              <Typography>{req.timeSlot}</Typography>
              <Typography variant="subtitle2">Notes:</Typography>
              <Typography>{req.notes || '-'}</Typography>
              <Typography variant="subtitle2">Status:</Typography>
              <Typography color="success.main">{req.status}</Typography>
              <Typography variant="subtitle2">Picked Up?</Typography>
              <Typography mb={1} color={req.isPickedUp ? 'success.main' : 'error.main'}>
                {req.isPickedUp ? 'Yes' : 'No'}
              </Typography>
              <Button
                variant={req.isPickedUp ? 'outlined' : 'contained'}
                color={req.isPickedUp ? 'warning' : 'primary'}
                fullWidth
                size="small"
                onClick={() => handleTogglePickup(req._id, req.isPickedUp)}
              >
                {req.isPickedUp ? 'Undo Pickup' : 'Mark as Picked Up'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
