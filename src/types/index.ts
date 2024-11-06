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

export interface Project {
  id: string;
  title: string;
  path: string;
  application: Application;
  icon: Icon;
}

export interface AddProjectFormProps {
  project?: Project;
  onSubmit: (project: Project) => void;
}

export interface EditProjectFormProps {
  project: Project;
  onEdit: (project: Project) => void;
}

export const ProjectIcons = {
  FOLDER: Icon.Folder,
  CODE: Icon.Code,
  TERMINAL: Icon.Terminal,
  WEB: Icon.Globe,
  MOBILE: Icon.Mobile,
  DATABASE: Icon.Dna,
  DOCUMENT: Icon.Document,
  GEAR: Icon.Gear,
} as const;

export type ProjectIcon = typeof ProjectIcons[keyof typeof ProjectIcons];
