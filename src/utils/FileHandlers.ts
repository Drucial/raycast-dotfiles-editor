import { showToast, Toast } from "@raycast/api";
import { homedir } from "os";
import path from "path";
import fs from "fs";
import { ConfigFile, Project } from "../types/index";

// Path handling
export function formatPath(inputPath: string): string {
  let formattedPath = inputPath.trim();
  // Handle home directory paths
  const acceptablePathStarts = ["~", "~/", "/~"];
  // Standardize path format
  if (
    !acceptablePathStarts.some((start: string) => formattedPath.startsWith(start)) &&
    !formattedPath.startsWith("/")
  ) {
    formattedPath = `~/${formattedPath}`; // Prepend ~/ if no valid prefix
  }

  // Replace any double slashes (except for protocol://)
  formattedPath = formattedPath.replace(/([^:])\/\//g, "$1/");

  // Remove trailing slashes
  formattedPath = formattedPath.replace(/\/+$/, "");

  // Ensure path starts with either ~ or /
  if (!formattedPath.startsWith("~") && !formattedPath.startsWith("/")) {
    formattedPath = `~/${formattedPath}`;
  }
  return path.resolve(formattedPath);
}

export function expandPath(filePath: string): string {
  return filePath.replace(/^~\//, `${homedir()}/`);
}

// File system handlers
export function exportFiles(files: ConfigFile[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(homedir(), "raycast-config-files.json");
    fs.writeFile(filePath, JSON.stringify(files, null, 2), (err) => {
      if (err) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to export files",
          message: err.message,
        });
        reject(err);
        return;
      }
      showToast({
        style: Toast.Style.Success,
        title: "Files exported successfully",
        message: `Exported to ${filePath}`,
      });
      resolve();
    });
  });
}

export function importFiles(): Promise<ConfigFile[]> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(homedir(), "raycast-config-files.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to import files",
          message: err.message,
        });
        reject(err);
        return;
      }
      try {
        const importedFiles = JSON.parse(data) as ConfigFile[];
        showToast({
          style: Toast.Style.Success,
          title: "Files imported successfully",
        });
        resolve(importedFiles);
      } catch (parseError) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to parse imported files",
          message: parseError instanceof Error ? parseError.message : "Invalid file format",
        });
        reject(parseError);
      }
    });
  });
}

export function exportProjects(projects: Project[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(homedir(), "raycast-config-projects.json");
    fs.writeFile(filePath, JSON.stringify(projects, null, 2), (err) => {
      if (err) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to export projects",
          message: err.message,
        });
      }
    });
  });
}

export function importProjects(): Promise<Project[]> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(homedir(), "raycast-config-projects.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data) as Project[]);
    });
  });
}

export function loadProjects(): Promise<Project[]> {
  return importProjects();
}

export function saveProjects(projects: Project[]): Promise<void> {
  return exportProjects(projects);
}

