interface Props {
  activeTab: string;
  miscTab: string;
}

export const Chunking = ({ activeTab, miscTab }: Props) => {
  return (
    <>
      {activeTab === "miscUtilites" && miscTab === "chunking" && (
        <section className="m-4 p-4">Chunking</section>
      )}
    </>
  );
};
