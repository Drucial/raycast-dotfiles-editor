import { exec } from "child_process";
import { promisify } from "util";
import { ConfigFile } from "../types";
import { APPLICATIONS } from "../constants";

const execAsync = promisify(exec);

export async function launchApplication(file: ConfigFile): Promise<void> {
  const application = APPLICATIONS.find((app) => app.id === file.application);
  
  if (!application) {
    throw new Error("Application not found");
  }

  if (application.id === "terminal") {
    if (!file.command) {
      throw new Error("Terminal command is required");
    }
    
    await execAsync(`open -a Terminal.app && osascript -e 'tell application "Terminal" to do script "${file.command} ${file.path}"'`);
  } else {
    await execAsync(`${application.command} "${file.path}"`);
  }
} 
