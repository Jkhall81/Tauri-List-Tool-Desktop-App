"use client";

import { useAppStore } from "../../../app/store/store";
import { MiscIntro } from "./MiscUtility/MiscIntro";
import { Duplicates } from "./MiscUtility/Duplicates";
import { MultiFileDuplicates } from "./MiscUtility/MultiFileDuplicates";
import { Chunking } from "./MiscUtility/Chunking";
import { CsvToXlsx } from "./MiscUtility/CsvToXlsx";
import { XlsxToCsv } from "./MiscUtility/XlsxToCsv";
import { FormatAsString } from "./MiscUtility/FormatAsString";

export const MiscUtilityActiveTabComponent = () => {
  const { activeTab, miscTab } = useAppStore();
  return (
    <>
      <MiscIntro activeTab={activeTab} miscTab={miscTab} />
      <Duplicates activeTab={activeTab} miscTab={miscTab} />
      <MultiFileDuplicates activeTab={activeTab} miscTab={miscTab} />
      <Chunking activeTab={activeTab} miscTab={miscTab} />
      <CsvToXlsx activeTab={activeTab} miscTab={miscTab} />
      <XlsxToCsv activeTab={activeTab} miscTab={miscTab} />
      <FormatAsString activeTab={activeTab} miscTab={miscTab} />
    </>
  );
};
