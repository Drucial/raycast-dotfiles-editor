import { useNavigation } from "@raycast/api";
import { ConfigFile, EditFileFormProps } from "../types/index";
import { CommonFileForm } from "./FileForm";

export function EditFileForm({
  file,
  onEdit,
}: EditFileFormProps) {
  const { pop } = useNavigation();
  function handleSubmit(editedFile: ConfigFile) {
    onEdit(editedFile);
    pop();
  }

  return (
    <CommonFileForm
      initialValues={file}
      onSubmit={handleSubmit}
      submitTitle="Save Changes"
    />
);
}