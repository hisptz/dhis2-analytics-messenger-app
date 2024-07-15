import NavBar from "./NavBar";
import React from "react";
import { Outlet } from "react-router-dom";
import classes from "../../../App.module.css";

export function MainApp() {
	return (
		<>
			<NavBar />
			<div className={classes["main-container"]}>
				<Outlet />
			</div>
		</>
	);
}
