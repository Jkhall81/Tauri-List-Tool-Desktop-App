"use client";

import { useAppStore } from "../.././../app/store/store";
import { ChunkCSV } from "./ListProcessing/ChunkCSV";
import { ListPIntro } from "./ListProcessing/ListPIntro";

export const ListProcessingTabComponent = () => {
  const { listProcessingTab, activeTab } = useAppStore();
  return (
    <div className="p-4 m-4">
      <ListPIntro activeTab={activeTab} listProcessingTab={listProcessingTab} />
      <ChunkCSV activeTab={activeTab} listProcessingTab={listProcessingTab} />
    </div>
  );
};
