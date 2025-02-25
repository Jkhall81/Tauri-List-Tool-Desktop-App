"use client";
import { Button } from "../../components/ui/button";
import { useFileStore } from "../store/store";
import { useAppStore } from "../store/store";
import { invoke } from "@tauri-apps/api/core";

export const CreateDNCFileButton = () => {
  const { selectedSourceFile, selectedDirectory } = useFileStore();
  const { setCreateDNCFileMessage } = useAppStore();

  const handleFinalFile = async () => {
    try {
      await invoke("dnc_file_handler", {
        outputDir: selectedDirectory,
        sourceFile: selectedSourceFile,
      });
      setCreateDNCFileMessage(`DNC file saved at: ${selectedDirectory}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button
        className="w-full"
        onClick={handleFinalFile}
        disabled={!selectedDirectory || !selectedSourceFile}
      >
        Create DNC File
      </Button>
    </div>
  );
};
