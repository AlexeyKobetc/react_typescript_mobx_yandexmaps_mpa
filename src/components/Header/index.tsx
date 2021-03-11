import { observer } from "mobx-react";
import { NavLink } from "react-router-dom";

import { useContextRootStore } from "../../store/RootStore";

import styles from "./index.module.css";

const Header = observer(() => {
  const { appStore } = useContextRootStore();
  const { getPages, setActivePage } = appStore;
  return (
    <div className="row d-flex flex-row flex-wrap justify-content-center align-items-center bg-dark text-light pt-4 pb-4">
      <div className="col-12 col-sm-3 text-center text-sm-start">
        <NavLink to="/" exact className="text-light text-decoration-none ">
          <div>
            <h2>Тестовый сайт</h2>
          </div>
        </NavLink>
      </div>

      <div className="col-12 col-sm-6 d-flex flex-row flex-wrap justify-content-center align-items-center">
        {Object.keys(getPages).map((pageName: string, index: number) => {
          const { path, isActive, isExact } = getPages[pageName];
          return (
            <NavLink
              to={path}
              exact={isExact}
              key={`${pageName}__${index}`}
              onClick={() => {
                setActivePage(pageName);
              }}
              className={`text-decoration-none ${styles.nav_link} me-3 ms-3`}
            >
              <div
                className={` ${isActive ? styles.nav_item_active : ``} text-decoration-none ${
                  styles.nav_item
                }`}
              >
                <h6>{pageName}</h6>
              </div>
            </NavLink>
          );
        })}
      </div>

      <div className="col-12 col-sm-3 text-center text-sm-end">
        <h4>TEST</h4>
      </div>
    </div>
  );
});

export default Header;
