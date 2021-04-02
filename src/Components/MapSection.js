import React, { useState, useEffect, useRef } from "react";
import "../style/MapSection.scss";
import MyImage from "./MyImage";
import io from "socket.io-client";
import { Fragment } from "react";

// const ENDPOINT = "http://127.0.0.1:4001";
// const socket = io(ENDPOINT);

function MapSection() {
  const [Src, setSrc] = useState(null);
  useEffect(() => {
    // socket.on("FromAPI", (dataURI) => {
    //   setSrc(dataURI);
    // });
    setSrc("https://konvajs.org/assets/yoda.jpg");
  }, []);
  return (
    <Fragment>
      {Src === null ? <h1>No map</h1> : <MyImage url={Src} x={0} y={0} />}
    </Fragment>
  );
}
export default MapSection;
