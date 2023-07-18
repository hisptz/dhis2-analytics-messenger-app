import React, {Suspense} from "react";
import {DataStoreProvider} from "@dhis2/app-service-datastore";
import i18n from "@dhis2/d2-i18n";
import "./main.css";
import "./common.css";
import {ConfirmDialogProvider} from "@hisptz/dhis2-ui";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Helmet} from "react-helmet";
import {RecoilRoot} from "recoil";
import AppRouter from "./modules/Router";
import FullPageLoader from "./shared/components/Loaders";


const queryClient = new QueryClient();

const App = () => (
    <>
        <Helmet>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
        </Helmet>
        <QueryClientProvider client={queryClient}>
            <DataStoreProvider
                namespace="hisptz-analytics-messenger"
                loadingComponent={
                    <FullPageLoader message={i18n.t("Fetching App configurations...")}/>
                }
            >
                <div>
                    <RecoilRoot>
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
                    </RecoilRoot>
                </div>
            </DataStoreProvider>
        </QueryClientProvider>
    </>
);

export default App;
