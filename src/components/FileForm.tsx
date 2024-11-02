import { Form, ActionPanel, Action, Icon, showToast, Toast, useNavigation } from "@raycast/api";
import { Application, ConfigFile } from "../types/index";
import { useState } from "react";

interface CommonFileFormProps {
  initialValues?: ConfigFile;
  onSubmit: (file: ConfigFile) => void;
  submitTitle: string;
}

export function CommonFileForm({ initialValues, onSubmit, submitTitle }: CommonFileFormProps) {
  const { pop } = useNavigation();
  const [title, setTitle] = useState(initialValues?.title || "");
  const [filePath, setFilePath] = useState(initialValues?.path || "");
  const [icon, setIcon] = useState(initialValues?.icon || Icon.Terminal);
  const [defaultApplication, setDefaultApplication] = useState(initialValues?.application || Application.VSCODE);

  function handleSubmit() {
    if (title && filePath) {
      onSubmit({
        id: initialValues?.id || title.toLowerCase().replace(/\s+/g, "-"),
        title,
        path: filePath,
        icon,
        application: defaultApplication,
      });
      pop();
    } else {
      showToast({
        style: Toast.Style.Failure,
        title: "All fields are required",
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title={submitTitle} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Title" value={title} onChange={setTitle} />
      <Form.TextField id="filePath" title="File Path" value={filePath} onChange={setFilePath} />
      <Form.Dropdown id="icon" title="Icon" value={icon} onChange={(newValue) => setIcon(newValue as Icon)}>
        <Form.Dropdown.Item value={Icon.Terminal} title="Terminal" icon={Icon.Terminal} />
        <Form.Dropdown.Item value={Icon.Document} title="Document" icon={Icon.Document} />
        <Form.Dropdown.Item value={Icon.Folder} title="Folder" icon={Icon.Folder} />
        <Form.Dropdown.Item value={Icon.Code} title="VSCode" icon={Icon.Code} />
      </Form.Dropdown>
      <Form.Dropdown
        id="defaultApplication"
        title="Default Application"
        value={defaultApplication}
        onChange={(newValue) => setDefaultApplication(newValue as Application)}
      >
        <Form.Dropdown.Item value={Application.VSCODE} title="VSCode" icon={Icon.Code} />
        <Form.Dropdown.Item value={Application.TERMINAL} title="Terminal" icon={Icon.Terminal} />
        <Form.Dropdown.Item value={Application.CURSOR} title="Cursor" icon={Icon.CodeBlock} />
        <Form.Dropdown.Item value={Application.WARP} title="Warp" icon={Icon.Terminal} />
        <Form.Dropdown.Item value={Application.KITTY} title="Kitty" icon={Icon.Terminal} />
      </Form.Dropdown>
    </Form>
  );
}
