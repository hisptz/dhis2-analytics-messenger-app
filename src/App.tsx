import React, { Suspense } from "react";
import i18n from "@dhis2/d2-i18n";
import { DataStoreProvider } from "@dhis2/app-service-datastore";
import FullPageLoader from "./shared/components/Loaders";
import AppRouter from "./modules/Router";
import "./main.css";
import "./common.css";

const App = () => (
  <DataStoreProvider
    namespace="hisptz-analytics"
    loadingComponent={
      <FullPageLoader message={i18n.t("Fetching App configurations...")} />
    }
  >
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
  </DataStoreProvider>
);

export default App;
