"use client";
import { Button } from "../../../../components/ui/button";
import { useFileStore } from "../../../store/store";
import { open } from "@tauri-apps/plugin-dialog";

export const MiscOutputDirSelector = () => {
  const { outputDirectory, setOutputDirectory } = useFileStore();

  // GETTING SOURCE FILE DIRECTORY
  const openFileExplorerDir = async () => {
    try {
      const directory = await open({
        multiple: false,
        directory: true,
      });
      setOutputDirectory(directory as string);
    } catch (error) {
      console.error("Error opening file explorer", error);
    }
  };
  return (
    <div className="space-y-2">
      <Button onClick={openFileExplorerDir}>Select Output Directory</Button>

      {outputDirectory && (
        <div className="mt-2 text-sm text-gray-600">
          Selected Directory: {outputDirectory}
        </div>
      )}
    </div>
  );
};
