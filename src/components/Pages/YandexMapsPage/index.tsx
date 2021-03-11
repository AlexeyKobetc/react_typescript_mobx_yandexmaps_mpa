import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react";

import { useContextYandexMapsStore } from "./store/RootStore";

import styles from "./index.module.css";
import { OrderForm } from "./components/OrderForm";
import { SubmitForm } from "./components/SubmitForm";

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
  const { setYmDiv, getIsYmReady } = useContextYandexMapsStore();

  const yandexMapsDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (yandexMapsDiv.current) {
      setYmDiv(yandexMapsDiv.current);
      getIsYmReady && fadeOut(yandexMapsDiv.current);
    }
  });

  return (
    <React.Fragment>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-12 col-sm-11 mt-3 mb-3 ">
          <OrderForm />
        </div>
      </div>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-12 d-flex flex-row flex-wrap justify-content-around align-items-center bg-dark text-light pt-1">
          <h6>
            <strong>Левая клавиша мыши</strong> - установить маркер отправления
          </h6>
          <h6>
            <strong>Правая клавиша мыши</strong> - установить маркер назначения
          </h6>
        </div>
      </div>
      <div className="row d-flex justify-content-center align-items-center">
        <div
          className="col-12 col-sm-11"
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
      </div>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-12 d-flex flex-row flex-wrap justify-content-around align-items-center bg-dark text-light pt-1">
          <h6>
            <strong>Левая клавиша мыши</strong> - установить маркер отправления
          </h6>
          <h6>
            <strong>Правая клавиша мыши</strong> - установить маркер назначения
          </h6>
        </div>
      </div>
      <div className="row d-flex flex-row justify-content-around align-items-center">
        <SubmitForm />
      </div>
    </React.Fragment>
  );
});

export default YandexMapsPage;
