import { SourceFileSelector } from "../../DNC_Components/SourceFileSelector";
import { DirectorySelector } from "../../DNC_Components/DirectorySelector";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useFileStore } from "../../../../app/store/store";

interface Props {
  activeTab: string;
  miscTab: string;
}

export const Chunking = ({ activeTab, miscTab }: Props) => {
  const [maxLine, setMaxLine] = useState(0);
  const { selectedSourceFile, selectedDirectory } = useFileStore();
  const handleChunk = async () => {
    try {
      const result = await invoke("chunk_txt_handler", {
        inputFile: selectedSourceFile,
        numbersPerFile: maxLine,
        outputDir: selectedDirectory,
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {activeTab === "miscUtilites" && miscTab === "chunking" && (
        <section className="m-4 p-4 flex flex-col gap-y-4">
          <h1 className="text-2xl font-bold">Chunking</h1>
          <p>
            This will chunk text files. This is good to use mostly for uploading
            DNC / FDNC numbers. We usually upload these numbers 50,000 numbers
            at a time.
          </p>
          <p>
            So if you have 300,000 FDNC numbers to upload, you can use this to
            make the upload process more manageable.
          </p>
          <div>
            <label className="text-xl font-semibold" htmlFor="maxlines">
              Lines per Chunk
            </label>
            <Input
              className="mt-2"
              id="maxlines"
              value={maxLine}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMaxLine(+e.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <h2 className="text-xl font-semibold">Select File</h2>
            <p>This is the text file you want chunked.</p>
            <SourceFileSelector />
          </div>
          <div className="flex flex-col gap-y-2">
            <h2 className="text-xl font-semibold">Select Output Directory</h2>
            <p>Select where you want your chunks thrown.</p>
            <DirectorySelector />
          </div>
          <Button
            onClick={handleChunk}
            disabled={!maxLine || !selectedDirectory || !selectedSourceFile}
          >
            Chunk
          </Button>
        </section>
      )}
    </>
  );
};
