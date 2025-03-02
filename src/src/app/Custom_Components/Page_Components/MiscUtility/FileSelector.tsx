"use client";

interface Props {
  buttonText: string;
  fileType: string;
  fileKey: "fileA" | "fileB";
}

import { Button } from "../../../../components/ui/button";
import { useFileStore } from "../../../store/store";
import { open } from "@tauri-apps/plugin-dialog";

export const FileSelector = ({ buttonText, fileType, fileKey }: Props) => {
  const { duplicateFiles, setDuplicateFile } = useFileStore();

  // GETTING SOURCE FILE
  const openFileExplorerSrcFile = async () => {
    try {
      const selectedFile = await open({
        multiple: false,
        directory: false,
      });
      if (selectedFile) setDuplicateFile(fileKey, selectedFile as string);
    } catch (error) {
      console.error("Error opening file exploere", error);
    }
  };
  return (
    <div className="space-y-2">
      <Button onClick={openFileExplorerSrcFile}>{buttonText}</Button>

      {duplicateFiles && (
        <div className="mt-2 text-sm text-gray-600">
          {fileType}: {duplicateFiles[fileKey]}
        </div>
      )}
    </div>
  );
};
