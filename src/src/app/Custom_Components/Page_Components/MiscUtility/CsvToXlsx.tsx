interface Props {
  activeTab: string;
  miscTab: string;
}

export const CsvToXlsx = ({ activeTab, miscTab }: Props) => {
  return (
    <>
      {activeTab === "miscUtilites" && miscTab === "csvtoxlsx" && (
        <section className="m-4 p-4">CSV to XLSX</section>
      )}
    </>
  );
};
