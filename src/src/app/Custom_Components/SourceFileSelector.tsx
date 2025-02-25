"use client";
import { Button } from "@/components/ui/button";
import { useFileStore } from "../store/store";
import { open } from "@tauri-apps/plugin-dialog";

export const SourceFileSelector = () => {
  const { selectedSourceFile, setSelectedSourceFile } = useFileStore();

  // GETTING SOURCE FILE
  const openFileExplorerSrcFile = async () => {
    try {
      const srcFile = await open({
        multiple: false,
        directory: false,
      });
      setSelectedSourceFile(srcFile as string);
    } catch (error) {
      console.error("Error opening file exploere", error);
    }
  };
  return (
    <div className="space-y-2">
      <Button onClick={openFileExplorerSrcFile}>Select Source File</Button>

      {selectedSourceFile && (
        <div className="mt-2 text-sm text-gray-600">
          Source File: {selectedSourceFile}
        </div>
      )}
    </div>
  );
};
