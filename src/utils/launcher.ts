import { exec } from "child_process";
import { promisify } from "util";
import { showToast, Toast } from "@raycast/api";
import { ConfigFile } from "../types";
import { getApplications } from "../constants";

const execAsync = promisify(exec);

export async function launchApplication(file: ConfigFile): Promise<void> {
  const applications = getApplications();
  const application = applications.find((app) => app.id === file.application);
  
  if (!application) {
    throw new Error("Application not found");
  }

  await showToast(Toast.Style.Animated, `Opening in ${application.name}...`);

  try {
    if (application.requiresCommand) {
      if (!file.command) {
        throw new Error("Terminal command is required");
      }

      switch (application.id) {
        case "kitty":
          await execAsync(`/Applications/kitty.app/Contents/MacOS/kitty --single-instance --instance-group=raycast zsh -l -c 'export USER=$(whoami); ${file.command} "${file.path}"'`);
          break;
        
        case "warp":
          await execAsync(`open -n -a Warp && sleep 1 && osascript -e '
            tell application "Warp"
              activate
            end tell
            delay 0
            tell application "System Events"
              keystroke "export USER=$(whoami); ${file.command} ${file.path}"
              keystroke return
            end tell
          '`);
          break;
        
        case "terminal":
          await execAsync(`osascript -e '
            if application "Terminal" is running then
              tell application "Terminal"
                do script "export USER=$(whoami); ${file.command} \\"${file.path}\\""
                activate
              end tell
            else
              tell application "Terminal"
                activate
                delay 1
                do script "export USER=$(whoami); ${file.command} \\"${file.path}\\""
              end tell
            end if
          '`);
          break;
        
        default:
          throw new Error(`Terminal ${application.name} is not properly configured`);
      }
    } else {
      switch (application.id) {
        case "vscode":
          await execAsync(`open -a "Visual Studio Code" "${file.path}"`);
          break;

        case "cursor":
          await execAsync(`cursor "${file.path}"`);
          break;

        case "sublime":
          await execAsync(`open -a "Sublime Text" "${file.path}"`);
          break;

        default:
          if (!application.command) {
            throw new Error("Application command not configured");
          }
          await execAsync(`${application.command} "${file.path}"`);
      }
    }

    await showToast(Toast.Style.Success, `File opened successfully in ${application.name}`);
  } catch (error) {
    await showToast(Toast.Style.Failure, `Failed to open in ${application.name}`, String(error));
    throw error;
  }
} 
