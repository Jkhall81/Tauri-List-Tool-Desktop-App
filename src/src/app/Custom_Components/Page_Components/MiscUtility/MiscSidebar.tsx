"use client";

import { useAppStore, useFileStore } from "../../../store/store";
import { Button } from "../../../../components/ui/button";

export const MiscSidebar = () => {
  const { setMiscTab, miscTab } = useAppStore();
  const { setSelectedDirectory, setSelectedSourceFile } = useFileStore();
  console.log(miscTab);
  return (
    <div className="flex flex-col space-y-2">
      <Button onClick={() => setMiscTab("duplicates")}>Duplicates</Button>
      <Button
        onClick={() => {
          setMiscTab("multifileduplicates");
          setSelectedDirectory("");
          setSelectedSourceFile("");
        }}
      >
        MultiFile Duplicates
      </Button>
      <Button
        onClick={() => {
          setMiscTab("chunking");
          setSelectedDirectory("");
          setSelectedSourceFile("");
        }}
      >
        Chunking
      </Button>
      <Button
        onClick={() => {
          setMiscTab("csvtoxlsx");
          setSelectedDirectory("");
          setSelectedSourceFile("");
        }}
      >
        CSV to XLSX
      </Button>
      <Button
        onClick={() => {
          setMiscTab("xlsxtocsv");
          setSelectedDirectory("");
          setSelectedSourceFile("");
        }}
      >
        XLSX to CSV
      </Button>
      <Button
        onClick={() => {
          setMiscTab("formatrowsasstring");
          setSelectedDirectory("");
          setSelectedSourceFile("");
        }}
      >
        Format Rows as String
      </Button>
    </div>
  );
};
