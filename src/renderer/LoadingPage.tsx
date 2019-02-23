import * as React from "react";
import { Spinner } from "renderer/Spinner";
import { spinnerService } from "renderer/Spinner/Service";
import "./LoadingPage.scss";

export function LoadingPage() {
  return (
    <div
      style={{
        backgroundColor: "#444444",
        bottom: 0,
        height: "100%",
        left: 0,
        margin: "auto",
        position: "absolute",
        right: 0,
        top: 0,
        width: "100%"
      }}
    >
      <Spinner spinnerService={spinnerService} name="mySpinner" group="foo">
          <div className="cssload-dots">
          <div className="cssload-dot"/>
          <div className="cssload-dot"/>
          <div className="cssload-dot"/>
          <div className="cssload-dot"/>
          <div className="cssload-dot"/>
          </div>
      </Spinner>
    </div>
  );
}
