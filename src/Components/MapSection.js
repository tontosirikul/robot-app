import { Stage, Layer, Line } from "react-konva";
import { useState, useEffect, useRef } from "react";
import "../style/MapSection.scss";
import { Container } from "@material-ui/core";
import MyImage from "./MyImage";
import io from "socket.io-client";

// const ENDPOINT = "http://127.0.0.1:4001";
// const socket = io(ENDPOINT);

function MapSection() {
  const [Src, setSrc] = useState(null);
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const [windowWidth, setWindowWidth] = useState(
    Math.ceil(window.innerWidth * 0.4)
  );
  const [windowHeight, setWindowHeight] = useState(
    Math.ceil(window.innerHeight * 0.3)
  );
  // var ImageObj = new window.Image();
  let resizeMap = () => {
    let mapWidth = Math.ceil(window.innerWidth * 0.4);
    let mapHeight = Math.ceil(window.innerWidth * 0.3);
    setWindowWidth(mapWidth);
    setWindowHeight(mapHeight);
  };

  useEffect(() => {
    resizeMap();
    window.addEventListener("resize", resizeMap);
  }, []);

  useEffect(() => {
    // socket.on("FromAPI", (dataURI) => {
    //   setSrc(dataURI);
    // });
    setSrc("https://konvajs.org/assets/yoda.jpg");
  }, []);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    console.log(pos);
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="MapSection">
      <Container className="Map" style={{ width: windowWidth }}>
        <Stage
          width={windowWidth}
          height={windowHeight}
          style={{ border: "1px solid #000000" }}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            <MyImage url={Src} x={windowWidth / 2} y={windowHeight / 2} />
          </Layer>
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </Container>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
      <h1>{windowWidth + " x " + windowHeight}</h1>
    </div>
  );
}

export default MapSection;
