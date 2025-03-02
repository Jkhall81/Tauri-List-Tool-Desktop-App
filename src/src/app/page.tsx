"use client";

import { DncActiveTabComponent } from "./Custom_Components/Page_Components/DncActiveTabComponent";
import { MiscUtilityActiveTabComponent } from "./Custom_Components/Page_Components/MiscUtilityActiveTabComponent";

const MainPage = () => {
  return (
    <>
      <DncActiveTabComponent />
      <MiscUtilityActiveTabComponent />
    </>
  );
};

export default MainPage;
