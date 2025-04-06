import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-6">Oops! The page you're looking for doesn't exist.</p>
            <Link
                to="/"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;