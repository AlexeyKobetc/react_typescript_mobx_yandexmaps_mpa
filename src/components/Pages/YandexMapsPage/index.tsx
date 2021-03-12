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

const changeButtonLabel = (event: any) => {
  const { target, type } = event;

  const { id } = target;

  if (type === "shown.bs.collapse") {
    if (id === "orderDiv") {
      const orderButton = document.querySelector("#orderButton");
      if (orderButton) orderButton.textContent = `unfold_less`;
    }
    if (id === "mapDiv") {
      const mapButton = document.querySelector("#mapButton");
      if (mapButton) mapButton.textContent = `unfold_less`;
    }
  }
  if (type === "hidden.bs.collapse") {
    if (id === "orderDiv") {
      const orderButton = document.querySelector("#orderButton");
      if (orderButton) orderButton.textContent = `unfold_more`;
    }
    if (id === "mapDiv") {
      const mapButton = document.querySelector("#mapButton");
      if (mapButton) mapButton.textContent = `unfold_more`;
    }
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
    const orderDiv = document.querySelector("#orderDiv");
    const mapDiv = document.querySelector("#mapDiv");

    orderDiv?.addEventListener("hidden.bs.collapse", changeButtonLabel);
    orderDiv?.addEventListener("shown.bs.collapse", changeButtonLabel);
    mapDiv?.addEventListener("hidden.bs.collapse", changeButtonLabel);
    mapDiv?.addEventListener("shown.bs.collapse", changeButtonLabel);
    return () => {
      orderDiv?.removeEventListener("hidden.bs.collapse", changeButtonLabel);
      orderDiv?.removeEventListener("shown.bs.collapse", changeButtonLabel);
      mapDiv?.removeEventListener("hidden.bs.collapse", changeButtonLabel);
      mapDiv?.removeEventListener("shown.bs.collapse", changeButtonLabel);
    };
  });

  return (
    <React.Fragment>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-12 col-sm-11 mt-3 mb-3">
          <span
            className="btn btn-outline-secondary btn-sm material-icons"
            style={{ width: "2rem" }}
            id="orderButton"
            data-bs-toggle="collapse"
            data-bs-target="#orderDiv"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            unfold_less
          </span>

          <div className="collapse show" id="orderDiv">
            <OrderForm />
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
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-12 col-sm-11 mt-3 mb-3 d-grid">
          <span
            className="btn btn-outline-secondary btn-sm material-icons"
            style={{ width: "2rem" }}
            id="mapButton"
            data-bs-toggle="collapse"
            data-bs-target="#mapDiv"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            unfold_less
          </span>
        </div>
      </div>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="collapse show" id="mapDiv">
          <div
            className="col-12 col-sm-11"
            style={{ position: "relative", minHeight: "80vh" }}
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
