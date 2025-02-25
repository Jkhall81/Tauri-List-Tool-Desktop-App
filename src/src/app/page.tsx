"use client";

import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { useAppStore } from "./store/store";
import { useState } from "react";

const MainPage = () => {
  const {
    activeTab,
    abbr,
    color,
    setAbbr,
    setColor,
    blaUploadMessage,
    emailReport,
    createFinalFileMessage,
    createDNCFileMessage,
  } = useAppStore();
  const [inputError, setInputError] = useState(false);

  const handleAbbrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setAbbr(value);

    if (["IR", "CK", "VA"].includes(value)) {
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  return (
    <>
      {activeTab === "dncProcessing" && (
        <section className="">
          <div className="p-4 m-4 border-2 border-slate-200 w-[400px] rounded-xl">
            <h1 className="mb-4 font-bold">Email Report Options</h1>
            <p className="mb-4 text-sm">
              Please select the proper dialer and enter the two letter campaign
              designation 'IR', 'CK', or 'VA'.
            </p>
            <div>
              <Checkbox
                id="blue"
                checked={color === "blue"}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setColor("blue");
                  } else {
                    setColor("");
                  }
                }}
              />
              <label
                htmlFor="blue"
                className="text-sm ml-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Blue Dialer
              </label>
            </div>
            <div>
              <Checkbox
                id="green"
                checked={color === "green"}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setColor("green");
                  } else {
                    setColor("");
                  }
                }}
              />
              <label
                htmlFor="green"
                className="text-sm ml-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Green Dialer
              </label>
            </div>
            <div>
              <Checkbox
                id="red"
                checked={color === "red"}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setColor("red");
                  } else {
                    setColor("");
                  }
                }}
              />
              <label
                htmlFor="red"
                className="text-sm ml-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Red Dialer
              </label>
            </div>
            <div className="mt-4">
              <label htmlFor="abbr" className="text-sm mb-2 block">
                Campaign Designation
              </label>
              <Input
                id="abbr"
                value={abbr}
                onChange={handleAbbrChange}
                maxLength={2}
                className={inputError ? "border-red-500" : ""}
              />
              {inputError && (
                <p className="text-red-500 text-sm mt-2">
                  Please enter a valid campaign designation (IR, CK, or VA).
                </p>
              )}
            </div>
          </div>

          <div className="p-4 m-4 border-2 border-slate-200 w-[400px] h-[200px] rounded-xl">
            <p>{blaUploadMessage}</p>
            {blaUploadMessage && (
              <div className="border-b-2 border-slate-400 py-1" />
            )}
            <p>{createFinalFileMessage}</p>
            {createFinalFileMessage && (
              <div className="border-b-2 border-slate-400 py-1" />
            )}
            <p>{createDNCFileMessage}</p>
            {createDNCFileMessage && (
              <div className="border-b-2 border-slate-400 py-1" />
            )}
            <p></p>
          </div>
          {
            <div className={`${!emailReport ? "hidden" : ""}`}>
              <div className="py-4 m-4 border-2 border-slate-200 w-[585px] rounded-xl">
                {emailReport && (
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {emailReport}
                  </pre>
                )}
              </div>
            </div>
          }
        </section>
      )}
    </>
  );
};

export default MainPage;
