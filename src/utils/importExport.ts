import fs from "fs";
import { showToast, Toast, showSaveDialog, showOpenDialog } from "@raycast/api";
import { ConfigFile } from "../types";

export async function exportToJson(files: ConfigFile[]): Promise<void> {
  try {
    const options = {
      defaultName: "dotfile-manager-config.json",
      allowedFileTypes: ["json"],
    };

    const path = await showSaveDialog(options);
    
    if (path) {
      const jsonContent = JSON.stringify(files, null, 2);
      await fs.promises.writeFile(path, jsonContent, "utf-8");
      await showToast(Toast.Style.Success, "Configuration exported successfully");
    }
  } catch (error) {
    await showToast(Toast.Style.Failure, "Failed to export configuration", String(error));
    throw error;
  }
}

export async function importFromJson(): Promise<ConfigFile[]> {
  try {
    const options = {
      allowMultipleSelection: false,
      allowedFileTypes: ["json"],
    };

    const paths = await showOpenDialog(options);
    
    if (paths && paths.length > 0) {
      const content = await fs.promises.readFile(paths[0], "utf-8");
      const importedFiles = JSON.parse(content) as ConfigFile[];
      
      // Validate imported data
      if (!Array.isArray(importedFiles)) {
        throw new Error("Invalid file format: expected an array");
      }

      for (const file of importedFiles) {
        if (!file.id || !file.name || !file.path || !file.type || !file.application) {
          throw new Error("Invalid file format: missing required fields");
        }
        
        // Verify file/directory exists
        await fs.promises.access(file.path);
      }

      await showToast(Toast.Style.Success, "Configuration imported successfully");
      return importedFiles;
    }
    return [];
  } catch (error) {
    await showToast(Toast.Style.Failure, "Failed to import configuration", String(error));
    throw error;
  }
} 
