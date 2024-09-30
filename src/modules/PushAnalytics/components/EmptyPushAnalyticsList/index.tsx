import i18n from "@dhis2/d2-i18n";
import { Button, IconAdd16 } from "@dhis2/ui";
import React from "react";
import { PushAnalyticsSvg } from "../Icons";
import classes from "./EmptyPushAnalyticsList.module.css";
import { useBoolean } from "usehooks-ts";
import { PushAnalyticsModalConfig } from "../PushAnalyticsModalConfig";

export default function EmptyPushAnalyticsList(): React.ReactElement {
	const { value: hidden, setTrue: hide, setFalse: open } = useBoolean(true);

	return (
		<>
			{!hidden && (
				<PushAnalyticsModalConfig hidden={hidden} onClose={hide} />
			)}
			<div className={classes["list-container"]}>
				<PushAnalyticsSvg />
				<p className="pt-16 center">
					{i18n.t("There are no Push Analytics configured.")}
				</p>
				<div className="pt-16 ">
					<Button
						primary
						onClick={open}
						name="Push Analytics"
						value="pushAnalyticsButton"
						icon={<IconAdd16 />}
					>
						{i18n.t("Add push analytics")}
					</Button>
				</div>
			</div>
		</>
	);
}
