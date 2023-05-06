import React from "react";
import EmptyPushAnalyticsList from "./components/EmptyPushAnalyticsList";

function anAddPushAnalytics() {
  console.log("on add push analytics");
}

export default function PushAnalytics(): React.ReactElement {
  return (
    <div>
      <EmptyPushAnalyticsList anAddPushAnalytics={anAddPushAnalytics} />
      {/* TODO add switch condition to render table */}
    </div>
  );
}
