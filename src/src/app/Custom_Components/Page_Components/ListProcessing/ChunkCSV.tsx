import { useState } from "react";
import { ListPFileSelector } from "./ListPFileSelector";
import { ListPOutputDirSelector } from "./ListPOutputDirSelector";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { useFileStore } from "../../../../app/store/store";

interface ChunkCSVProps {
  activeTab: string;
  listProcessingTab: string;
}

export const ChunkCSV = ({ activeTab, listProcessingTab }: ChunkCSVProps) => {
  const [maxLine, setMaxLine] = useState(0);
  const [chunkStart, setChunkStart] = useState(1);
  const { chunkFile, outputDirectory } = useFileStore();
  const [outputMessage, setOutputMessage] = useState("");

  const marginSpace = "mt-4";

  const handleChunk = async () => {
    try {
      const result = (await invoke("chunk_csv_handler", {
        inputFile: chunkFile,
        outputFolder: outputDirectory,
        maxLine,
        startChunkNumber: chunkStart,
      })) as string;
      console.log(result);
      setOutputMessage(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {activeTab === "listProcessing" &&
        listProcessingTab === "csvchunking" && (
          <section className="p-4 m-4 gap-y-2 flex flex-col">
            <div className="">
              <h1 className="font-bold text-2xl">Chunk CSV</h1>
              <p className={marginSpace}>
                This will take a list in CSV format and break it into chunks.
                Chunk size is determined by the max number of lines you want per
                chunk. Note, we usually want list size to be no bigger than
                30,000 lines.
              </p>
              <p className={marginSpace}>
                Each Chunk will have a header. Chunks will be written into a
                newly created within the directory that you select.
              </p>
              <p className={marginSpace}>
                If you do not select a Chunk Sequence Start Number then it will
                default to 1. If you are chunking multiple files you can
                manually input a chunk start number.
              </p>
              <p className={marginSpace}>
                So, for example, if your first file chunked out 17 files, when
                chunking your second file set a chunk sequence start number of
                18.
              </p>
            </div>
            <div className={marginSpace}>
              <ListPFileSelector buttonText="Select Source File" />
            </div>
            <div className={marginSpace}>
              <ListPOutputDirSelector />
            </div>
            <div className={marginSpace}>
              <label className="font-semibold" htmlFor="maxLine">
                Max Lines
              </label>
              <Input
                className="mt-4 border-black max-w-[150px]"
                id="maxLine"
                value={maxLine}
                onChange={(e) => setMaxLine(+e.target.value)}
                type="number"
                required
              />
            </div>
            <div className={marginSpace}>
              <label htmlFor="chunkNumber">Chunk Sequence Start Number</label>
              <Input
                id="chunkNumber"
                className="mt-4 border-black max-w-[150px]"
                value={chunkStart}
                onChange={(e) => setChunkStart(+e.target.value)}
                type="number"
              />
            </div>
            <Button
              onClick={() => handleChunk()}
              className="max-w-[300px] mt-4"
              size="lg"
            >
              Start Chunking
            </Button>
            <span className="mt-4">{outputMessage}</span>
          </section>
        )}
    </>
  );
};
