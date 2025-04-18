import CreateDoctorForm from "@/features/Doctor/components/CreateDoctorForm";
const Create = () => {
    return (<div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
            <h1 className="text-2xl font-semibold">Create New Doctor</h1>
        </div>
        <CreateDoctorForm />
    </div>)
}

export default Create;