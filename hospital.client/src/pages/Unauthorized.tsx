import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
			<div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-border rounded-2xl shadow-xl p-8 text-center">
				<h1 className="text-2xl font-semibold mb-2">Unauthorized Access</h1>
				<p className="text-muted-foreground mb-6">
					Sorry, you don't have permission to access this page.
				</p>
				<div className="flex flex-col sm:flex-row justify-center gap-3">
					<Button variant="outline" onClick={() => navigate(-1)}>
						Go Back
					</Button>
					<Button onClick={() => navigate("/dashboard")}>
						Go to Dashboard
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Unauthorized;
