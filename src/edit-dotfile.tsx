import { ActionPanel, Action, Icon, List, showToast, Toast, Form, useNavigation, LocalStorage } from "@raycast/api";
import * as child_process from "child_process";
import * as path from "path";
import React, { useState, useEffect } from "react";
import fs from "fs";
import { homedir } from "os";

// Define your initial list of config files with resolved paths
const initialFiles = [
  { id: "zsh", title: "Zsh Config", path: path.resolve(process.env.HOME || "", ".config/zsh/.zshrc") },
  { id: "nvim", title: "Neovim Config", path: path.resolve(process.env.HOME || "", ".config/nvim") },
  { id: "alias", title: "Aliases Config", path: path.resolve(process.env.HOME || "", ".config/zsh/aliases.zsh") },
  { id: "warp", title: "Warp Theme", path: path.resolve(process.env.HOME || "", ".warp/themes/Celestial.yaml") },
  { id: "gitconfig", title: "Git Config", path: path.resolve(process.env.HOME || "", ".gitconfig") },
  { id: "starship", title: "Starship Config", path: path.resolve(process.env.HOME || "", ".config/starship.toml") },
  { id: "bat", title: "Bat Config", path: path.resolve(process.env.HOME || "", ".config/bat/config") },
  { id: "aero", title: "Aerospace Config", path: path.resolve(process.env.HOME || "", ".config/aerospace/aerospace.toml") },
];

function openFileInDefaultTerminal(filePath: string) {
  showToast({
    style: Toast.Style.Animated,
    title: "Opening in Terminal...",
  });

  const kittyCommand = `/Applications/kitty.app/Contents/MacOS/kitty zsh -l -c 'nvim ${filePath}'`;

  child_process.exec(kittyCommand, (error) => {
    if (error) {
      const terminalCommand = `osascript -e 'tell application "Terminal" to do script "nvim ${filePath}"' -e 'tell application "Terminal" to activate'`;

      child_process.exec(terminalCommand, (terminalError) => {
        if (terminalError) {
          showToast({
            style: Toast.Style.Failure,
            title: "Failed to open file",
            message: terminalError.message,
          });
        } else {
          showToast({
            style: Toast.Style.Success,
            title: "File opened successfully in Terminal",
          });
        }
      });
    } else {
      showToast({
        style: Toast.Style.Success,
        title: "File opened successfully in Kitty",
      });
    }
  });
}

function AddFileForm({ onAdd }: { onAdd: (file: { id: string; title: string; path: string }) => void }) {
  const { pop } = useNavigation();
  const [title, setTitle] = useState("");
  const [filePath, setFilePath] = useState("");

  function handleSubmit() {
    if (title && filePath) {
      onAdd({ id: title.toLowerCase().replace(/\s+/g, "-"), title, path: filePath });
      pop();
    } else {
      showToast({
        style: Toast.Style.Failure,
        title: "Both fields are required",
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
    </Form>
  );
}

function EditFileForm({ file, onEdit }: { file: { id: string; title: string; path: string }; onEdit: (editedFile: { id: string; title: string; path: string }) => void }) {
  const { pop } = useNavigation();
  const [title, setTitle] = useState(file.title);
  const [filePath, setFilePath] = useState(file.path);

  function handleSubmit() {
    if (title && filePath) {
      onEdit({ id: file.id, title, path: filePath });
      pop();
    } else {
      showToast({
        style: Toast.Style.Failure,
        title: "Both fields are required",
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
    </Form>
  );
}

export default function Command() {
  const [files, setFiles] = useState<{ id: string; title: string; path: string }[]>([]);

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

  function addFile(file: { id: string; title: string; path: string }) {
    setFiles((prevFiles) => [...prevFiles, file]);
  }

  function editFile(editedFile: { id: string; title: string; path: string }) {
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
          icon={Icon.Terminal}
          title={file.title}
          actions={
            <ActionPanel>
              <Action
                icon={Icon.Terminal}
                title="Open in Default Terminal"
                onAction={() => openFileInDefaultTerminal(file.path)}
              />
              <Action.Push icon={Icon.Pencil} title="Edit File" target={<EditFileForm file={file} onEdit={editFile} />} />
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
