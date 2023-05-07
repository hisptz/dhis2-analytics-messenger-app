import React from "react";
import EmptyPushAnalyticsList from "./components/EmptyPushAnalyticsList";
import {useBoolean} from "usehooks-ts";
import {PushAnalyticsModalConfig} from "./components/PushAnalyticsModalConfig";

function anAddPushAnalytics() {
    console.log("on add push analytics");
}

export default function PushAnalytics(): React.ReactElement {
    const {value: hidden, setTrue: hide, setFalse: open} = useBoolean(true);

    return (
        <div>
            <PushAnalyticsModalConfig hidden={hidden} onClose={hide}/>
            <EmptyPushAnalyticsList anAddPushAnalytics={open}/>
            {/* TODO add switch condition to render table */}
        </div>
    );
}
