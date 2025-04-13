import { useParams } from "react-router-dom";
import UserForm from "@/features/UserInfo/components/UserForm";
const Edit = () => {
    const { id } = useParams();

    return (<div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
            <h1 className="text-2xl font-semibold">Edit User</h1>
            <p className="text-muted-foreground">Update user information</p>
        </div>
        <UserForm id={Number(id)} />
    </div>)
}

export default Edit;