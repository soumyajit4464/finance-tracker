import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData.email, formData.password);
      navigate('/dashboard');
      window.location.reload(); // Reload to update auth state
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            fontSize: '3em',
            marginBottom: '10px'
          }}>💰</div>
          <h1 style={{ color: '#333', marginBottom: '5px' }}>FinanceTracker</h1>
          <p style={{ color: '#666' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '0.9em'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '0.9em'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1em'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '0.9em'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1em'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1em',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#6b7280',
          fontSize: '0.9em'
        }}>
          Don't have an account?{' '}
          <a
            href="/register"
            style={{
              color: '#4F46E5',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
