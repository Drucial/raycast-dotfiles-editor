import { ActionPanel, Action, Icon, List, showToast, Toast } from "@raycast/api";
import * as child_process from "child_process";
import * as path from "path";

// Define your list of config files with resolved paths
const FILES = [
  { id: "zsh", title: "Zsh Config", path: path.resolve(process.env.HOME || "", ".config/zsh/.zshrc") },
  { id: "nvim", title: "Neovim Config", path: path.resolve(process.env.HOME || "", ".config/nvim") },
  { id: "alias", title: "Aliases Config", path: path.resolve(process.env.HOME || "", ".config/zsh/aliases.zsh") },
  { id: "warp", title: "Warp Theme", path: path.resolve(process.env.HOME || "", ".warp/themes/Celestial.yaml") },
  { id: "gitconfig", title: "Git Config", path: path.resolve(process.env.HOME || "", ".gitconfig") },
  { id: "starship", title: "Starship Config", path: path.resolve(process.env.HOME || "", ".config/starship.toml") },
  { id: "bat", title: "Bat Config", path: path.resolve(process.env.HOME || "", ".config/bat/config") },
  { id: "aero", title: "Aerospace Config", path: path.resolve(process.env.HOME || "", ".config/aerospace/aerospace.toml") },
];

function openFileInDefaultTerminal(filePath: string) {
  showToast({
    style: Toast.Style.Animated,
    title: "Opening in Terminal...",
  });

  const kittyCommand = `/Applications/kitty.app/Contents/MacOS/kitty zsh -l -c 'nvim ${filePath}'`;

  child_process.exec(kittyCommand, (error) => {
    if (error) {
      const terminalCommand = `osascript -e 'tell application "Terminal" to do script "nvim ${filePath}"' -e 'tell application "Terminal" to activate'`;

      child_process.exec(terminalCommand, (terminalError) => {
        if (terminalError) {
          showToast({
            style: Toast.Style.Failure,
            title: "Failed to open file",
            message: terminalError.message,
          });
        } else {
          showToast({
            style: Toast.Style.Success,
            title: "File opened successfully in Terminal",
          });
        }
      });
    } else {
      showToast({
        style: Toast.Style.Success,
        title: "File opened successfully in Kitty",
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
