"use client";
import { Button } from "../../../components/ui/button";
import { useFileStore } from "../../store/store";
import { useAppStore } from "../../store/store";
import { invoke } from "@tauri-apps/api/core";

export const CreateFinalFileButton = () => {
  const { selectedSourceFile, selectedDirectory } = useFileStore();
  const { setCreateFinalFileMessage } = useAppStore();

  const handleFinalFile = async () => {
    try {
      await invoke("final_file_handler", {
        outputDir: selectedDirectory,
        sourceFile: selectedSourceFile,
      });
      setCreateFinalFileMessage(`Final file saved at: ${selectedDirectory}`);
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
        Create Final File
      </Button>
    </div>
  );
};
