import { ActionPanel, Action, Icon, List } from "@raycast/api";
import { useState, useEffect } from "react";
import { ConfigFile } from "./types/index";
import { exportFiles, importFiles } from "./utils/FileHandlers";
import { EditFileForm } from "./components/EditFileForm";
import { AddFileForm } from "./components/AddFileForm";
import { loadFiles, saveFiles } from "./utils/storage";
import {
  openFileInDefaultTerminal,
  openFileInKitty,
  openFileInWarp,
  openFileInVscode,
  openFileInCursor,
} from "./utils/ApplicationHandlers";

export default function Command() {
  const [files, setFiles] = useState<ConfigFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortedFiles, setSortedFiles] = useState<ConfigFile[]>([]);


  // Load files on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const loadedFiles = await loadFiles();
        setFiles(loadedFiles);
      } catch (error) {
        console.error("Failed to load files:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, []);

  // Save files when they change
  useEffect(() => {
    if (files?.length > 0) {
      saveFiles(files);
    }
  }, [files]);

  // Sort files by title
  useEffect(() => {
    setSortedFiles(files.sort((a, b) => a.title.localeCompare(b.title)));
  }, [files]);

  // Add a new file
  const handleAddFile = (file: ConfigFile) => {
    setFiles((prevFiles) => [...prevFiles, file]);
  };

  const handleEditFile = (editedFile: ConfigFile) => {
    setFiles((prevFiles) => prevFiles.map((file) => (file.id === editedFile.id ? editedFile : file)));
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  const handleExportFiles = async () => {
    try {
      await exportFiles(files);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleImportFiles = async () => {
    try {
      const importedFiles = await importFiles();
      setFiles(importedFiles);
    } catch (error) {
      console.error("Import failed:", error);
    }
  };

  return (
    <List isLoading={isLoading}>
      {sortedFiles.map((file) => (
        <List.Item
          key={file.id}
          icon={file.icon || Icon.Terminal}
          title={file.title}
          subtitle={file.path}
          actions={
            <ActionPanel>
              <ActionPanel.Section title="Default Application">
                <Action
                  icon={Icon.Terminal}
                  title={`Open in ${file.application}`}
                  onAction={() => {
                    switch (file.application) {
                      case "kitty":
                        openFileInKitty(file.path);
                        break;
                      case "warp":
                        openFileInWarp(file.path);
                        break;
                      case "vscode":
                        openFileInVscode(file.path);
                        break;
                      case "cursor":
                        openFileInCursor(file.path);
                        break;
                      default:
                        openFileInDefaultTerminal(file.path);
                    }
                  }}
                />
              </ActionPanel.Section>

              <ActionPanel.Section title="Terminals">
                {file.application !== "kitty" && (
                  <Action icon={Icon.Terminal} title="Open in Kitty" onAction={() => openFileInKitty(file.path)} />
                )}
                {file.application !== "warp" && (
                  <Action icon={Icon.Terminal} title="Open in Warp" onAction={() => openFileInWarp(file.path)} />
                )}
                {file.application !== "terminal" && (
                  <Action
                    icon={Icon.Terminal}
                    title="Open in Terminal"
                    onAction={() => openFileInDefaultTerminal(file.path)}
                  />
                )}
              </ActionPanel.Section>

              <ActionPanel.Section title="Code Editor">
                {file.application !== "vscode" && (
                  <Action icon={Icon.Code} title="Open in VSCode" onAction={() => openFileInVscode(file.path)} />
                )}
                {file.application !== "cursor" && (
                  <Action icon={Icon.CodeBlock} title="Open in Cursor" onAction={() => openFileInCursor(file.path)} />
                )}
              </ActionPanel.Section>

              <ActionPanel.Section title="Manage">
                <Action.Push
                  icon={Icon.Pencil}
                  title="Edit File"
                  target={<EditFileForm file={file} onEdit={handleEditFile} />}
                />
                <Action
                  icon={Icon.Trash}
                  title="Remove File"
                  onAction={() => handleRemoveFile(file.id)}
                  style={Action.Style.Destructive}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}

      <List.Item
        icon={Icon.Plus}
        title="Add New File"
        actions={
          <ActionPanel>
            <ActionPanel.Section>
              <Action.Push
                icon={Icon.Plus}
                title="Add New File"
                target={<AddFileForm onAdd={handleAddFile} />}
              />
            </ActionPanel.Section>

            <ActionPanel.Section title="Import/Export">
              <Action icon={Icon.Upload} title="Export Files" onAction={handleExportFiles} />
              <Action icon={Icon.Download} title="Import Files" onAction={handleImportFiles} />
            </ActionPanel.Section>
          </ActionPanel>
        }
      />
    </List>
  );
}
