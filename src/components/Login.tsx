import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase.ts';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /@klu\.ac\.in$/;
    return regex.test(email);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error('Email must end with @klu.ac.in');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsSignup(false);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email is already registered');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak');
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');

      if (userCredential.user.email === '99230040469@klu.ac.in') {
        navigate('/admin');
      } else {
        navigate('/register');
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Invalid email or password');
      } else if (error.code === 'auth/invalid-credential') {
        toast.error('Invalid credentials');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md"
      >
        <h2 className="title-glow text-3xl text-center mb-8">
          {isSignup ? 'Create Account' : 'Login'}
        </h2>

        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email (@klu.ac.in)"
              className="glow-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="glow-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isSignup && (
            <div className="mb-4">
              <input
                type="password"
                placeholder="Confirm Password"
                className="glow-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="glow-btn w-full mb-4"
            disabled={loading}
          >
            {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="text-center mb-4">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-cyan-300 hover:text-cyan-100 transition-colors"
          >
            {isSignup
              ? 'Already have an account? Login'
              : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="border-t border-cyan-800/30 pt-4">
          <button
            type="button"
            onClick={async () => {
              try {
                setLoading(true);
                const result = await signInWithPopup(auth, googleProvider);
                const email = result.user.email;
                
                if (!email?.endsWith('@klu.ac.in')) {
                  toast.error('Only KLU institutional emails (@klu.ac.in) are allowed');
                  await auth.signOut();
                  return;
                }

                toast.success('Login successful!');
                
                if (email === '99230040469@klu.ac.in') {
                  navigate('/admin');
                } else {
                  navigate('/register');
                }
              } catch (error: any) {
                console.error('Google Sign-in Error:', error);
                if (error.code === 'auth/popup-closed-by-user') {
                  return;
                }
                if (error.code === 'auth/popup-blocked') {
                  toast.error('Pop-up was blocked. Please allow pop-ups for this site.');
                  return;
                }
                if (error.code === 'auth/cancelled-popup-request') {
                  return;
                }
                toast.error('Google sign-in failed. Please try again.');
              } finally {
                setLoading(false);
              }
            }}
            className="w-full flex items-center justify-center gap-2 glow-btn bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-500/80 hover:to-cyan-500/80 transition-all duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
