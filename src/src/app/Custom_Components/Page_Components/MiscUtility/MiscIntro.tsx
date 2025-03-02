interface Props {
  activeTab: string;
  miscTab: string;
}

export const MiscIntro = ({ activeTab, miscTab }: Props) => {
  return (
    <>
      {activeTab === "miscUtilites" && miscTab === "" && (
        <section className="m-4 p-4">
          Collection of different list utility scripts. Click a button on the
          sidebar to access the relevant utility.
        </section>
      )}
    </>
  );
};
