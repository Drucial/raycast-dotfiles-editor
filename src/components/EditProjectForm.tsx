import { useNavigation } from "@raycast/api";
import { Project } from "../types/index";
import { CommonProjectForm } from "./ProjectForm";

interface EditProjectFormProps {
  project: Project;
  onEdit: (project: Project) => void;
}

export function EditProjectForm({
  project,
  onEdit,
}: EditProjectFormProps) {
  const { pop } = useNavigation();
  
  function handleSubmit(editedProject: Project) {
    onEdit(editedProject);
    pop();
  }

  return (
    <CommonProjectForm
      initialValues={project}
      onSubmit={handleSubmit}
      submitTitle="Save Changes"
    />
  );
}