import React from "react";
import i18n from "@dhis2/d2-i18n";

// TODO remove this import
import {
  IconSettings16,
  IconTerminalWindow16,
  IconDashboardWindow16,
} from "@dhis2/ui";
import { NavigationItem } from "../interfaces";

// Main pages
const PushAnalyticsPage = React.lazy(
  () => import("../../modules/PushAnalytics")
);
const ChatBotPage = React.lazy(() => import("../../modules/ChatBot"));
const ConfigurationPage = React.lazy(
  () => import("../../modules/Configuration")
);

export const NAVIGATION_ITEMS: Array<NavigationItem> = [
  {
    label: i18n.t("Push Analytics"),
    path: "push-analytics",
    icon: IconDashboardWindow16,
    element: PushAnalyticsPage,
  },
  {
    label: i18n.t("Chat Bot"),
    path: "chat-bot",
    icon: IconTerminalWindow16,
    element: ChatBotPage,
  },
  {
    label: i18n.t("Configuration"),
    path: "configuration",
    icon: IconSettings16,
    element: ConfigurationPage,
  },
];
