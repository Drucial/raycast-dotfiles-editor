import {
  List,
  ActionPanel,
  Action,
  Icon,
  useNavigation,
  showToast,
  Toast,
  confirmAlert,
  Alert,
} from "@raycast/api";
import { useMemo, useState } from "react";
import { ConfigFile } from "../types";
import { FILE_ICONS, getApplications } from "../constants";
import AddFileForm from "./AddFileForm";
import { launchApplication } from "../utils/launcher";
import { exportToJson, importFromJson } from "../utils/importExport";

interface FileListProps {
  files: ConfigFile[];
  onUpdate: (files: ConfigFile[]) => void;
  isLoading: boolean;
}

export default function FileList({ files, onUpdate, isLoading }: FileListProps) {
  const { push } = useNavigation();
  const [searchText, setSearchText] = useState("");
  const applications = getApplications();

  const sortedAndFilteredFiles = useMemo(() => {
    return files
      .filter((file) =>
        file.name.toLowerCase().includes(searchText.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [files, searchText]);

  const handleDelete = async (file: ConfigFile) => {
    const shouldDelete = await confirmAlert({
      title: "Delete File",
      message: `Are you sure you want to delete "${file.name}"?`,
      icon: Icon.Trash,
    });

    if (shouldDelete) {
      const updatedFiles = files.filter((f) => f.id !== file.id);
      onUpdate(updatedFiles);
      await showToast(Toast.Style.Success, "File deleted successfully");
    }
  };

  const handleEdit = (file: ConfigFile) => {
    push(
      <AddFileForm
        existingFiles={files}
        onSubmit={(updatedFile) => {
          const updatedFiles = files.map((f) =>
            f.id === updatedFile.id ? updatedFile : f
          );
          onUpdate(updatedFiles);
        }}
        editFile={file}
      />
    );
  };

  const handleAdd = () => {
    push(
      <AddFileForm
        existingFiles={files}
        onSubmit={(newFile) => {
          onUpdate([...files, newFile]);
        }}
      />
    );
  };

  const handleOpen = async (file: ConfigFile) => {
    try {
      await launchApplication(file);
      await showToast(Toast.Style.Success, "Opened successfully");
    } catch (error) {
      await showToast(Toast.Style.Failure, "Failed to open", String(error));
    }
  };

  const getApplicationName = (appId: string) => {
    const app = applications.find(app => app.id === appId);
    return app ? app.name : appId;
  };

  const handleExport = async () => {
    try {
      await exportToJson(files);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleImport = async () => {
    try {
      const importedFiles = await importFromJson();
      if (importedFiles.length > 0) {
        // Optionally merge with existing files or replace them
        const shouldReplace = await confirmAlert({
          title: "Import Configuration",
          message: "Do you want to replace existing files or merge with them?",
          primaryAction: {
            title: "Replace",
            style: Alert.ActionStyle.Destructive,
          },
          dismissAction: {
            title: "Merge",
          },
        });

        if (shouldReplace) {
          onUpdate(importedFiles);
        } else {
          // Merge while avoiding duplicates by ID
          const mergedFiles = [
            ...files,
            ...importedFiles.filter(
              (imported) => !files.some((existing) => existing.id === imported.id)
            ),
          ];
          onUpdate(mergedFiles);
        }
      }
    } catch (error) {
      console.error("Import failed:", error);
    }
  };

  return (
    <List
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search files..."
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action
              title="Add New File"
              icon={Icon.Plus}
              shortcut={{ modifiers: ["cmd"], key: "n" }}
              onAction={handleAdd}
            />
          </ActionPanel.Section>
          <ActionPanel.Section>
            <Action
              title="Export Configuration"
              icon={Icon.Download}
              shortcut={{ modifiers: ["cmd", "shift"], key: "e" }}
              onAction={handleExport}
            />
            <Action
              title="Import Configuration"
              icon={Icon.Upload}
              shortcut={{ modifiers: ["cmd", "shift"], key: "i" }}
              onAction={handleImport}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    >
      {sortedAndFilteredFiles.map((file) => (
        <List.Item
          key={file.id}
          icon={FILE_ICONS[file.type]}
          title={file.name}
          accessories={[{ text: file.path }]}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action
                  title={`Open in ${getApplicationName(file.application)}`}
                  icon={Icon.ArrowRight}
                  onAction={() => handleOpen(file)}
                />
              </ActionPanel.Section>
              <ActionPanel.Section>
                <Action
                  title="Add New File"
                  icon={Icon.Plus}
                  shortcut={{ modifiers: ["cmd"], key: "n" }}
                  onAction={handleAdd}
                />
                <Action
                  title="Edit"
                  icon={Icon.Pencil}
                  shortcut={{ modifiers: ["cmd"], key: "e" }}
                  onAction={() => handleEdit(file)}
                />
                <Action
                  title="Delete"
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                  onAction={() => handleDelete(file)}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
      {sortedAndFilteredFiles.length === 0 && !isLoading && (
        <List.EmptyView
          icon={Icon.Document}
          title="No files found"
          description="Add a new file to get started"
          actions={
            <ActionPanel>
              <Action
                title="Add New File"
                icon={Icon.Plus}
                shortcut={{ modifiers: ["cmd"], key: "n" }}
                onAction={handleAdd}
              />
            </ActionPanel>
          }
        />
      )}
    </List>
  );
} 
