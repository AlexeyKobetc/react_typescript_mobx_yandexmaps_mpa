import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch, useLocation } from "react-router-dom";

import Footer from "./components/Footer";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import PageTemplate from "./components/PageTemplate";

import { useContextRootStore } from "./store/RootStore";

const NoMatch = () => (
  <div className="text-center mt-5 mb-5">
    <h1>No Page</h1>
  </div>
);

const App = () => {
  const {
    appStore: { getPages, setActivePath }
  } = useContextRootStore();

  const [currentPath] = useState(useLocation().pathname);

  useEffect(() => {
    setActivePath(currentPath);
  }, []);

  return (
    <React.Fragment>
      <Switch>
        {Object.keys(getPages).map((pageName: string, index: number) => {
          const { path, component, isExact } = getPages[pageName];

          return <Route path={path} component={component} exact={isExact} key={`${pageName}_${index}`} />;
        })}
        <Route component={NoMatch} />
      </Switch>
    </React.Fragment>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <PageTemplate>
      <Router>
        <Header />
        <App />
        <Footer />
      </Router>
    </PageTemplate>
  </React.StrictMode>,
  document.getElementById("root")
);
