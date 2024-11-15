import { useEffect, useState } from "react";
import { LocalStorage } from "@raycast/api";
import { ConfigFile } from "./types";
import { STORAGE_KEY } from "./constants";
import FileList from "./components/FileList";

export default function Command() {
  const [files, setFiles] = useState<ConfigFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const storedFiles = await LocalStorage.getItem<string>(STORAGE_KEY);
      if (storedFiles) {
        setFiles(JSON.parse(storedFiles));
      }
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (updatedFiles: ConfigFile[]) => {
    try {
      await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFiles));
      setFiles(updatedFiles);
    } catch (error) {
      console.error("Error saving files:", error);
    }
  };

  return <FileList files={files} onUpdate={handleUpdate} isLoading={isLoading} />;
} 
