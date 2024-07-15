import React, { Suspense } from "react";
import i18n from "@dhis2/d2-i18n";
import { DataStoreProvider } from "@dhis2/app-service-datastore";
import FullPageLoader from "./shared/components/Loaders";
import AppRouter from "./modules/Router";
import "./main.css";
import "./common.css";
import { ConfirmDialogProvider } from "@hisptz/dhis2-ui";
import { RecoilRoot } from "recoil";
import { Helmet } from "react-helmet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { predefinedSchedules } from "./shared/constants/dataStore";
import { initializeParse } from "./shared/utils/parse";
import { DamConfigProvider } from "./shared/components/DamConfigProvider";

const queryClient = new QueryClient();

initializeParse();

const App = () => (
	<>
		<Helmet>
			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/apple-touch-icon.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/favicon-16x16.png"
			/>
			<link rel="manifest" href="/site.webmanifest" />
		</Helmet>

		<QueryClientProvider client={queryClient}>
			<DataStoreProvider
				namespace="hisptz-analytics-messenger"
				defaultGlobalSettings={{
					predefinedSchedules,
				}}
				loadingComponent={
					<FullPageLoader
						message={i18n.t("Fetching App configurations...")}
					/>
				}
			>
				<RecoilRoot>
					<Suspense
						fallback={
							<FullPageLoader
								message={i18n.t(
									"Please wait this might take a while...",
								)}
							/>
						}
					>
						<ConfirmDialogProvider>
							<DamConfigProvider
								loadingComponent={
									<FullPageLoader
										message={i18n.t(
											"Fetching App configurations...",
										)}
									/>
								}
							>
								<AppRouter />
							</DamConfigProvider>
						</ConfirmDialogProvider>
					</Suspense>
				</RecoilRoot>
			</DataStoreProvider>
		</QueryClientProvider>
	</>
);

export default App;
