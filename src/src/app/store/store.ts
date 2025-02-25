import { create } from "zustand";

type AppState = {
  // DYNAMICALLY SHOW STUFF ON PAGE BASED ON ACTIVE TAB
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // EMAIL REPORT
  emailReport: string | null;
  setEmailReport: (report: string | null) => void;

  abbr: string;
  color: string;
  setAbbr: (abbr: string) => void;
  setColor: (color: string) => void;

  // MIGHT USE THIS LATER
  displayedComponent: React.ReactNode | null;
  setDisplayedComponent: (component: React.ReactNode | null) => void;
};

type FileStore = {
  selectedSourceFile: string | null;
  setSelectedSourceFile: (filePath: string | null) => void;
  selectedDirectory: string | null;
  setSelectedDirectory: (dirPath: string | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  // DYNAMICALLY SHOW STUFF ON PAGE BASED ON ACTIVE TAB
  activeTab: "listProcessing",
  setActiveTab: (tab) => set({ activeTab: tab }),

  // EMAIL REPORT
  emailReport: null,
  setEmailReport: (report) => set({ emailReport: report }),

  abbr: "",
  color: "",
  setAbbr: (abbr) => set({ abbr }),
  setColor: (color) => set({ color }),

  // MIGHT USE THIS LATER
  displayedComponent: null,
  setDisplayedComponent: (component) => set({ displayedComponent: component }),
}));

export const useFileStore = create<FileStore>((set) => ({
  selectedSourceFile: null,
  setSelectedSourceFile: (filePath) => set({ selectedSourceFile: filePath }),
  selectedDirectory: null,
  setSelectedDirectory: (dirPath) => set({ selectedDirectory: dirPath }),
}));
