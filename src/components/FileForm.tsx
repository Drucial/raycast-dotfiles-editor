import { Form, ActionPanel, Action, Icon, showToast, Toast, useNavigation } from "@raycast/api";
import { Application, ApplicationIcons, ConfigFile } from "../types/index";
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
  const [application, setApplication] = useState<Application>(
    initialValues?.application || Application.TERMINAL
  );

  function handleSubmit() {
    if (title && filePath) {
      onSubmit({
        id: initialValues?.id || title.toLowerCase().replace(/\s+/g, "-"),
        title,
        path: filePath,
        application,
        icon: ApplicationIcons[application],
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
      <Form.Dropdown
        id="defaultApplication"
        title="Default Application"
        value={application}
        onChange={(newValue) => setApplication(newValue as Application)}
      >
        <Form.Dropdown.Item 
          value={Application.VSCODE} 
          title="VSCode" 
          icon={ApplicationIcons[Application.VSCODE]} 
        />
        <Form.Dropdown.Item 
          value={Application.TERMINAL} 
          title="Terminal" 
          icon={ApplicationIcons[Application.TERMINAL]} 
        />
        <Form.Dropdown.Item 
          value={Application.CURSOR} 
          title="Cursor" 
          icon={ApplicationIcons[Application.CURSOR]} 
        />
        <Form.Dropdown.Item 
          value={Application.WARP} 
          title="Warp" 
          icon={ApplicationIcons[Application.WARP]} 
        />
        <Form.Dropdown.Item 
          value={Application.KITTY} 
          title="Kitty" 
          icon={ApplicationIcons[Application.KITTY]} 
        />
      </Form.Dropdown>
    </Form>
  );
}
