import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Checking authentication...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
