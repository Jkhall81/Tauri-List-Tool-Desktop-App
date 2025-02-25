"use client";
import { Button } from "@/components/ui/button";
import { useFileStore } from "../store/store";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export const CreateFinalFileButton = () => {
  const { selectedSourceFile, selectedDirectory } = useFileStore();
  const [finalFile, setFinalFile] = useState<boolean | null>(null);

  const handleFinalFile = async () => {
    try {
      const result: string = await invoke("final_file_handler", {
        outputDir: selectedDirectory,
        sourceFile: selectedSourceFile,
      });
      setFinalFile(true);
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

      {finalFile && (
        <div className="mt-2 text-sm text-gray-600">
          {`Final file saved at: ${selectedDirectory}`}
        </div>
      )}
    </div>
  );
};
