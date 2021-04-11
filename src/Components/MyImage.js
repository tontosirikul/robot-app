import { Image } from "react-konva";
import useImage from "use-image";
import { Stage, Layer, Line } from "react-konva";
import React, { useState, useEffect } from "react";
import "../style/MapSection.scss";
import { Container, Grid, Button } from "@material-ui/core";
import io from "socket.io-client";

// const MyImage = ({ url, x, y }) => {
//   const [image] = useImage(url);

//   return <Image image={image} x={x} y={y} />;
// };

const MyImage = ({ url, x, y }) => {
  const [image] = useImage(url);
  const width = (image && image.width) || 0;
  const height = (image && image.height) || 0;
  const [isDraw, setIsDraw] = useState(false);
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);
  //const [historyLines, setHistoryLines] = useState([]);
  function saveWall() {
    setIsDraw(false);
    console.log("saved");
    //console.log(lines);
    const virtual_wall = [];
    lines.map((line) =>
      virtual_wall.push({
        startpoint: { x: line[0], y: line[1] },
        endpoint: { x: line[2], y: line[3] },
      })
    );
    // for post the data of virtual wall object
    setPoints([]);
    setLines([]);
    // send api
  }
  function clearLines() {
    setLines([]);
    setPoints([]);
  }
  function handleMouseDown(e) {
    if (points.length === 0) {
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

  return (
    <div className="MapSection" style={{ margin: "1rem" }}>
      <Container className="Map" style={{ height: height, width: width }}>
        <Stage
          width={width}
          height={height}
          style={{ border: "1px solid #000000" }}
          onMouseDown={isDraw ? handleMouseDown : null}
        >
          <Layer>
            <Image image={image} x={x} y={y} />
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
          </Layer>
        </Stage>
      </Container>
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
    </div>
  );
};

export default MyImage;
