"use client";
import { Button } from "@/components/ui/button";
import { useFileStore } from "../store/store";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export const CreateDNCFileButton = () => {
  const { selectedSourceFile, selectedDirectory } = useFileStore();
  const [dncFile, setDncFile] = useState<boolean | null>(null);

  const handleFinalFile = async () => {
    try {
      const result: string = await invoke("dnc_file_handler", {
        outputDir: selectedDirectory,
        sourceFile: selectedSourceFile,
      });
      setDncFile(true);
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

      {dncFile && (
        <div className="mt-2 text-sm text-gray-600">
          {`DNC file saved at: ${selectedDirectory}`}
        </div>
      )}
    </div>
  );
};
