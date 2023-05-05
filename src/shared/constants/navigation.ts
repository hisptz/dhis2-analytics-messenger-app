import React from "react";
import i18n from "@dhis2/d2-i18n";

import { NavigationItem } from "../interfaces";
import {
  AnalyticsIcon16,
  ChatBotIcon16,
  SettingsIcon16,
} from "../components/Icons/Icons";

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
    icon: AnalyticsIcon16,
    element: PushAnalyticsPage,
  },
  {
    label: i18n.t("Chat Bot"),
    path: "chat-bot",
    icon: ChatBotIcon16,
    element: ChatBotPage,
  },
  {
    label: i18n.t("Configuration"),
    path: "configuration",
    icon: SettingsIcon16,
    element: ConfigurationPage,
  },
];
