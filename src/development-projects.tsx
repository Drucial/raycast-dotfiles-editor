import { ActionPanel, Action, Icon, List } from "@raycast/api";
import { useState, useEffect } from "react";
import { Project } from "./types";
import {
  openFileInDefaultTerminal,
  openFileInKitty,
  openFileInWarp,
  openFileInVscode,
  openFileInCursor,
} from "./utils/ApplicationHandlers";
import { loadProjects, saveProjects } from "./utils/FileHandlers";
import { AddProjectForm } from "./components/AddProjectForm";
import { EditProjectForm } from "./components/EditProjectForm";

export default function Command() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortedProjects, setSortedProjects] = useState<Project[]>([]);

  // Load projects on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const loadedProjects = await loadProjects();
        setProjects(loadedProjects);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, []);

  // Save projects when they change
  useEffect(() => {
    if (projects?.length > 0) {
      saveProjects(projects);
    }
  }, [projects]);

  // Sort projects by title
  useEffect(() => {
    setSortedProjects(projects.sort((a, b) => a.title.localeCompare(b.title)));
  }, [projects]);

  const handleAddProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  const handleEditProject = (editedProject: Project) => {
    setProjects((prev) => 
      prev.map((project) => (project.id === editedProject.id ? editedProject : project))
    );
  };

  const handleRemoveProject = (projectId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

  return (
    <List isLoading={isLoading}>
      {sortedProjects.map((project) => (
        <List.Item
          key={project.id}
          icon={project.icon}
          title={project.title}
          subtitle={project.path}
          actions={
            <ActionPanel>
              <ActionPanel.Section title="Open Project">
                <Action
                  icon={project.icon}
                  title={`Open in ${project.application}`}
                  onAction={() => {
                    // First open Kitty terminal at project location
                    openFileInKitty(project.path);
                    
                    // Then open in selected application
                    switch (project.application) {
                      case "kitty":
                        // Already opened in kitty so launch another instance
                        openFileInKitty(project.path);
                        break;
                      case "warp":
                        openFileInWarp(project.path);
                        break;
                      case "vscode":
                        openFileInVscode(project.path);
                        break;
                      case "cursor":
                        openFileInCursor(project.path);
                        break;
                      default:
                        openFileInDefaultTerminal(project.path);
                    }
                  }}
                />
              </ActionPanel.Section>

              <ActionPanel.Section title="Manage">
                <Action.Push
                  icon={Icon.Pencil}
                  title="Edit Project"
                  target={<EditProjectForm project={project} onEdit={handleEditProject} />}
                />
                <Action
                  icon={Icon.Trash}
                  title="Remove Project"
                  onAction={() => handleRemoveProject(project.id)}
                  style={Action.Style.Destructive}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}

      <List.Item
        icon={Icon.Plus}
        title="Add New Project"
        actions={
          <ActionPanel>
            <Action.Push
              icon={Icon.Plus}
              title="Add New Project"
              target={<AddProjectForm onSubmit={handleAddProject} />}
            />
          </ActionPanel>
        }
      />
    </List>
  );
} 