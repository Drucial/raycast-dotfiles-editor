import { ActionPanel, Action, Icon, List, showToast, Toast, Form, useNavigation, LocalStorage } from "@raycast/api";
import * as child_process from "child_process";
import * as path from "path";
import { useState, useEffect } from "react";
import fs from "fs";
import { homedir } from "os";

// Define your initial list of config files with resolved paths
const initialFiles = [
  {
    id: "zsh",
    title: "Zsh Config",
    path: "~/.config/zsh/.zshrc",
    icon: Icon.Terminal,
  },
  {
    id: "nvim",
    title: "Neovim Config",
    path: "~/.config/nvim",
    icon: Icon.Terminal,
  },
  {
    id: "alias",
    title: "Aliases Config",
    path: "~/.config/zsh/aliases.zsh",
    icon: Icon.Terminal,
  },
  {
    id: "warp",
    title: "Warp Theme",
    path: "~/.warp/themes/Celestial.yaml",
    icon: Icon.Terminal,
  },
  {
    id: "gitconfig",
    title: "Git Config",
    path: "~/.gitconfig",
    icon: Icon.Terminal,
  },
  {
    id: "starship",
    title: "Starship Config",
    path: "~/.config/starship.toml",
    icon: Icon.Terminal,
  },
  {
    id: "bat",
    title: "Bat Config",
    path: "~/.config/bat/config",
    icon: Icon.Terminal,
  },
  {
    id: "aero",
    title: "Aerospace Config",
    path: "~/.config/aerospace/aerospace.toml",
    icon: Icon.Terminal,
  },
];

function openFileInDefaultTerminal(filePath: string) {
  showToast({
    style: Toast.Style.Animated,
    title: "Opening in Terminal...",
  });

  const expandedFilePath = filePath.replace(/^~\//, `${homedir()}/`);
  const terminalCommand = `osascript -e 'tell application "Terminal" to do script "export USER=$(whoami); nvim ${expandedFilePath}"' -e 'tell application "Terminal" to activate'`;

  child_process.exec(terminalCommand, (error) => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to open file in Terminal",
        message: error.message,
      });
    } else {
      showToast({
        style: Toast.Style.Success,
        title: "File opened successfully in Terminal",
      });
    }
  });
}

function openFileInKitty(filePath: string) {
  showToast({
    style: Toast.Style.Animated,
    title: "Opening in Kitty...",
  });

  const expandedFilePath = filePath.replace(/^~\//, `${homedir()}/`);
  const kittyCommand = `/Applications/kitty.app/Contents/MacOS/kitty zsh -l -c 'export USER=$(whoami); nvim ${expandedFilePath}'`;

  child_process.exec(kittyCommand, (error) => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to open file in Kitty",
        message: error.message,
      });
    } else {
      showToast({
        style: Toast.Style.Success,
        title: "File opened successfully in Kitty",
      });
    }
  });
}

function openFileInWarp(filePath: string) {
  showToast({
    style: Toast.Style.Animated,
    title: "Opening in Warp...",
  });

  // Expand the tilde to the full home directory path
  const expandedFilePath = filePath.replace(/^~\//, `${homedir()}/`);

  const warpCommand = `
  osascript -e '
  if application "Warp" is not running then
    tell application "Warp" to launch
    delay 1
  else
    tell application "System Events"
      set frontmost of process "Warp" to true
      delay 0.5
      keystroke "t" using {command down}
      delay 0.5
    end tell
  end if
  tell application "System Events" to keystroke "export USER=$(whoami); nvim ${expandedFilePath}" & return'
  `;

  child_process.exec(warpCommand, (error) => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to open file in Warp",
        message: error.message,
      });
    } else {
      showToast({
        style: Toast.Style.Success,
        title: "File opened successfully in Warp",
      });
    }
  });
}

function formatPath(inputPath: string): string {
  let formattedPath = inputPath.trim();
  return path.resolve(formattedPath);
}

