import React, { Suspense, useEffect } from "react";
import { HashRouter, Route, Routes, useNavigate } from "react-router-dom";
import classes from "../../App.module.css";
import PageNotFound from "../../shared/components/404Page";
import FullPageLoader from "../../shared/components/Loaders";
import { NAVIGATION_ITEMS } from "../../shared/constants/navigation";
import { MainApp } from "./components/MainApp";
import { Authentication } from "../Authentication";
import { CircularLoader } from "@dhis2/ui";
import Parse from "parse";

export default function AppRouter(): React.ReactElement {
	return (
		<div className={classes.container}>
			<HashRouter>
				<Suspense fallback={<FullPageLoader />}>
					<Routes>
						<Route path="/" element={<Navigator />}></Route>
						<Route path="/landing" element={<Authentication />} />
						<Route path="/app" element={<MainApp />}>
							{NAVIGATION_ITEMS.map(
								({ element, path, subItems }) => {
									const Element = element;
									return (
										<Route
											key={`${path}-route`}
											path={path}
											element={<Element />}
										>
											{subItems?.map(
												({
													path: subPath,
													element: subElement,
												}) => {
													const SubElement =
														subElement;
													return (
														<Route
															key={`${path}-${subPath}-route`}
															path={`${subPath}`}
															element={
																<SubElement />
															}
														/>
													);
												},
											)}
										</Route>
									);
								},
							)}
						</Route>
						<Route path="*" element={<PageNotFound />} />
					</Routes>
				</Suspense>
			</HashRouter>
		</div>
	);
}

export function Navigator(): React.ReactElement {
	const navigate = useNavigate();
	useEffect(() => {
		async function getAuth() {
			const user = Parse.User.current();
			if (!user) {
				navigate("/landing");
			} else {
				try {
					await user.fetch();
					if (!user.get("approved")) {
						await Parse.User.logOut();
						navigate("/landing");
						return;
					}
					navigate("/app/push-analytics");
				} catch (e) {
					navigate("/landing");
				}
			}
		}

		getAuth();
	}, []);

	return (
		<div
			className="column center align-center"
			style={{ width: "100vw", height: "100vh" }}
		>
			<CircularLoader small />
		</div>
	);
}
