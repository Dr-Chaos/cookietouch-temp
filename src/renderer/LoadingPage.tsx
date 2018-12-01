import { Spinner } from "@renderer/Spinner";
import { spinnerService } from "@renderer/Spinner/Service";
import * as React from "react";
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
        <div className="sk-fading-circle">
          <div className="sk-circle1 sk-circle" />
          <div className="sk-circle2 sk-circle" />
          <div className="sk-circle3 sk-circle" />
          <div className="sk-circle4 sk-circle" />
          <div className="sk-circle5 sk-circle" />
          <div className="sk-circle6 sk-circle" />
          <div className="sk-circle7 sk-circle" />
          <div className="sk-circle8 sk-circle" />
          <div className="sk-circle9 sk-circle" />
          <div className="sk-circle10 sk-circle" />
          <div className="sk-circle11 sk-circle" />
          <div className="sk-circle12 sk-circle" />
        </div>
      </Spinner>
    </div>
  );
}
