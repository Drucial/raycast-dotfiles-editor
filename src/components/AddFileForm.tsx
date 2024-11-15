import {
  Action,
  ActionPanel,
  Form,
  useNavigation,
  showToast,
  Toast,
} from "@raycast/api";
import { useState } from "react";
import { nanoid } from "nanoid";
import fs from "fs";
import { ConfigFile, FormValues } from "../types";
import { getApplications } from "../constants";

interface AddFileFormProps {
  existingFiles: ConfigFile[];
  onSubmit: (file: ConfigFile) => void;
  editFile?: ConfigFile;
}

export default function AddFileForm({ existingFiles, onSubmit, editFile }: AddFileFormProps) {
  const { pop } = useNavigation();
  const [nameError, setNameError] = useState<string | undefined>();
  const [isDirectory, setIsDirectory] = useState(editFile ? editFile.type === 'directory' : false);

  const validateName = (name: string, currentId?: string) => {
    if (!name) {
      setNameError("Name is required");
      return;
    }

    const duplicate = existingFiles.find(
      (file) => file.name.toLowerCase() === name.toLowerCase() && file.id !== currentId
    );

    if (duplicate) {
      setNameError("This name is already in use");
    } else {
      setNameError(undefined);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const filePath = Array.isArray(values.path) ? values.path[0] : values.path;
      
      if (!filePath) {
        throw new Error("No file or directory selected");
      }

      const stats = await fs.promises.stat(filePath);
      const fileType = stats.isDirectory() ? "directory" : "file";

      if ((isDirectory && fileType !== "directory") || (!isDirectory && fileType !== "file")) {
        throw new Error(`Selected item must be a ${isDirectory ? "directory" : "file"}`);
      }

      const configFile: ConfigFile = {
        id: editFile?.id || nanoid(),
        name: values.name,
        path: filePath,
        type: fileType,
        application: values.application,
        command: values.command,
      };

      onSubmit(configFile);
      await showToast(Toast.Style.Success, `${fileType} saved successfully`);
      pop();
    } catch (error) {
      await showToast(Toast.Style.Failure, "Error saving item", String(error));
    }
  };

  const applications = getApplications();

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Checkbox
        id="isDirectory"
        label="Select Directory"
        value={isDirectory}
        onChange={setIsDirectory}
      />

      <Form.FilePicker
        id="path"
        title={isDirectory ? "Select Directory" : "Select File"}
        allowMultipleSelection={false}
        defaultValue={editFile ? [editFile.path] : undefined}
        showHiddenFiles={true}
        canChooseDirectories={isDirectory}
        canChooseFiles={!isDirectory}
      />
      
      <Form.TextField
        id="name"
        title="Name"
        placeholder="Enter a unique name"
        defaultValue={editFile?.name}
        error={nameError}
        onChange={(value) => validateName(value, editFile?.id)}
      />

      <Form.Dropdown id="application" title="Application" defaultValue={editFile?.application}>
        {applications.map((app) => (
          <Form.Dropdown.Item key={app.id} value={app.id} title={app.name} />
        ))}
      </Form.Dropdown>

      <Form.TextField
        id="command"
        title="Terminal Command"
        placeholder="e.g., vim, nvim, nano"
        defaultValue={editFile?.command}
      />
    </Form>
  );
} 
