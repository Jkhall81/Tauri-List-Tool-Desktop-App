interface Props {
  activeTab: string;
  miscTab: string;
}

export const XlsxToCsv = ({ activeTab, miscTab }: Props) => {
  return (
    <>
      {activeTab === "miscUtilites" && miscTab === "xlsxtocsv" && (
        <section className="m-4 p-4">XLSX to CSV</section>
      )}
    </>
  );
};
