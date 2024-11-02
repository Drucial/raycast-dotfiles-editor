import { Icon } from "@raycast/api";

export enum Application {
  VSCODE = "vscode",
  TERMINAL = "terminal",
  CURSOR = "cursor",
  WARP = "warp",
  KITTY = "kitty"
}

export type ConfigFile = {
  id: string;
  title: string;
  path: string;
  icon: Icon;
  application: Application;
}; 

export interface Settings {
  defaultApplication: Application;
  files: ConfigFile[];
} 

export type AddFileFormProps = {
  onAdd: (file: ConfigFile) => void;
};

export interface EditFileFormProps {
  file: ConfigFile;
  onEdit: (editedFile: ConfigFile) => void;
}
