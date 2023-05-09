import React from "react";
import classes from "./NavBar.module.css";
import { Tab, TabBar } from "@dhis2/ui";
import { useLocation, useNavigate } from "react-router-dom";
import { NAVIGATION_ITEMS } from "../../../../shared/constants/navigation";

export default function NavBar(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className={classes.container}>
      <TabBar>
        {NAVIGATION_ITEMS.map(({ label, path, icon }) => {
          const Icon = icon;
          return (
            <Tab
              dataTest={`${label}-tab`}
              onClick={() => navigate(path)}
              key={`${path}-nav-tab`}
              selected={Boolean(location.pathname.match(path))}
              icon={Icon !== undefined ? <Icon /> : null}
            >
              {label}
            </Tab>
          );
        })}
      </TabBar>
    </div>
  );
}
