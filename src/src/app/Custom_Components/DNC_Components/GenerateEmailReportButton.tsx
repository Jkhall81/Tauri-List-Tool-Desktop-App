"use client";
import { Button } from "../../../components/ui/button";
import { useFileStore, useAppStore } from "../../store/store";
import { invoke } from "@tauri-apps/api/core";

export const GenerateEmailReportButton = () => {
  const { selectedSourceFile, selectedDirectory } = useFileStore();
  const { color, abbr, setEmailReport } = useAppStore();

  const handleEmailReport = async () => {
    try {
      const result: string = await invoke("email_report_handler", {
        outputDir: selectedDirectory,
        sourceFile: selectedSourceFile,
        color,
        abbr,
      });
      setEmailReport(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button
        className="w-full"
        onClick={handleEmailReport}
        disabled={!selectedSourceFile || !color || !abbr}
      >
        Create Email Report
      </Button>
    </div>
  );
};
