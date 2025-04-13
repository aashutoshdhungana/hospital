import UserForm from "@/features/UserInfo/components/UserForm"

const Create = () => {
    return (<div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
            <h1 className="text-2xl font-semibold">Create New User</h1>
            <p className="text-muted-foreground">Enter user information</p>
        </div>
        <UserForm />
    </div>)
}

export default Create;