"use client";

interface Props {
  buttonText: string;
}

import { Button } from "../../../../components/ui/button";
import { useFileStore } from "../../../store/store";
import { open } from "@tauri-apps/plugin-dialog";

export const ListPFileSelector = ({ buttonText }: Props) => {
  const { chunkFile, setChunkFile } = useFileStore();

  // GETTING SOURCE FILE
  const openFileExplorerSrcFile = async () => {
    try {
      const selectedFile = await open({
        multiple: false,
        directory: false,
      });
      if (selectedFile) setChunkFile(selectedFile as string);
    } catch (error) {
      console.error("Error opening file explorer", error);
    }
  };
  return (
    <div className="space-y-2">
      <Button onClick={openFileExplorerSrcFile}>{buttonText}</Button>

      {chunkFile && (
        <div className="mt-2 text-sm text-gray-600">{chunkFile}</div>
      )}
    </div>
  );
};