function AddFileForm({ onAdd }: { onAdd: (file: { id: string; title: string; path: string; icon: string }) => void }) {
  const { pop } = useNavigation();
  const [title, setTitle] = useState("");
  const [filePath, setFilePath] = useState("");
  const [icon, setIcon] = useState(Icon.Terminal);

  function handleSubmit() {
    if (title && filePath) {
      const formattedPath = formatPath(filePath);
      onAdd({ id: title.toLowerCase().replace(/\s+/g, "-"), title, path: formattedPath, icon });
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
          <Action.SubmitForm title="Add File" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Title" value={title} onChange={setTitle} />
      <Form.TextField id="filePath" title="File Path" value={filePath} onChange={setFilePath} />
      <Form.Dropdown id="icon" title="Icon" value={icon} onChange={setIcon}>
        <Form.Dropdown.Item value={Icon.Terminal} title="Terminal" icon={Icon.Terminal} />
        <Form.Dropdown.Item value={Icon.Document} title="Document" icon={Icon.Document} />
        <Form.Dropdown.Item value={Icon.Folder} title="Folder" icon={Icon.Folder} />
        {/* Add more icons as needed */}
      </Form.Dropdown>
    </Form>
  );
}

function EditFileForm({
  file,
  onEdit,
}: {
  file: { id: string; title: string; path: string; icon: string };
  onEdit: (editedFile: { id: string; title: string; path: string; icon: string }) => void;
}) {
  const { pop } = useNavigation();
  const [title, setTitle] = useState(file.title);
  const [filePath, setFilePath] = useState(file.path);
  const [icon, setIcon] = useState(file.icon);

  function handleSubmit() {
    if (title && filePath) {
      const formattedPath = formatPath(filePath);
      onEdit({ id: file.id, title, path: formattedPath, icon });
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
      <Form.Dropdown id="icon" title="Icon" value={icon} onChange={setIcon}>
        <Form.Dropdown.Item value={Icon.Terminal} title="Terminal" icon={Icon.Terminal} />
        <Form.Dropdown.Item value={Icon.Document} title="Document" icon={Icon.Document} />
        <Form.Dropdown.Item value={Icon.Folder} title="Folder" icon={Icon.Folder} />
        {/* Add more icons as needed */}
      </Form.Dropdown>
    </Form>
  );
}

export default function Command() {
  const [files, setFiles] = useState<{ id: string; title: string; path: string; icon: string }[]>([]);

  useEffect(() => {
    // Load files from local storage on mount
    async function loadFiles() {
      try {
        const storedFiles = await LocalStorage.getItem<string>("config-files");
        if (storedFiles) {
          const parsedFiles = JSON.parse(storedFiles);
          console.log("Loaded files from storage:", parsedFiles);
          setFiles(parsedFiles);
        } else {
          console.log("No files found in storage, using initial files.");
          setFiles(initialFiles);
        }
      } catch (error) {
        console.error("Failed to load files from storage:", error);
        setFiles(initialFiles); // Fallback to initial files in case of error
      }
    }
    loadFiles();
  }, []);

  useEffect(() => {
    // Store files in local storage whenever they change
    async function saveFiles() {
      try {
        await LocalStorage.setItem("config-files", JSON.stringify(files));
        console.log("Saved files to storage:", files);
      } catch (error) {
        console.error("Failed to save files to storage:", error);
      }
    }
    if (files.length > 0) {
      saveFiles();
    }
  }, [files]);

  function addFile(file: { id: string; title: string; path: string; icon: string }) {
    setFiles((prevFiles) => [...prevFiles, file]);
  }

  function editFile(editedFile: { id: string; title: string; path: string; icon: string }) {
    setFiles((prevFiles) => prevFiles.map((file) => (file.id === editedFile.id ? editedFile : file)));
  }

  function removeFile(fileId: string) {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    showToast({
      style: Toast.Style.Success,
      title: "File removed successfully",
    });
  }

  function exportFiles() {
    const filePath = path.join(homedir(), "raycast-config-files.json");
    fs.writeFile(filePath, JSON.stringify(files, null, 2), (err) => {
      if (err) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to export files",
          message: err.message,
        });
      } else {
        showToast({
          style: Toast.Style.Success,
          title: "Files exported successfully",
          message: `Exported to ${filePath}`,
        });
      }
    });
  }

  function importFiles() {
    const filePath = path.join(homedir(), "raycast-config-files.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to import files",
          message: err.message,
        });
      } else {
        try {
          const importedFiles = JSON.parse(data);
          setFiles(importedFiles);
          showToast({
            style: Toast.Style.Success,
            title: "Files imported successfully",
          });
        } catch (parseError) {
          showToast({
            style: Toast.Style.Failure,
            title: "Failed to parse imported files",
            message: parseError.message,
          });
        }
      }
    });
  }

  return (
    <List>
      {files.map((file) => (
        <List.Item
          key={file.id}
          icon={file.icon || Icon.Terminal}
          title={file.title}
          actions={
            <ActionPanel>
              <Action
                icon={Icon.Terminal}
                title="Open in Default Terminal"
                onAction={() => openFileInDefaultTerminal(file.path)}
              />
              <Action icon={Icon.Terminal} title="Open in Kitty" onAction={() => openFileInKitty(file.path)} />
              <Action icon={Icon.Terminal} title="Open in Warp" onAction={() => openFileInWarp(file.path)} />
              <Action.Push
                icon={Icon.Pencil}
                title="Edit File"
                target={<EditFileForm file={file} onEdit={editFile} />}
              />
              <Action
                icon={Icon.Trash}
                title="Remove File"
                onAction={() => removeFile(file.id)}
                style={Action.Style.Destructive}
              />
            </ActionPanel>
          }
        />
      ))}
      <List.Item
        icon={Icon.Plus}
        title="Add New File"
        actions={
          <ActionPanel>
            <Action.Push icon={Icon.Plus} title="Add New File" target={<AddFileForm onAdd={addFile} />} />
            <Action icon={Icon.Upload} title="Export Files" onAction={exportFiles} />
            <Action icon={Icon.Download} title="Import Files" onAction={importFiles} />
          </ActionPanel>
        }
      />
    </List>
  );
}
