import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ViewRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get('http://localhost:9000/api/req/getrequest');
        setRequests(data);
      } catch (err) {
        console.error(err);
        setError('Could not load pickup requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:9000/api/req/updatestatus/${id}`, { status: newStatus });
      setRequests(prev =>
        prev.map(r => (r._id === id ? { ...r, status: newStatus } : r))
      );
      toast.success('Status updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box mx={2} my={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <ToastContainer position="top-right" />
      <Typography variant="h5" gutterBottom>
        E-Waste Pickup Requests
      </Typography>
      {requests.length === 0 ? (
        <Typography>No pickup requests found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {requests.map(req => {
            const {
              _id,
              ewasteType,
              quantity,
              pickupDate,
              timeSlot,
              notes,
              status = 'Pending',
              image,
              user: { name, email, phone, place, address },
            } = req;

            const isCancelled = status.toLowerCase() === 'cancelled';

            return (
              <Grid key={_id} item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: isCancelled ? '2px solid red' : undefined,
                  }}
                >
                  {image ? (
                    <CardMedia
                      component="img"
                      height="140"
                      image={`http://localhost:9000/uploads/${image}`}
                      alt="E-waste"
                    />
                  ) : (
                    <Box
                      height={140}
                      bgcolor="grey.300"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="body2" color="textSecondary">
                        No Image
                      </Typography>
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Contact:</strong> {phone}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Place:</strong> {place}
                    </Typography>
                    <Typography variant="body2"  color="textSecondary" gutterBottom>
                      <strong>Address:</strong> {address}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Type:</strong> {ewasteType}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Qty:</strong> {quantity}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date:</strong> {new Date(pickupDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Slot:</strong> {timeSlot}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Notes:</strong> {notes || '—'}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <FormControl fullWidth size="small" disabled={isCancelled}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={status}
                        label="Status"
                        onChange={e => handleStatusChange(_id, e.target.value)}
                        sx={
                          isCancelled
                            ? { bgcolor: 'error.main', color: 'common.white' }
                            : undefined
                        }
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
