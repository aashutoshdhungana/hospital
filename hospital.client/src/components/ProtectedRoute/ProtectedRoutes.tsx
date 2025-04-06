import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
	requiredPermissions?: string[];
	requiredRoles?: string[];
}

const ProtectedRoute : React.FC<ProtectedRouteProps> = ({ requiredPermissions = []}: ProtectedRouteProps) => {
	const { isAuthenticated, permissions, activeRole } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

    // all permissions are required
	const hasPermissions =
		requiredPermissions.length === 0 || requiredPermissions.every(permission => permissions.includes(permission));

	if (!hasPermissions && activeRole !== 'Admin') {
		return <Navigate to="/unauthorized" replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
