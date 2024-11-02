import { LocalStorage, showToast, Toast } from "@raycast/api";
import * as child_process from "child_process";
import { expandPath } from "./fileHandlers";

export function setDefaultApplication(application: string) {
  LocalStorage.setItem("defaultApplication", application);
};

export function getDefaultApplication() {
  return LocalStorage.getItem("defaultApplication") || "vscode";
}

// Terminal handlers
export function openFileInDefaultTerminal(filePath: string) {
  showToast({
    style: Toast.Style.Animated,
    title: "Opening in Terminal...",
  });

  const expandedFilePath = expandPath(filePath);
  const terminalCommand = `osascript -e 'tell application "Terminal" to do script "export USER=$(whoami); nvim ${expandedFilePath}"' -e 'tell application "Terminal" to activate'`;

  child_process.exec(terminalCommand, (error) => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to open file in Terminal",
        message: error.message,
      });
    } else {
      showToast({
        style: Toast.Style.Success,
        title: "File opened successfully in Terminal",
      });
    }
  });
}

export function openFileInKitty(filePath: string) {
  showToast({
    style: Toast.Style.Animated,
    title: "Opening in Kitty...",
  });

  const expandedFilePath = expandPath(filePath);
  const kittyCommand = `/Applications/kitty.app/Contents/MacOS/kitty zsh -l -c 'export USER=$(whoami); nvim ${expandedFilePath}'`;

  child_process.exec(kittyCommand, (error) => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to open file in Kitty",
        message: error.message,
      });
    } else {
      showToast({
        style: Toast.Style.Success,
        title: "File opened successfully in Kitty",
      });
    }
  });
}

export function openFileInWarp(filePath: string) {
  showToast({
    style: Toast.Style.Animated,
    title: "Opening in Warp...",
  });

  const expandedFilePath = expandPath(filePath);
  const warpCommand = `
  osascript -e '
  if application "Warp" is not running then
    tell application "Warp" to launch
    delay 1
  else
    tell application "System Events"
      set frontmost of process "Warp" to true
      delay 0.5
      keystroke "t" using {command down}
      delay 0.5
    end tell
  end if
  tell application "System Events" to keystroke "export USER=$(whoami); nvim ${expandedFilePath}" & return'
  `;

  child_process.exec(warpCommand, (error) => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to open file in Warp",
        message: error.message,
      });
    } else {
      showToast({
        style: Toast.Style.Success,
        title: "File opened successfully in Warp",
      });
    }
  });
}

// Editor handlers
export function openFileInVscode(filePath: string) {
  showToast({
    style: Toast.Style.Animated,
    title: "Opening in VSCode...",
  });

  const expandedFilePath = expandPath(filePath);
  const vscodeCommand = `open -a "Visual Studio Code" "${expandedFilePath}"`;

  child_process.exec(vscodeCommand, (error) => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to open file in VSCode",
        message: error.message,
      });
    } else {
      showToast({
        style: Toast.Style.Success,
        title: "File opened successfully in VSCode",
      });
    }
  });
}

export function openFileInCursor(filePath: string) {
  showToast({
    style: Toast.Style.Animated,
    title: "Opening in Cursor...",
  });

  const expandedFilePath = expandPath(filePath);
  const cursorCommand = `cursor "${expandedFilePath}"`;

  child_process.exec(cursorCommand, (error) => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to open file in Cursor",
        message: error.message,
      });
    } else {
      showToast({
        style: Toast.Style.Success,
        title: "File opened successfully in Cursor",
      });
    }
  });
}