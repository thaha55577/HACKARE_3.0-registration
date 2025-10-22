import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.3, 1], opacity: 1 }}
        transition={{ duration: 2.5, times: [0, 0.6, 1], ease: 'easeInOut' }}
        className="z-10 mb-8"
      >
        <motion.img
          src="./ACM_LOGO.png"
          alt="ACM KARE Logo"
          className="w-48 h-48 md:w-64 md:h-64"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(0, 212, 255, 0.8)) drop-shadow(0 0 60px rgba(0, 212, 255, 0.6))',
          }}
          animate={{
            filter: [
              'drop-shadow(0 0 40px rgba(0, 212, 255, 0.8)) drop-shadow(0 0 60px rgba(0, 212, 255, 0.6))',
              'drop-shadow(0 0 60px rgba(0, 212, 255, 1)) drop-shadow(0 0 80px rgba(0, 212, 255, 0.8))',
              'drop-shadow(0 0 40px rgba(0, 212, 255, 0.8)) drop-shadow(0 0 60px rgba(0, 212, 255, 0.6))',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 2 }}
        className="text-center z-10"
      >
        <h1 className="title-glow text-4xl md:text-6xl mb-6">
          ACM KARE Presents
        </h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '300px' }}
          transition={{ duration: 2, delay: 3.5 }}
          className="h-1 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          style={{ boxShadow: '0 0 20px #00d4ff' }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 6 }}
        className="absolute bottom-10 text-center z-10"
      >
        <p className="text-xl text-cyan-300" style={{ fontFamily: 'Orbitron' }}>
          Event Team Registration Portal
        </p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
