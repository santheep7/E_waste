import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Navbar from './usernavbar';
import 'bootstrap/dist/css/bootstrap.min.css';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const videos = [
  { title: 'E-Waste Dangers', url: 'https://www.youtube.com/embed/MQLadfsvfLo?autoplay=1' },
  { title: 'How Recycling Works', url: 'https://www.youtube.com/embed/U3KUJTDPsSE?autoplay=1' },
  { title: 'Useful from E-Waste', url: 'https://www.youtube.com/embed/ldlniZfA2X4?autoplay=1' },
];


export default function UserHome() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const boxRefs = useRef([]);
  const bgRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    // ✅ Force logout when this page loads
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('agentToken')
    localStorage.removeItem('agentname')

    // Animated background circles
    const circles = bgRef.current.querySelectorAll('.bg-circle');
    circles.forEach(circle => {
      gsap.fromTo(
        circle,
        { y: gsap.utils.random(-100, 100), x: gsap.utils.random(-100, 100), opacity: 0 },
        {
          y: gsap.utils.random(-200, 200),
          x: gsap.utils.random(-200, 200),
          opacity: gsap.utils.random(0.2, 0.8),
          duration: gsap.utils.random(30, 50),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }
      );
    });

    // Animated heading
    const message = 'Welcome to Ecobin – Let’s Build a Greener Future Together';
    headingRef.current.textContent = message;
    const letters = message.split('');
    headingRef.current.innerHTML = letters
      .map(letter => `<span class="bounce-letter">${letter === ' ' ? '\u00A0' : letter}</span>`)
      .join('');
    const spans = headingRef.current.querySelectorAll('span');
    gsap.set(spans, { opacity: 0, scale: 0.5 });
    gsap.to(spans, {
      opacity: 1,
      scale: 1,
      stagger: 0.05,
      ease: 'back.out(1.7)',
      duration: 0.6,
    });

    // Animate video boxes on scroll
    boxRefs.current.forEach(box => {
      gsap.fromTo(
        box,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: box,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="user-home">
        <div className="animated-bg" />
        <div className="background-circles" ref={bgRef}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-circle" />
          ))}
        </div>

        <div className="content">
          <h1 className="heading" ref={headingRef}></h1>

          {videos.map((video, i) => (
            <div
              key={i}
              ref={el => (boxRefs.current[i] = el)}
              className="video-box"
              onClick={() => setActiveVideo(activeVideo === i ? null : i)}
            >
              <h3 className="video-title">{video.title}</h3>
              {activeVideo === i && (
                <div className="video-wrapper">
                  <iframe
                    width="100%"
                    height="400"
                    src={video.url}
                    title={video.title}
                    frameBorder="0"
                    allow="autoplay; picture-in-picture"
                    allowFullScreen
                  ></iframe>

                </div>
              )}
            </div>
          ))}

          {/* Floating Chat Icon */}
          <div className="floating-chat" onClick={() => setShowChat(!showChat)}>
            💬
          </div>

          {/* Dummy Chat Panel */}
          {showChat && (
            <div className="chatbot-panel">
              <h5 className="text-white mb-2">Chat (Demo Only)</h5>
              <div className="chat-history mb-2">
                <div className="chat-bubble bot">Hi! I'm a demo bot 😊</div>
                <div className="chat-bubble user">How to recycle e-waste?</div>
                <div className="chat-bubble bot">Visit your nearest e-waste center or schedule a pickup.</div>
              </div>
            </div>
          )}
        </div>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Eco Bin. All rights reserved.</p>
        </footer>

        <style>{`
          @keyframes gradientBg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .user-home { position: relative; overflow: hidden; min-height: 100vh; font-family: 'Arial', sans-serif; }
          .animated-bg {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(-45deg, #00c6ff, #0072ff, #00ff9d, #f9f047);
            background-size: 400% 400%; animation: gradientBg 15s ease infinite; z-index: -2;
          }
          .background-circles { position: fixed; width: 100%; height: 100%; top: 0; left: 0; z-index: -1; pointer-events: none; }
          .bg-circle { position: absolute; width: 100px; height: 100px; border-radius: 50%; background: rgba(255,255,255,0.3); }
          .content { position: relative; z-index: 1; max-width: 900px; margin: auto; padding: 100px 20px; text-align: center; }
          .heading { font-size: 2.8rem; letter-spacing: 3px; margin-bottom: 2.5rem; display: inline-block; color: white; }
          .video-box {
            background: #ffffffcc; border-radius: 16px; padding: 40px; margin: 50px 0; cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .video-box:hover { transform: translateY(-8px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .video-title { font-size: 1.9rem; color: #0072ff; margin-bottom: 20px; }
          .video-wrapper { margin-top: 25px; }
          .footer { text-align: center; padding: 20px 10px; color: white; background-color: rgba(0, 0, 0, 0.3); }

          .floating-chat {
            position: fixed; bottom: 25px; right: 25px; background: #0072ff;
            color: white; border-radius: 50%; width: 60px; height: 60px;
            font-size: 26px; display: flex; justify-content: center; align-items: center;
            cursor: pointer; z-index: 9999; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transition: background 0.3s ease;
          }
          .floating-chat:hover { background: #00c6ff; }

          .chatbot-panel {
            position: fixed; bottom: 100px; right: 25px; width: 300px;
            background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(12px);
            padding: 15px; border-radius: 16px; z-index: 9998;
            box-shadow: 0 10px 25px rgba(0,0,0,0.4);
          }
          .chat-history { max-height: 200px; overflow-y: auto; margin-bottom: 10px;
            background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;
          }
          .chat-bubble { padding: 8px 14px; margin: 5px 0; border-radius: 20px; font-size: 0.9rem; }
          .chat-bubble.user { background-color: #00c6ff; color: white; align-self: flex-end; text-align: right; }
          .chat-bubble.bot { background-color: #ffffffaa; color: #333; align-self: flex-start; text-align: left; }

          @keyframes runningLight { 0% {background-position:0% 50%;} 100% {background-position:100% 50%;} }
          .bounce-letter {
            display: inline-block; font-weight:700; background: linear-gradient(270deg,#00fff7,#fff,#00fff7);
            background-size:600% 600%; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
            animation: runningLight 3s linear infinite;
          }
        `}</style>
      </div>
    </>
  );
}
