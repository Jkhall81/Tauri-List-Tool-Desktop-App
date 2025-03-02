interface Props {
  activeTab: string;
  miscTab: string;
}

export const MultiFileDuplicates = ({ activeTab, miscTab }: Props) => {
  return (
    <>
      {activeTab === "miscUtilites" && miscTab === "multifileduplicates" && (
        <section className="m-4 p-4">MultiFile Duplicates</section>
      )}
    </>
  );
};
