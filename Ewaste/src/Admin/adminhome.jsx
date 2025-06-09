import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { gsap } from 'gsap';
import AdminNavbar from './adminNavbar';

export default function AdminHome() {
  // Mock stats (replace with real data)
  const stats = [
    { label: 'Total Users', value: 152 },
    { label: 'Pickup Requests', value: 87 },
    { label: 'Completed Pickups', value: 64 },
  ];

  // Refs for GSAP targets
  const headerRef = useRef(null);
  const cardRefs = useRef([]);
  const aboutRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
  // Header: slide down + fade in
  gsap.fromTo(
    headerRef.current,
    { y: -50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
  );

  // Stats cards: scale up + fade in with stagger
  gsap.fromTo(
    cardRefs.current,
    { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 1, duration: 0.6, stagger: 0.2, ease: 'back.out(1.7)', delay: 0.3 }
  );

  // About section: slide in from right + fade in
  gsap.fromTo(
    aboutRef.current,
    { x: 100, opacity: 0 },
    { x: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.8 }
  );

  // Footer: fade in + slide up
  gsap.fromTo(
    footerRef.current,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power1.out', delay: 1.4 }
  );
}, []);

  return (
    <div>
      <AdminNavbar />
      <div className="container mt-5 pt-5">
        {/* Header */}
        <div className="text-center mb-5" ref={headerRef}>
          <h1 className="text-primary">Welcome, Admin!</h1>
          <p className="lead">Here's a quick overview of your system.</p>
        </div>

        {/* Stats Cards */}
        <div className="row text-center mb-5">
          {stats.map((item, i) => (
            <div className="col-md-4 mb-3" key={i}>
              <div
                className="card shadow-sm border-0 p-3"
                ref={(el) => (cardRefs.current[i] = el)}
              >
                <h5 className="card-title">{item.label}</h5>
                <p className="display-6 fw-bold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* About Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-10">
            <div className="card p-4 shadow-sm border-0" ref={aboutRef}>
              <h4 className="mb-3 text-secondary">About This Panel</h4>
              <p>
                Use this dashboard to monitor users, manage pickup requests, and view system
                analytics in real-time. Click through the links in your admin navbar to dive deeper.
              </p>
              <p>
                Need more detail? Visit “Pickup Requests” to assign jobs or “View Users” to update
                profiles and permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Optional Footer / Quick Links */}
        <div className="text-center text-muted small" ref={footerRef}>
          © 2025 E-Waste Management Admin Panel
        </div>
      </div>
    </div>
  );
}
