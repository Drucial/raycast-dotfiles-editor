import {
  List,
  ActionPanel,
  Action,
  Icon,
  useNavigation,
  showToast,
  Toast,
  confirmAlert,
} from "@raycast/api";
import { useMemo, useState } from "react";
import { ConfigFile } from "../types";
import { FILE_ICONS, APPLICATIONS } from "../constants";
import AddFileForm from "./AddFileForm";
import { launchApplication } from "../utils/launcher";

interface FileListProps {
  files: ConfigFile[];
  onUpdate: (files: ConfigFile[]) => void;
  isLoading: boolean;
}

export default function FileList({ files, onUpdate, isLoading }: FileListProps) {
  const { push } = useNavigation();
  const [searchText, setSearchText] = useState("");

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

  return (
    <List
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search files..."
      isLoading={isLoading}
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
                  title="Open"
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
