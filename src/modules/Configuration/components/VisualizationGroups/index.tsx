import React from "react";
import i18n from "@dhis2/d2-i18n";
import {Button, IconAdd16} from "@dhis2/ui";

import VisualizationGroupsTable from "./components/VisualizationGroupsTable";
import {useBoolean} from "usehooks-ts";
import {VisualizationGroupsModal} from "./components/VisualizationGroupsModal";

export default function VisualizationGroupsConfiguration(): React.ReactElement {
    const {value: hidden, setTrue: hide, setFalse: open} = useBoolean(true)

    return (
        <div>
            <VisualizationGroupsModal onClose={hide} hidden={hidden}/>
            <p className="sub-module-title">{i18n.t("Visualization groups")}</p>
            <p className="sub-module-subtitle">
                {i18n.t(
                    "Configuration of the visualization groups for push analytics and chat bot"
                )}
            </p>

            <div className="pt-16">
                <Button
                    primary
                    name="Visualization group"
                    onClick={open}
                    value="visualizationGroupButton"
                    icon={<IconAdd16/>}
                >
                    {i18n.t("Add visualization group")}
                </Button>
            </div>

            <div className="pt-8">
                <VisualizationGroupsTable/>
            </div>
        </div>
    );
}
