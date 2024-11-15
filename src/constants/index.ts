import { Icon, getPreferenceValues } from "@raycast/api";

export const STORAGE_KEY = "config-files";

export const FILE_ICONS = {
  file: Icon.Document,
  directory: Icon.Folder,
} as const;

interface Preferences {
  applications: string;
}

export interface Application {
  id: string;
  name: string;
  command?: string;
  requiresCommand?: boolean;
}

export function getApplications(): Application[] {
  const preferences = getPreferenceValues<Preferences>();
  try {
    return JSON.parse(preferences.applications);
  } catch (error) {
    // Return default applications if preference parsing fails
    return [
      { id: "vscode", name: "Visual Studio Code", command: "code" },
      { id: "terminal", name: "Terminal", requiresCommand: true },
      { id: "sublime", name: "Sublime Text", command: "subl" },
      { id: "cursor", name: "Cursor", command: "cursor" },
      { id: "warp", name: "Warp", requiresCommand: true },
      { id: "kitty", name: "Kitty", requiresCommand: true }
    ];
  }
} 
