import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const usernameLettersRef = useRef([]);

  useEffect(() => {
    const savedName = localStorage.getItem( 'Admin'); 
    setUsername(savedName);

    // Animate each letter
    setTimeout(() => {
      gsap.fromTo(
        usernameLettersRef.current,
        { opacity: 0, scale: 0.2, y: -20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'elastic.out(1, 0.5)',
        }
      );
    }, 300);
  }, []);

  const handleLogout = () => {
    // optional: clear name if you want
    // localStorage.removeItem('name');
    navigate('/');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <span className="navbar-brand">Admin Panel</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#adminNavbar"
            aria-controls="adminNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {username && (
            <div className="mx-auto text-success fw-bold username-display">
              {username.split('').map((letter, i) => (
                <span
                  key={i}
                  ref={el => (usernameLettersRef.current[i] = el)}
                  className="username-letter"
                >
                  {letter}
                </span>
              ))}
            </div>
          )}

          <div className="collapse navbar-collapse" id="adminNavbar">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="nav-link menu-item btn btn-link"
                  onClick={() => navigate('/viewAgent')}
                >
                  View Agent<span className="underline" />
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link menu-item btn btn-link"
                  onClick={() => navigate('/viewuser')}
                >
                  View Users<span className="underline" />
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link menu-item btn btn-link"
                  onClick={() => navigate('/viewrequest')}
                >
                  Pickup Requests<span className="underline" />
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link menu-item btn btn-link"
                  onClick={handleLogout}
                >
                  Logout<span className="underline" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Inline CSS for underline hover and username styling */}
      <style>{`
        .menu-item {
          position: relative;
          cursor: pointer;
          color: #ffd;
          text-decoration: none;
        }
        .menu-item:hover .underline {
          width: 100%;
        }
        .underline {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 0;
          background: #28a745;
          transition: width 0.3s ease;
        }
        .username-display {
          font-size: 1.5rem;
          letter-spacing: 1px;
        }
        .username-letter {
          display: inline-block;
          margin: 0 1px;
        }
      `}</style>
    </>
  );
}
