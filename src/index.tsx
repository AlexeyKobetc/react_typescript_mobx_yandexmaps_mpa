import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import Footer from "./components/Footer";

import Header from "./components/Header";
import PageTemplate from "./components/PageTemplate";

import { useContextRootStore } from "./store/RootStore";

const App = () => {
  const {
    appStore: { getPages }
  } = useContextRootStore();

  return (
    <React.Fragment>
      {Object.keys(getPages).map((pageName: string, index: number) => {
        const { path, component, isExact } = getPages[pageName];

        return <Route path={path} component={component} exact={isExact} key={`${pageName}_${index}`} />;
      })}
    </React.Fragment>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <PageTemplate>
        <Header />
        <App />
        <Footer />
      </PageTemplate>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
