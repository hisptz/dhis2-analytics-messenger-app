import NavBar from "./NavBar";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import classes from "../../../App.module.css";
import FullPageLoader from "../../../shared/components/Loaders";

export function MainApp() {
	return (
		<>
			<NavBar />
			<Suspense fallback={<FullPageLoader />}>
				<div className={classes["main-container"]}>
					<Outlet />
				</div>
			</Suspense>
		</>
	);
}
