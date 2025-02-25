import { useState } from "react";
import Modal from "./Modal";

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProjectCreated: (newProject: { id: number; name: string; domain: string; favourites: number }) => void;
    userEmail: string;
}

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated, userEmail }: CreateProjectModalProps) {
    const [projectName, setProjectName] = useState<string>("");
    const [domainName, setDomainName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleCreateProject = async () => {
        if (!projectName.trim() || !domainName.trim()) {
            setErrorMessage("Project Name and Domain Name are required.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/post-project", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    projectName,
                    domainName,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onProjectCreated({ id: Date.now(), name: projectName, domain: domainName, favourites: 0 });
                setProjectName("");
                setDomainName("");
                onClose();
                setSuccessMessage("Project successfully created!"); // Show success message
            } else {
                setErrorMessage(data.message || "Error creating project.");
            }
        } catch (error) {
            setErrorMessage("An error occurred while creating the project.");
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Project"  hideOKBUtton={true}>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Enter Project Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Domain Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                />

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <div className="flex space-x-2">
                    <button
                        className="flex-1 px-3 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600"
                        onClick={handleCreateProject}
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create New Project"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
