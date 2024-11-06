import { Project } from "../types/index";
import { CommonProjectForm } from "./ProjectForm";

interface AddProjectFormProps {
  onSubmit: (project: Project) => void;
}

export function AddProjectForm({ onSubmit }: AddProjectFormProps) {
  return (
    <CommonProjectForm
      onSubmit={onSubmit}
      submitTitle="Add Project"
    />
  );
}
