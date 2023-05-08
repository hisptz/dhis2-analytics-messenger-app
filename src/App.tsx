import React, {Suspense} from "react";
import i18n from "@dhis2/d2-i18n";
import {DataStoreProvider} from "@dhis2/app-service-datastore";
import FullPageLoader from "./shared/components/Loaders";
import AppRouter from "./modules/Router";
import "./main.css";
import "./common.css";
import {ConfirmDialogProvider} from "@hisptz/dhis2-ui";

const App = () => (
    <DataStoreProvider
        namespace="hisptz-analytics-messenger"
        loadingComponent={
            <FullPageLoader message={i18n.t("Fetching App configurations...")}/>
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
                <ConfirmDialogProvider>
                    <AppRouter/>
                </ConfirmDialogProvider>
            </Suspense>
        </div>
    </DataStoreProvider>
);

export default App;
