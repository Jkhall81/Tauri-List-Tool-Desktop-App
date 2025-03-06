"use client";

import { Button } from "../../../../components/ui/button";
import { MiscFileSelector } from "./MiscFileSelector";
import { MiscOutputDirSelector } from "./MiscOutputDirSelector";
import { useFileStore } from "@/app/store/store";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface Props {
  activeTab: string;
  miscTab: string;
}

export const Duplicates = ({ activeTab, miscTab }: Props) => {
  const { duplicateFiles, outputDirectory } = useFileStore();
  const [createDuplicateMessage, setCreateDuplicateMessage] = useState("");
  const [duplicateCount, setDuplicateCount] = useState("");
  const [fileOneCount, setFileOneCount] = useState("");
  const [fileTwoCount, setFileTwoCount] = useState("");

  const handleDuplicates = async () => {
    try {
      const result = (await invoke("duplicates_handler", {
        inputFile1: duplicateFiles.fileA,
        inputFile2: duplicateFiles.fileB,
        outputFile: `${outputDirectory}\\duplicates.csv`,
      })) as string;
      setCreateDuplicateMessage(
        `Duplicate file saved at: ${outputDirectory}\\duplicates.csv`
      );

      const jsonResult = JSON.parse(result);
      setDuplicateCount(jsonResult.duplicate_count);
      setFileOneCount(jsonResult.count_one);
      setFileTwoCount(jsonResult.count_two);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {activeTab === "miscUtilites" && miscTab === "duplicates" && (
        <section className="m-4 p-4 space-y-4">
          <h1 className="font-bold text-2xl">Duplicates</h1>
          <p className="">
            Select File A and then File B. The script will check how many
            numbers from File A are present in File B. The number of duplicates
            will be displayed below.
          </p>
          <p>
            Select an output directory and a list of the duplicate numbers,
            duplicates.csv, will be generated.
          </p>
          <p>
            This script assumes your files have no headers, and will start
            reading from line one.
          </p>
          <div className="space-y-2">
            <h2 className="font-bold">File A</h2>
            <MiscFileSelector
              buttonText="Select File A"
              fileType="File A"
              fileKey="fileA"
            />
          </div>
          <div className="space-y-2">
            <h2 className="font-bold">File B</h2>
            <MiscFileSelector
              buttonText="Select File B"
              fileType="File B"
              fileKey="fileB"
            />
          </div>
          <div className="space-y-2">
            <h2 className="font-bold">Select Output Directory</h2>
            <MiscOutputDirSelector />
          </div>
          <Button
            className=""
            onClick={handleDuplicates}
            disabled={
              !duplicateFiles.fileA || !duplicateFiles.fileB || !outputDirectory
            }
            variant="outline"
          >
            Find Duplicates
          </Button>
          <div className="flex flex-col space-y-4">
            <span>{createDuplicateMessage}</span>
            <span>Total Duplicates: {duplicateCount}</span>
            <span>Total Numbers in File One: {fileOneCount}</span>
            <span>Total Numbers in File Two: {fileTwoCount}</span>
          </div>
        </section>
      )}
    </>
  );
};
