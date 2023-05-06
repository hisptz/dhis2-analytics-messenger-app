import React from "react";
import i18n from "@dhis2/d2-i18n";
import { Button, IconAdd16 } from "@dhis2/ui";

import classes from "./Gateway.module.css";
import GatewayConfigurationsTable from "./components/GatewayConfigurationsTable";

export default function GatewayConfiguration(): React.ReactElement {
  function onAddGatewayConfiguration(): void {
    console.log("on add gateway configuration");
  }

  return (
    <div>
      <p className="sub-module-title">{i18n.t("Gateway")}</p>
      <p className="sub-module-subtitle">
        {i18n.t("Configuration of the gateways for push analytics")}
      </p>

      <div className="pt-16">
        <Button
          primary
          name="Gateway"
          onClick={onAddGatewayConfiguration}
          value="gatewayButton"
          icon={<IconAdd16 />}
        >
          {i18n.t("Add gateway")}
        </Button>
      </div>

      <div className="pt-8">
        <GatewayConfigurationsTable />
      </div>
    </div>
  );
}
