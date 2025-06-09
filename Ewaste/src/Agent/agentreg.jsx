import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AgentRegister() {
  const [agentData, setAgentData] = useState({
    agentname: '',
    adharid: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setAgentData({ ...agentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { agentname, adharid, email, phone, password } = agentData;

    if (!agentname || !adharid || !email || !phone || !password) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:9000/api/agent/agentreg', agentData);
      toast.success('Registration successful');
      setAgentData({ agentname: '', adharid: '', email: '', phone: '', password: '' });
    } catch (err) {
      toast.error('Registration failed');
      console.error(err);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 4 }}>
      <ToastContainer position="top-center" />
      <Grid item xs={11} sm={8} md={6}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Agent Registration
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Full Name"
              name="agentname"
              value={agentData.agentname}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Aadhaar ID"
              name="adharid"
              value={agentData.adharid}
              onChange={handleChange}
              margin="normal"
              required
              type="number"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={agentData.email}
              onChange={handleChange}
              margin="normal"
              required
              type="email"
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={agentData.phone}
              onChange={handleChange}
              margin="normal"
              required
              type="tel"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              value={agentData.password}
              onChange={handleChange}
              margin="normal"
              required
              type="password"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
