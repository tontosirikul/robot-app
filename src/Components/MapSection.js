import { Stage, Layer, Line } from "react-konva";
import React, { useState, useEffect, useRef } from "react";
import "../style/MapSection.scss";
import { Container, Grid, Button } from "@material-ui/core";
import MyImage from "./MyImage";
import io from "socket.io-client";

// const ENDPOINT = "http://127.0.0.1:4001";
// const socket = io(ENDPOINT);

function MapSection() {
  const [Src, setSrc] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [historyLines, setHistoryLines] = useState([]);
  function saveWall() {
    setIsDraw(false);
    console.log("saved");
    setHistoryLines((oldLines) => [...oldLines, lines]);
    setPoints([]);
    setLines([]);
    // send api
  }
  function clearLines() {
    setLines([]);
    setPoints([]);
  }
  function handleMouseDown(e) {
    if (points.length == 0) {
      const pos = e.target.getStage().getPointerPosition();
      setPoints([...points, pos.x, pos.y]);
    } else {
      const endpoint = e.target.getStage().getPointerPosition();
      setPoints([...points, endpoint.x, endpoint.y]);
    }
  }

  useEffect(() => {
    // socket.on("FromAPI", (dataURI) => {
    //   setSrc(dataURI);
    // });
    setSrc("https://konvajs.org/assets/yoda.jpg");
  }, []);

  useEffect(() => {
    var temp = [];
    if (points.length >= 4) {
      for (let i = 0; i < points.length; i++) {
        if (temp.length <= 4) {
          temp.push(points[i]);
          if (temp.length === 4) {
            setLines([...lines, temp]);
            temp = temp.slice(2, 4);
          }
        }
      }
    }
  }, [points]);

  useEffect(() => {
    console.log("current", lines, "hist", historyLines);
  }, [lines, historyLines]);

  return (
    <div className="MapSection" style={{ margin: "1rem" }}>
      <Container className="Map" style={{ height: 500, width: 700 }}>
        <Stage
          width={700}
          height={500}
          style={{ border: "1px solid #000000" }}
          onMouseDown={isDraw ? handleMouseDown : null}
        >
          <Layer>
            <MyImage url={Src} x={700 / 2} y={500 / 2} />
          </Layer>
          <Layer>
            {lines.map((xline, i) => (
              <Line
                key={i}
                points={xline}
                stroke="black"
                strokeWidth={2}
                tension={0.5}
                lineCap="round"
              />
            ))}
            {historyLines.map((hline, j) => (
              <Line
                key={j}
                points={hline}
                stroke="black"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
              />
            ))}
          </Layer>
        </Stage>
        <Grid container direction="row" justify="center" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            style={{ margin: "1rem" }}
            onClick={
              isDraw
                ? () => {
                    setIsDraw(false);
                    saveWall();
                  }
                : () => {
                    setIsDraw(true);
                  }
            }
          >
            {isDraw ? "Save virtual wall" : "Add Virtual wall"}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            style={{ margin: "1rem" }}
            disabled={!isDraw}
            onClick={() => clearLines()}
          >
            CANCEL
          </Button>
        </Grid>
        {}
      </Container>
    </div>
  );
}

export default MapSection;
