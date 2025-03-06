"use client";

import { DncActiveTabComponent } from "./Custom_Components/Page_Components/DncActiveTabComponent";
import { ListProcessingTabComponent } from "./Custom_Components/Page_Components/ListProcessingTabComponent";
import { MiscUtilityActiveTabComponent } from "./Custom_Components/Page_Components/MiscUtilityActiveTabComponent";

const MainPage = () => {
  return (
    <>
      <DncActiveTabComponent />
      <MiscUtilityActiveTabComponent />
      <ListProcessingTabComponent />
    </>
  );
};

export default MainPage;
