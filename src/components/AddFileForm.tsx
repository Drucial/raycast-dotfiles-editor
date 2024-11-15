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

interface FormErrors {
  name?: string;
  path?: string;
  application?: string;
  command?: string;
}

export default function AddFileForm({ existingFiles, onSubmit, editFile }: AddFileFormProps) {
  const { pop } = useNavigation();
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedAppId, setSelectedAppId] = useState<string>(editFile?.application || "");
  const applications = getApplications();
  
  const selectedApp = applications.find(app => app.id === selectedAppId);
  const showTerminalCommand = selectedApp?.requiresCommand;

  const validateName = (name: string, currentId?: string) => {
    if (!name || name.trim() === "") {
      return "Name is required";
    }

    const duplicate = existingFiles.find(
      (file) => file.name.toLowerCase() === name.toLowerCase() && file.id !== currentId
    );

    if (duplicate) {
      return "This name is already in use";
    }

    return undefined;
  };

  const validateForm = (values: FormValues): FormErrors => {
    const newErrors: FormErrors = {};

    // Validate path
    if (!values.path || values.path.length === 0) {
      newErrors.path = "File or directory is required";
    }

    // Validate name
    const nameError = validateName(values.name, editFile?.id);
    if (nameError) {
      newErrors.name = nameError;
    }

    // Validate application
    if (!values.application) {
      newErrors.application = "Application is required";
    }

    // Validate terminal command if required
    if (showTerminalCommand && (!values.command || values.command.trim() === "")) {
      newErrors.command = "Terminal command is required";
    }

    return newErrors;
  };

  const handleSubmit = async (values: FormValues) => {
    const formErrors = validateForm(values);
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const filePath = Array.isArray(values.path) ? values.path[0] : values.path;
      
      if (!filePath) {
        throw new Error("No file or directory selected");
      }

      const stats = await fs.promises.stat(filePath);
      const fileType = stats.isDirectory() ? "directory" : "file";

      const configFile: ConfigFile = {
        id: editFile?.id || nanoid(),
        name: values.name.trim(),
        path: filePath,
        type: fileType,
        application: values.application,
        command: showTerminalCommand ? values.command?.trim() : undefined,
      };

      onSubmit(configFile);
      await showToast(Toast.Style.Success, `${fileType} saved successfully`);
      pop();
    } catch (error) {
      await showToast(Toast.Style.Failure, "Error saving item", String(error));
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.FilePicker
        id="path"
        title="Select File or Directory"
        allowMultipleSelection={false}
        defaultValue={editFile ? [editFile.path] : undefined}
        showHiddenFiles={true}
        canChooseDirectories={true}
        canChooseFiles={true}
        error={errors.path}
      />
      
      <Form.TextField
        id="name"
        title="Name"
        placeholder="Enter a unique name"
        defaultValue={editFile?.name}
        error={errors.name}
        onChange={(value) => {
          const error = validateName(value, editFile?.id);
          setErrors(prev => ({ ...prev, name: error }));
        }}
      />

      <Form.Dropdown 
        id="application" 
        title="Application" 
        defaultValue={editFile?.application}
        error={errors.application}
        onChange={(newValue) => {
          setSelectedAppId(newValue);
          // Clear command error if switching from terminal app
          const newApp = applications.find(app => app.id === newValue);
          if (!newApp?.requiresCommand) {
            setErrors(prev => ({ ...prev, command: undefined }));
          }
        }}
      >
        {applications.map((app) => (
          <Form.Dropdown.Item key={app.id} value={app.id} title={app.name} />
        ))}
      </Form.Dropdown>

      {showTerminalCommand && (
        <Form.TextField
          id="command"
          title="Terminal Command"
          placeholder="e.g., vim, nvim, nano"
          defaultValue={editFile?.command}
          error={errors.command}
          onChange={(value) => {
            const error = !value || value.trim() === "" ? "Terminal command is required" : undefined;
            setErrors(prev => ({ ...prev, command: error }));
          }}
        />
      )}
    </Form>
  );
} 
