import { LocalStorage } from "@raycast/api";
import { Application, ConfigFile, Settings } from "../types/index";
import { initialFiles } from "../constants";

export async function loadFiles(): Promise<ConfigFile[]> {
  try {
    const storedFiles = await LocalStorage.getItem<string>("config-files");
    if (storedFiles) {
      return JSON.parse(storedFiles);
    }
    return initialFiles;
  } catch (error) {
    console.error("Failed to load files from storage:", error);
    return initialFiles;
  }
}

export async function saveFiles(files: ConfigFile[]): Promise<void> {
  try {
    await LocalStorage.setItem("config-files", JSON.stringify(files));
  } catch (error) {
    console.error("Failed to save files to storage:", error);
  }
} 

export async function getSettings(): Promise<Settings> {
  const settings = await LocalStorage.getItem<string>("settings");
  return settings ? JSON.parse(settings) : defaultSettings;
}

export async function saveSettings(settings: Settings): Promise<void> {
  await LocalStorage.setItem("settings", JSON.stringify(settings));
}

const defaultSettings: Settings = {
  defaultApplication: Application.VSCODE,
  files: initialFiles,
};