import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
	requiredPermissions?: string[];
	requiredRoles?: string[];
}

const ProtectedRoute = ({ requiredPermissions = [], requiredRoles = [] }: ProtectedRouteProps) => {
	const { isAuthenticated, permissions, roles } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

    // atleast one role is required
	const hasRole = requiredRoles.length === 0 || roles.some(role => requiredRoles.includes(role));

    // all permissions are required
	const hasPermissions =
		requiredPermissions.length === 0 || requiredPermissions.every(permission => permissions.includes(permission));

	if (!hasRole || !hasPermissions) {
		//return <Navigate to="/unauthorized" replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
