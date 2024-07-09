import React from "react";
import i18n from "@dhis2/d2-i18n";
import { DHIS2AccessConfig } from "./components/DHIS2AccessConfig";

export function AccessConfig() {
	return (
		<div className="w-100 h-100 p-16 gap-32">
			<section className="h-100 w-100 column gap-8">
				<div className="sub-module-title-container">
					<p className="sub-module-title">{i18n.t("DHIS2 Access")}</p>
					<p className="sub-module-subtitle">
						{i18n.t(
							"Configure the access level the analytics messenger has on your DHIS2 instance",
						)}
					</p>
				</div>
				<div>
					<DHIS2AccessConfig />
				</div>
			</section>
		</div>
	);
}
