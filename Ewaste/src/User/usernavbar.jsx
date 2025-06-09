import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { toast, ToastContainer, Bounce } from 'react-toastify'
export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const usernameLettersRef = useRef([]);

  useEffect(() => {
    // 1️⃣ Check token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // 2️⃣ Animate username if present
    const savedName = localStorage.getItem('name');
    if (savedName) {
      setUsername(savedName);

      // delay to ensure spans are rendered
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
    }
  }, []); // <-- only one useEffect

  const handleRequest = () => {
    if (isLoggedIn) {
      navigate('/request');
    } else {
      toast.info('⚠️ Please login first to access request page');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };
  const handlemyRequest = () => {
    if (isLoggedIn) {
      navigate('/UserRequest');
    } else {
      toast.info('⚠️ Please login first to access request page');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            E-Waste Management
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {username && (
            <div className="mx-auto text-primary fw-bold username-display">
              {username.split('').map((letter, i) => (
                <span
                  key={i}
                  ref={(el) => (usernameLettersRef.current[i] = el)}
                  className="username-letter"
                >
                  {letter}
                </span>
              ))}
            </div>
          )}
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link menu-item" onClick={() => navigate('/')}>
                  Home <span className="underline"></span>
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Account
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <li>
                    <a className="dropdown-item menu-item" onClick={() => navigate('/login')}>
                      Sign In{/* <span className="underline"></span> */}

                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item menu-item" onClick={() => navigate('/Userregister')}>
                      Sign Up
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item menu-item" onClick={handleLogout}>
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link menu-item" onClick={() => navigate('/dashboard')}>
                  Gallery <span className="underline"></span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link menu-item" onClick={handlemyRequest}>
                  My Requests <span className="underline"></span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link menu-item" onClick={handleRequest}>
                  Request <span className="underline"></span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link menu-item" onClick={() => navigate('/dashboard')}>
                  About us <span className="underline"></span>
                </a>
              </li>
              {/* ... other nav-items ... */}

              {/* Animated Username */}

            </ul>
          </div>
        </div>
      </nav>

      {/* Hover underline CSS */}
      <style>{`
        .menu-item { position: relative; display: inline-block; cursor: pointer; }
        .underline {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 0;
          background: #000;
          transition: width 0.3s ease;
        }
        .menu-item:hover .underline {
          width: 100%;
        }
          .username-display {
  font-size: 1.8rem;
  letter-spacing: 1px;
}

.username-letter {
  display: inline-block;
  margin: 8 1px;
}
      `}</style>
    </>
  );
}
