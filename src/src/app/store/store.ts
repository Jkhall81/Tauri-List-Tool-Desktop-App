import { create } from "zustand";

type AppState = {
  // DYNAMICALLY SHOW STUFF ON PAGE BASED ON ACTIVE TAB
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // DYNAMICALLY SHOW STUFF ON MISC UTILITY PAGE BASED ON BUTTONS
  miscTab: string;
  setMiscTab: (tab: string) => void;

  // EMAIL REPORT
  emailReport: string | null;
  setEmailReport: (report: string | null) => void;

  abbr: string;
  color: string;
  setAbbr: (abbr: string) => void;
  setColor: (color: string) => void;

  // BUTTON MESSAGES
  blaUploadMessage: string;
  createFinalFileMessage: string;
  createDNCFileMessage: string;
  setBlaUploadMessage: (blaUploadMessage: string) => void;
  setCreateFinalFileMessage: (createFinalFileMessage: string) => void;
  setCreateDNCFileMessage: (createDNCFileMessage: string) => void;

  // MIGHT USE THIS LATER
  displayedComponent: React.ReactNode | null;
  setDisplayedComponent: (component: React.ReactNode | null) => void;
};

type FileStore = {
  selectedSourceFile: string | null;
  setSelectedSourceFile: (filePath: string | null) => void;

  selectedDirectory: string | null;
  setSelectedDirectory: (dirPath: string | null) => void;

  outputDirectory: string | null;
  setOutputDirectory: (dirPath: string | null) => void;

  duplicateFiles: {
    fileA?: string;
    fileB?: string;
  };
  setDuplicateFile: (key: "fileA" | "fileB", file: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  // DYNAMICALLY SHOW STUFF ON PAGE BASED ON ACTIVE TAB
  activeTab: "listProcessing",
  setActiveTab: (tab) => set({ activeTab: tab }),

  // DYNAMICALLY SHOW STUFF ON MISC UTILITY PAGE BASED ON BUTTONS
  miscTab: "",
  setMiscTab: (tab) => set({ miscTab: tab }),

  // EMAIL REPORT
  emailReport: null,
  setEmailReport: (report) => set({ emailReport: report }),

  abbr: "",
  color: "",
  setAbbr: (abbr) => set({ abbr }),
  setColor: (color) => set({ color }),

  // BUTTON
  blaUploadMessage: "",
  createFinalFileMessage: "",
  createDNCFileMessage: "",
  setBlaUploadMessage: (uploadMessage) =>
    set({ blaUploadMessage: uploadMessage }),
  setCreateFinalFileMessage: (message) =>
    set({ createFinalFileMessage: message }),
  setCreateDNCFileMessage: (message) => set({ createDNCFileMessage: message }),

  // MIGHT USE THIS LATER
  displayedComponent: null,
  setDisplayedComponent: (component) => set({ displayedComponent: component }),
}));

export const useFileStore = create<FileStore>((set) => ({
  selectedSourceFile: null,
  setSelectedSourceFile: (filePath) => set({ selectedSourceFile: filePath }),

  selectedDirectory: null,
  setSelectedDirectory: (dirPath) => set({ selectedDirectory: dirPath }),

  outputDirectory: null,
  setOutputDirectory: (dirPath) => set({ outputDirectory: dirPath }),

  duplicateFiles: {},
  setDuplicateFile: (key, file) =>
    set((state) => ({
      duplicateFiles: { ...state.duplicateFiles, [key]: file },
    })),
}));
