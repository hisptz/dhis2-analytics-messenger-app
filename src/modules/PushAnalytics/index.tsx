import React from "react";
import PushAnalyticsList from "./components/PushAnalyticsList";

function anAddPushAnalytics() {
  console.log("on add push analytics");
}

export default function PushAnalytics(): React.ReactElement {
  return (
    <div>
      <PushAnalyticsList anAddPushAnalytics={anAddPushAnalytics} />
    </div>
  );
}
