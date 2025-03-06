"use client";

import { useAppStore } from "../../../store/store";
import { Button } from "../../../../components/ui/button";

export const ListPSidebar = () => {
  const { setListProcessingTab } = useAppStore();
  return (
    <div className="flex flex-col space-y-2">
      <Button onClick={() => setListProcessingTab("csvchunking")}>
        Chunk CSV
      </Button>
    </div>
  );
};
