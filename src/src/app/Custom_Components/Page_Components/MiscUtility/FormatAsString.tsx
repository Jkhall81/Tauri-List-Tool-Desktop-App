interface Props {
  activeTab: string;
  miscTab: string;
}

export const FormatAsString = ({ activeTab, miscTab }: Props) => {
  return (
    <>
      {activeTab === "miscUtilites" && miscTab === "formatrowsasstring" && (
        <section className="m-4 p-4">Format Rows as String</section>
      )}
    </>
  );
};
