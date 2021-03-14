import React from "react";

const Loading = ({ text }: { text: string }) => (
  <div className="row justify-content-center align-items-center">
    <div className="col d-flex flex-column justify-content-center align-items-center m-4">
      <div>
        <h1 className="text-secondary">{text}</h1>
      </div>
      <div className="spinner-border text-secondary m-4" role="status">
        <span className="visually-hidden">{text}</span>
      </div>
    </div>
  </div>
);

export default Loading;
