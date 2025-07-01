import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { toast, ToastContainer, Bounce } from 'react-toastify';

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const usernameLettersRef = useRef([]);
  const navRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedName = localStorage.getItem('name');

    setIsLoggedIn(!!token);

    if (savedName) {
      setUsername(savedName);

      // Animate username
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

    // Add scroll effect
    const handleScroll = () => {
      if (window.scrollY > 10) {
        navRef.current.classList.add('navbar-scrolled');
      } else {
        navRef.current.classList.remove('navbar-scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleMyRequest = () => {
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
    localStorage.removeItem('id');
    navigate('/');
    window.location.reload(); 
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
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent fixed-top" ref={navRef}>
        <div className="container">
          <a className="navbar-brand fw-bold fs-3" href="#">
            <i className="bi bi-recycle me-2"></i>Eco Bin
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
  <div className="mx-auto text-white fw-bold username-display">
    {'Hi, '.split('').map((letter, i) => (
      <span
        key={`hi-${i}`}
        className="username-letter"
      >
        {letter}
      </span>
    ))}
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
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item mx-2">
                <a className="nav-link menu-item" onClick={() => navigate('/homepage')}>
                  <i className="bi bi-house-door me-1"></i>Home
                  <span className="underline"></span>
                </a>
              </li>

              <li className="nav-item mx-2">
                <a className="nav-link menu-item" onClick={handleMyRequest}>
                  <i className="bi bi-list-check me-1"></i>My Requests
                  <span className="underline"></span>
                </a>
              </li>

              <li className="nav-item mx-2">
                <a className="nav-link menu-item" onClick={handleRequest}>
                  <i className="bi bi-plus-circle me-1"></i>Request
                  <span className="underline"></span>
                </a>
              </li>

              <li className="nav-item dropdown mx-2">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  Account
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                  {!isLoggedIn && (
                    <>
                      <li>
                        <a className="dropdown-item menu-item" onClick={() => navigate('/login')}>
                          <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item menu-item" onClick={() => navigate('/Userregister')}>
                          <i className="bi bi-person-plus me-2"></i>Sign Up
                        </a>
                      </li>
                    </>
                  )}
                  {isLoggedIn && (
                    <li>
                      <a className="dropdown-item menu-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-left me-2"></i>Logout
                      </a>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <style>{`
        nav {
          transition: all 0.3s ease;
          padding: 15px 0;
          background: linear-gradient(135deg, rgba(40, 167, 69, 0.9) 0%, rgba(25, 135, 84, 0.9) 100%);
        }
        
        .navbar-scrolled {
          padding: 8px 0;
          background: rgba(25, 135, 84, 0.95) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .menu-item { 
          position: relative; 
          display: inline-block; 
          cursor: pointer;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85) !important;
          transition: all 0.2s ease;
        }
        
        .menu-item:hover {
          color: white !important;
          transform: translateY(-2px);
        }
        
        .underline {
          position: absolute;
          bottom: -5px;
          left: 0;
          height: 2px;
          width: 0;
          background: white;
          transition: width 0.3s ease;
        }
        
        .menu-item:hover .underline {
          width: 100%;
        }
        
        .username-display {
          font-size: 1rem;
          letter-spacing: 1px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
          
        }
        
        .username-letter {
          display: inline-block;
          margin: 0 1px;
          
        }
        
       .dropdown-menu {
    border: none;
    box-shadow: 0 5px 15px rgba(0,0,0,0.15);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    opacity: 0;
    transform: translateY(10px);
    display: block;
    visibility: hidden;
    transition: all 0.3s ease, visibility 0.3s;
  }
  
  .dropdown-menu.show {
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
  }
  
  .dropdown-item {
    transition: all 0.2s ease;
    padding: 8px 16px;
    color: #333 !important;
    border-radius: 6px;
    margin: 2px 8px;
    width: auto;
  }
  
  .dropdown-item:hover {
    background: rgba(25, 135, 84, 0.15);
    color: #198754 !important;
  }
  
  .dropdown-divider {
    margin: 4px 0;
    opacity: 0.2;
  }
        
        @media (max-width: 992px) {
          .username-display {
            margin: 10px 0;
            font-size: 1.2rem;
          }
          
          .navbar-collapse {
            background: rgba(25, 135, 84, 0.98);
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
          }
        }
      `}</style>
    </>
  );
}