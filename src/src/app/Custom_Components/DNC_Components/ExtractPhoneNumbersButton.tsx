"use client";
import { Button } from "../../../components/ui/button";
import { useFileStore } from "../../store/store";
import { invoke } from "@tauri-apps/api/core";
import { useAppStore } from "../../store/store";

export const ExtractPhoneNumbersButton = () => {
  const { selectedSourceFile, selectedDirectory } = useFileStore();
  const { setBlaUploadMessage } = useAppStore();

  const handleExtractNumbers = async () => {
    if (!selectedSourceFile || !selectedDirectory) {
      console.error("Source file or directory not selected");
      return;
    }

    try {
      const result: string = await invoke("extract_numbers_from_file", {
        filePath: selectedSourceFile,
        outputDir: selectedDirectory, // Pass the directory to Rust
      });
      setBlaUploadMessage(`BLA uploadfile extracted to: ${result}`);
      console.log("Extracted file saved at:", result);
    } catch (error) {
      console.error("Error extracting phone numbers:", error);
    }
  };

  return (
    <div>
      <Button
        className="w-full"
        onClick={handleExtractNumbers}
        disabled={!selectedSourceFile || !selectedDirectory}
      >
        Create BLA Upload File
      </Button>
    </div>
  );
};
