interface Props {
  activeTab: string;
  listProcessingTab: string;
}

export const ListPIntro = ({ activeTab, listProcessingTab }: Props) => {
  return (
    <>
      {activeTab === "listProcessing" && listProcessingTab === "" && (
        <section className="m-4 p-4">
          Collection of different list processing scripts. These will be used to
          get a list ready to upload to the database Click a button on the
          sidebar to access the relevant utility.
        </section>
      )}
    </>
  );
};
