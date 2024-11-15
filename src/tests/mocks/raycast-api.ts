export const Icon = {
  Document: "document-icon",
  Folder: "folder-icon",
  Plus: "plus-icon",
  Trash: "trash-icon",
  Download: "download-icon",
  Upload: "upload-icon",
  Pencil: "pencil-icon",
  ArrowRight: "arrow-right-icon",
};

export const Toast = {
  Style: {
    Success: "success",
    Failure: "failure",
    Animated: "animated",
  },
};

export const showToast = jest.fn();
export const confirmAlert = jest.fn();
export const getPreferenceValues = jest.fn();
export const useNavigation = jest.fn(() => ({
  push: jest.fn(),
  pop: jest.fn(),
})); 
