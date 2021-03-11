import React, { useEffect, useRef } from "react";
import { useContextRootStore } from "../../../store/RootStore";

const YandexMapsPage = () => {
  const { yandexMapsStore } = useContextRootStore();
  const { setYmDiv } = yandexMapsStore;
  const yandexMapsDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (yandexMapsDiv.current) {
      setYmDiv(yandexMapsDiv.current);
    }
  });

  return (
    <React.Fragment>
      <div className="row border d-flex flex-column flex-wrap justify-content-center align-items-center border-danger">
        <div className="col-12 col-sm-11 border border-danger">FORM</div>
        <div
          className="col-12 col-sm-11 border border-danger"
          style={{ minHeight: "60vh" }}
          ref={yandexMapsDiv}
        >
          MAP
        </div>
        <div className="col-12 col-sm-11 border border-danger">SUBMIT</div>
      </div>
    </React.Fragment>
  );
};

export default YandexMapsPage;
