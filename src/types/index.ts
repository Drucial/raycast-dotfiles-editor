import { Icon } from "@raycast/api";

export enum Application {
  VSCODE = "vscode",
  TERMINAL = "terminal",
  CURSOR = "cursor",
  WARP = "warp",
  KITTY = "kitty",
}

export interface ConfigFile {
  id: string;
  title: string;
  path: string;
  application: Application;
  icon: Icon;
}

export const ApplicationIcons: Record<Application, Icon> = {
  [Application.VSCODE]: Icon.Code,
  [Application.TERMINAL]: Icon.Terminal,
  [Application.CURSOR]: Icon.CodeBlock,
  [Application.WARP]: Icon.Terminal,
  [Application.KITTY]: Icon.Terminal,
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
