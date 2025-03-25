import { useAuth } from "../context/AuthContext";

const CommonDashboard = () => {
    const { user, roles } = useAuth();
    return (
        <div>
            <h1>Welcome {user?.firstName}</h1>
            <h2>Roles</h2>
            {
                roles.map(x => {
                    return <div key={x}>{x}</div>
                })
            }
        </div>
    );
}

export default CommonDashboard;