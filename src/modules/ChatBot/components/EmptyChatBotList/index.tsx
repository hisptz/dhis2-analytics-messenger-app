import React from "react";
import { Button } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { ChatBotSvg } from "../Icons";
import classes from "./EmptyChatBotList.module.css";

interface EmptyChatBotListParams {
  onAddChatBotTrigger: VoidFunction;
}

export default function EmptyChatBotList({
  onAddChatBotTrigger,
}: EmptyChatBotListParams): React.ReactElement {
  return (
    <div className={classes["list-container"]}>
      <ChatBotSvg />
      <p className="pt-16 center">
        {i18n.t(
          "There are no Chat Bot's trigger configured, click the below button to add new."
        )}
      </p>
      <div className="pt-16">
        <Button
          primary
          name="Bot Trigger"
          onClick={onAddChatBotTrigger}
          value="botTriggerButton"
        >
          {i18n.t("Add Chat Bot triggers")}
        </Button>
      </div>
    </div>
  );
}
