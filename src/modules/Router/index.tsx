import React, { Suspense } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import FullPageLoader from "../../shared/components/Loaders";
import { NAVIGATION_ITEMS } from "../../shared/constants/navigation";
import NavBar from "./components/NavBar";
import classes from "../../App.module.css";
import PageNotFound from "../../shared/components/404Page";

export default function AppRouter(): React.ReactElement {
  return (
    <div className={classes.container}>
      <HashRouter>
        <NavBar />
        <div className={classes["main-container"]}>
          <Suspense fallback={<FullPageLoader />}>
            <Routes>
              <Route path="/" element={<Navigator />}></Route>
              {NAVIGATION_ITEMS.map(({ element, path, subItems }) => {
                const Element = element;
                return (
                  <Route
                    key={`${path}-route`}
                    path={path}
                    element={<Element />}
                  >
                    {subItems?.map(({ path: subPath, element: subElement }) => {
                      const SubElement = subElement;
                      return (
                        <Route
                          key={`${path}-${subPath}-route`}
                          path={`${subPath}`}
                          element={<SubElement />}
                        />
                      );
                    })}
                  </Route>
                );
              })}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </div>
      </HashRouter>
    </div>
  );
}

export function Navigator(): React.ReactElement {
  return <Navigate to={"push-analytics"} />;
}
