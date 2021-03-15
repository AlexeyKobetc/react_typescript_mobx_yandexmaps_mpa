import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react";

import { useContextYandexMapsStore } from "./store/RootStore";

import { OrderForm } from "./components/OrderForm";
import { SubmitForm } from "./components/SubmitForm";
import Loading from "../../../sharedcomponents/Loading";

import styles from "./index.module.css";
import { fadeOut, changeButtonLabel, collapseButton, helpRow } from "./components/functions";

const YandexMapsPage = observer(() => {
  const { setYmDiv, getIsYmReady } = useContextYandexMapsStore();

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      setYmDiv(divRef.current);
      getIsYmReady && fadeOut(divRef.current);
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
          {collapseButton("orderButton", "orderDiv")}
          <div className="collapse show" id="orderDiv">
            <OrderForm />
          </div>
        </div>
      </div>
      {helpRow()}
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-12 col-sm-11 mt-3 mb-3 d-grid">{collapseButton("mapButton", "mapDiv")}</div>
      </div>
      <div className="row">
        <div className="collapse show" id="mapDiv">
          <div className="col-12" style={{ position: "relative", minHeight: "40vh" }} ref={divRef}>
            <div className={styles.loading}>
              <Loading text={`Загружается карта ...`} />
            </div>
          </div>
        </div>
      </div>
      {helpRow()}
      <div className="row d-flex flex-row justify-content-around align-items-center">
        <SubmitForm />
      </div>
    </React.Fragment>
  );
});

export default YandexMapsPage;
