"use client";

import { useAppStore } from "../../../store/store";
import { Button } from "../../../../components/ui/button";

export const MiscSidebar = () => {
  const { setMiscTab, miscTab } = useAppStore();
  console.log(miscTab);
  return (
    <div className="flex flex-col space-y-2">
      <Button onClick={() => setMiscTab("duplicates")}>Duplicates</Button>
      <Button onClick={() => setMiscTab("multifileduplicates")}>
        MultiFile Duplicates
      </Button>
      <Button onClick={() => setMiscTab("chunking")}>Chunking</Button>
      <Button onClick={() => setMiscTab("csvtoxlsx")}>CSV to XLSX</Button>
      <Button onClick={() => setMiscTab("xlsxtocsv")}>XLSX to CSV</Button>
      <Button onClick={() => setMiscTab("formatrowsasstring")}>
        Format Rows as String
      </Button>
    </div>
  );
};
