import { ActionPanel, Action, Icon, List, showToast, Toast } from "@raycast/api";
import * as child_process from "child_process";

// Define your list of config files
const FILES = [
  { id: "zsh", title: "Zsh Config", path: "~/.config/zsh/.zshrc" },
  { id: "nvim", title: "Neovim Config", path: "~/.config/nvim" },
  { id: "alias", title: "Aliases Config", path: "~/.config/zsh/aliases.zsh" },
  { id: "warp", title: "Warp Theme", path: "~/.warp/themes/Celestial.yaml" },
  { id: "gitconfig", title: "Git Config", path: "~/.gitconfig" },
  { id: "starship", title: "Starship Config", path: "~/.config/starship.toml" },
  { id: "bat", title: "Bat Config", path: "~/.config/bat/config" },
  { id: "aero", title: "Aerospace Config", path: "~/.config/aerospace/aerospace.toml" },
];

function openFileInDefaultTerminal(filePath: string) {
  showToast({
    style: Toast.Style.Animated,
    title: "Opening in Default Terminal...",
  });

  const command = `osascript -e 'tell application "Terminal" to do script "nvim ${filePath}"' &`;
  child_process.exec(command, (error) => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to open file",
        message: error.message,
      });
    }
  });
}

export default function Command() {
  return (
    <List>
      {FILES.map((file) => (
        <List.Item
          key={file.id}
          icon={Icon.Terminal}
          title={file.title}
          actions={
            <ActionPanel>
              <Action
                icon={Icon.Terminal}
                title="Open in Default Terminal"
                onAction={() => openFileInDefaultTerminal(file.path)}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
