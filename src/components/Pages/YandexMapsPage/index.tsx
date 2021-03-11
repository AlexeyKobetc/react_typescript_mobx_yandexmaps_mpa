import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { useContextRootStore } from "../../../store/RootStore";

import styles from "./index.module.css";

const fadeOut = (root: HTMLDivElement) => {
  let loadingDiv = root.querySelector("div");
  if (loadingDiv !== null) {
    loadingDiv.style.opacity = "0";
    setTimeout(() => {
      if (loadingDiv) {
        loadingDiv.style.display = "none";
      }
    }, 2000);
  }
};

const YandexMapsPage = observer(() => {
  const { yandexMapsStore } = useContextRootStore();
  const { setYmDiv, isYmReady } = yandexMapsStore;
  const yandexMapsDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (yandexMapsDiv.current) {
      setYmDiv(yandexMapsDiv.current);
      isYmReady && fadeOut(yandexMapsDiv.current);
    }
  });

  return (
    <React.Fragment>
      <div className="row border d-flex flex-column flex-wrap justify-content-center align-items-center border-danger">
        <div className="col-12 col-sm-11 border border-danger">FORM</div>
        <div className="col-12 d-flex flex-row flex-wrap justify-content-around align-items-center bg-dark text-light pt-1">
          <h6>Левая клавиша мыши - установить маркер отправления</h6>
          <h6>Правая клавиша мыши - установить маркер назначения</h6>
        </div>
        <div
          className="col-12 col-sm-11 border border-danger"
          style={{ position: "relative", minHeight: "60vh" }}
          ref={yandexMapsDiv}
        >
          <div className={styles.loading}>
            <div className="ps-4 pt-2">
              <h1 className="text-secondary">Загружается карта ...</h1>
            </div>

            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Карта загружется ...</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-11 border border-danger">SUBMIT</div>
      </div>
    </React.Fragment>
  );
});

export default YandexMapsPage;
