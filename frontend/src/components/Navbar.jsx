import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5em' }}>💰</span>
          <h2 style={{ color: '#4F46E5', margin: 0 }}>FinanceTracker</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '5px' }}>
          <a href="/dashboard" style={isActive('/dashboard') ? activeLinkStyle : linkStyle}>
            Dashboard
          </a>
          <a href="/accounts" style={isActive('/accounts') ? activeLinkStyle : linkStyle}>
            Accounts
          </a>
          <a href="/transactions" style={isActive('/transactions') ? activeLinkStyle : linkStyle}>
            Transactions
          </a>
          <a href="/budgets" style={isActive('/budgets') ? activeLinkStyle : linkStyle}>
            Budgets
          </a>
          <a href="/reports" style={isActive('/reports') ? activeLinkStyle : linkStyle}>
            Reports
          </a>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ color: '#666' }}>Welcome, {user?.name}!</span>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 20px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: '#374151',
  textDecoration: 'none',
  fontWeight: '500',
  padding: '8px 16px',
  borderRadius: '6px',
  transition: 'all 0.2s'
};

const activeLinkStyle = {
  ...linkStyle,
  background: '#4F46E5',
  color: 'white'
};

export default Navbar;
