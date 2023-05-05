import React, { Suspense } from "react";
import i18n from "@dhis2/d2-i18n";
import FullPageLoader from "./shared/components/Loaders";
import AppRouter from "./modules/Router";
import "./main.css";
import "./common.css";

const MyApp = () => (
  <div>
    <Suspense
      fallback={
        <FullPageLoader
          message={i18n.t("Please wait this might take a while...")}
        />
      }
    >
      <AppRouter />
    </Suspense>
  </div>
);

export default MyApp;
