import PatientForm from "../../features/Patient/components/CreatePatientForm"

const Create = () => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Create New Patient</h1>
                <p className="text-muted-foreground">Enter patient information</p>
            </div>
            <PatientForm />
        </div>
    )
}

export default Create;