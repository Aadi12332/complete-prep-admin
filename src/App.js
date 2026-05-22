/** @format */

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import allRoutes from "./Routes/Route";
import { ScrollToTop } from "./utils/utils";
import { Toaster } from "sonner";

const App = () => {
  return (
    <BrowserRouter>
    <Toaster position="top-right" expand={false} richColors />
      <ScrollToTop />
      <Routes>
        {allRoutes.map((routeConfig, index) => (
          <Route
            path={routeConfig.route}
            element={routeConfig.component}
            key={`routeConfig${index}`}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;