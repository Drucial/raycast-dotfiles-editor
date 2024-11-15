export type FileType = 'file' | 'directory';

export interface ConfigFile {
  id: string;
  name: string;
  path: string;
  type: FileType;
  application: string;
  command?: string;
}

export interface FormValues {
  path: string[];
  name: string;
  application: string;
  command?: string;
} 
