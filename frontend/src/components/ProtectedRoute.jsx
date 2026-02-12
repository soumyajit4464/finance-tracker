import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

function ProtectedRoute({ children }) {
  const user = authService.getCurrentUser();

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
