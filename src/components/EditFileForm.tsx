import { Form, ActionPanel, Action, Icon, showToast, Toast, useNavigation } from "@raycast/api";
import { useState } from "react";
import { EditFileFormProps } from "../types/index";
import { Application } from "../types/index";

export function EditFileForm({
  file,
  onEdit,
}: EditFileFormProps) {
  const { pop } = useNavigation();
  const [title, setTitle] = useState(file.title);
  const [filePath, setFilePath] = useState(file.path);
  const [icon, setIcon] = useState(file.icon);
  const [defaultApplication, setDefaultApplication] = useState(file.application || Application.VSCODE);

  function handleSubmit() {
    if (title && filePath) {
      onEdit({ id: file.id, title, path: file.path, icon, application: defaultApplication});
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
          <Action.SubmitForm title="Save Changes" onSubmit={handleSubmit} />
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
        {/* Add more icons as needed */}
      </Form.Dropdown>
      <Form.Dropdown id="defaultApplication" title="Default Application" value={defaultApplication} onChange={(newValue) => setDefaultApplication(newValue as Application)}>
        <Form.Dropdown.Item value="vscode" title="VSCode" icon={Icon.Code} />
        <Form.Dropdown.Item value="terminal" title="Terminal" icon={Icon.Terminal} />
        <Form.Dropdown.Item value="cursor" title="Cursor" icon={Icon.CodeBlock} />
        <Form.Dropdown.Item value="warp" title="Warp" icon={Icon.Terminal} />
        <Form.Dropdown.Item value="kitty" title="Kitty" icon={Icon.Terminal} />
      </Form.Dropdown>
    </Form>
  );
}