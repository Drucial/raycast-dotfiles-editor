import { Icon } from "@raycast/api";
import { Application, ConfigFile } from "../types/index";

export const initialFiles: ConfigFile[] = [
  {
    id: "zsh",
    title: "Zsh Config",
    path: "~/.config/zsh/.zshrc",
    icon: Icon.Terminal,
    application: Application.KITTY,
  },
]; 