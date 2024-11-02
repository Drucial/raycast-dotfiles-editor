import { Icon, useNavigation } from "@raycast/api";
import { AddFileFormProps, Application, ConfigFile } from "../types/index";
import { CommonFileForm } from "./FileForm";

const newConfigFile = (): ConfigFile => {
  return {
    id: "",
    title: "",
    path: "",
    icon: Icon.Code,
    application: Application.VSCODE,
  };
};

export function AddFileForm({ onAdd }: AddFileFormProps) {
  const { pop } = useNavigation();

  function handleSubmit(file: ConfigFile) {
    onAdd(file);
    pop();
  }

  return (
    <CommonFileForm
      initialValues={newConfigFile()}
      onSubmit={handleSubmit}
      submitTitle="Add File"
    />
  );
}