import { Icon } from "@raycast/api";

export const STORAGE_KEY = "config-files";

export const FILE_ICONS = {
  file: Icon.Document,
  directory: Icon.Folder,
} as const;

export const APPLICATIONS = [
  { id: "vscode", name: "Visual Studio Code", command: "code" },
  { id: "terminal", name: "Terminal", requiresCommand: true },
  { id: "sublime", name: "Sublime Text", command: "subl" },
  // Add more default applications as needed
] as const; 
