import React from "react";
import PushAnalyticsTable from "./components/PushAnalyticsTable";

function anAddPushAnalytics() {
    console.log("on add push analytics");
}

export default function PushAnalytics(): React.ReactElement {

    return (
        <div className="w-100 h-100 align-center p-32 column">
            <PushAnalyticsTable/>
        </div>
    );
}
