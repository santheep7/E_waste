import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Typography, Container, Box } from "@mui/material";
import { gsap } from "gsap";
import axios from "axios";
import AgentNavbar from './agentnav';

export default function AgentHome() {
  const headerRef = useRef(null);
  const statRefs = useRef([]);
  const aboutRef = useRef(null);

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/req/approvedrequests');
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    fetchApproved();
  }, []);

  const assignedPickups = requests.length;
  const completedJobs = requests.filter(r => r.isPickedUp).length;
  const pendingRequests = assignedPickups - completedJobs;

  const statData = [
    { id: "card1", title: "Assigned Pickups", value: assignedPickups },
    { id: "card2", title: "Pending Requests", value: pendingRequests },
    { id: "card3", title: "Completed Jobs", value: completedJobs },
  ];

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power1.out", delay: 0.4 }
    );

    gsap.fromTo(
      statRefs.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power1.out",
        delay: 0.8,
        stagger: 0.2,
      }
    );

    gsap.fromTo(
      aboutRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power1.out", delay: 1.6 }
    );
  }, [requests]);

  return (
    <>
      <AgentNavbar />
      <Box sx={{ backgroundColor: "#f0f4f3", minHeight: "100vh", paddingBottom: 4 }}>
        <Box ref={headerRef} sx={{ backgroundColor: "#00695c", color: "white", textAlign: "center", py: 5 }}>
          <Typography variant="h3" gutterBottom>
            Welcome, Agent!
          </Typography>
          <Typography variant="subtitle1">Here's your dashboard overview</Typography>
        </Box>

        <Container sx={{ mt: 4, display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
          {statData.map((stat, i) => (
            <Card
              key={stat.id}
              ref={(el) => (statRefs.current[i] = el)}
              sx={{ width: 250, textAlign: "center", borderRadius: 3, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h6" color="#00796b">
                  {stat.title}
                </Typography>
                <Typography variant="h3" fontWeight="bold" mt={1}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Container>

        <Container
          ref={aboutRef}
          sx={{
            mt: 5,
            maxWidth: 700,
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: 3,
            p: 4,
          }}
        >
          <Typography variant="h5" color="#00695c" gutterBottom>
            About Your Dashboard
          </Typography>
          <Typography paragraph>
            This panel allows agents to track assigned pickups, check pending requests, and view completed jobs.
          </Typography>
          <Typography paragraph>
            For detailed updates, visit the “Pickup Requests” section or check your notifications.
          </Typography>
        </Container>

        <Typography sx={{ textAlign: "center", mt: 5, color: "#777" }} variant="body2">
          © 2025 E-Waste Agent Panel
        </Typography>
      </Box>
    </>
  );
}
