import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

type Props = {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	userName: string;
	onConfirm: (role: string) => void;
	action: "add" | "remove";
};

const roles = ["Pharmacist", "Receptionist"];

export function RoleAssignmentPopup({ isOpen, setIsOpen, userName, onConfirm, action }: Props) {
	const [selectedRole, setSelectedRole] = useState("");

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{action === "add" ? "Add Role" : "Remove Role"} for {userName}</DialogTitle>
				</DialogHeader>
				<RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
					{roles.map((role) => (
						<div key={role} className="flex items-center space-x-2">
							<RadioGroupItem value={role} id={role} />
							<label htmlFor={role}>{role}</label>
						</div>
					))}
				</RadioGroup>
				<div className="flex justify-end gap-2 mt-4">
					<Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
					<Button onClick={() => selectedRole && onConfirm(selectedRole)} disabled={!selectedRole}>
						Confirm
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
