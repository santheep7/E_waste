import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from './usernavbar';
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Container } from "@mui/material";
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { gsap } from "gsap";
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function Register() {
  const [record, setRecord] = useState({
    name: "",
    place: "",
    address: "",
    phone: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempUserId, setTempUserId] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newError = {};
    if (!record.name.trim()) newError.name = "Name is required";
    if (!record.place.trim()) newError.place = "Place is required";
    if (!record.address.trim()) newError.address = "Address is required";
    if (!record.phone.trim()) newError.phone = "Phone is required";
    if (!record.password.trim()) newError.password = "Password is required";
    else if (record.password.length < 6) newError.password = "Password must be at least 6 characters";
    if (!record.email.trim()) newError.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(record.email)) newError.email = "Email format is invalid";
    return newError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setError(validationErrors);
      return;
    }

    // Send OTP to email or phone
    axios.post('http://localhost:9000/api/user/request-otp', record)
      .then((res) => {
        toast.success("OTP sent to your email/phone.");
        setOtpSent(true);
        setTempUserId(res.data.userId); // could be email or some ID returned
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to send OTP.");
      });
  };

  const handleOtpVerification = () => {
    axios.post('http://localhost:9000/api/user/verify-otp', {
      userId: tempUserId,
      otp: otp
    }).then((res) => {
      toast.success("Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    }).catch((err) => {
      toast.error("Invalid or expired OTP.");
    });
  };

  // Animation
  useEffect(() => {
    const lines = document.querySelectorAll(".circuit-line");
    gsap.fromTo(
      lines,
      { scaleX: 0, opacity: 0.2 },
      {
        scaleX: 1,
        opacity: 1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.3,
          from: "start"
        },
        ease: "power2.inOut"
      }
    );
  }, []);

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} theme="light" transition={Bounce} />
      <Box sx={{
        position: "fixed", width: "100%", height: "100%", overflow: "hidden", zIndex: -1, background: "#0d1117"
      }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <Box
            key={i}
            className="circuit-line"
            sx={{
              position: "absolute", height: "2px", width: "150px", backgroundColor: "#00ffcc",
              top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
              transformOrigin: "left", opacity: 0.2, boxShadow: "0 0 10px #00ffcc"
            }}
          />
        ))}
      </Box>

      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper elevation={5} sx={{ p: 4, position: 'relative', zIndex: 2 }}>
          <Typography variant="h5" mb={2}>Register</Typography>
          {!otpSent ? (
            <form onSubmit={handleSubmit}>
              <TextField fullWidth margin="normal" label="Name" name="name" onChange={handleChange} error={!!error.name} helperText={error.name} />
              <TextField fullWidth margin="normal" label="Place" name="place" onChange={handleChange} error={!!error.place} helperText={error.place} />
              <TextField fullWidth margin="normal" label="Address" name="address" onChange={handleChange} error={!!error.address} helperText={error.address} />
              <TextField fullWidth margin="normal" label="Phone" name="phone" type="number" onChange={handleChange} error={!!error.phone} helperText={error.phone} />
              <TextField fullWidth margin="normal" label="Email" name="email" type="email" onChange={handleChange} error={!!error.email} helperText={error.email} />
              <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} error={!!error.password} helperText={error.password} />
              <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
                Register
              </Button>
            </form>
          ) : (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleOtpVerification}
                sx={{ mt: 2 }}
              >
                Verify OTP
              </Button>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
}
