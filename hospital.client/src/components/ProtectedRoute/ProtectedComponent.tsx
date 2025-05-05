import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
    requiredPermissions?: string[];
    fallbackPath?: string;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    requiredPermissions = [],
    fallbackPath = "/unauthorized",
    children,
}: ProtectedRouteProps) => {
    const { isAuthenticated, permissions, activeRole } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={fallbackPath} replace />;
    }

	const hasPermissions =
		requiredPermissions.length === 0 || requiredPermissions.every(permission => permissions.includes(permission));

	if (!hasPermissions && activeRole !== 'Admin') {
		return <></>
	}

    return <>{children}</>;
};

export default ProtectedRoute;