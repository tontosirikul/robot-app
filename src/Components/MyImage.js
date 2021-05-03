import { Image } from "react-konva";
import useImage from "use-image";
import { Stage, Layer, Line } from "react-konva";
import React, { useState, useEffect } from "react";
import "../style/MapSection.scss";
import { Container, Grid, Button } from "@material-ui/core";
import img from "../static/black.jpg";

class URLImage extends React.Component {
  state = {
    image: null,
  };
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }
  componentWillUnmount() {
    this.image.removeEventListener("load", this.handleLoad);
  }
  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener("load", this.handleLoad);
  }
  handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState({
      image: this.image,
    });
    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
  };
  render() {
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        image={this.state.image}
        ref={(node) => {
          this.imageNode = node;
        }}
      />
    );
  }
}

const MyImage = ({ socket, x, y }) => {
  const [src, setSrc] = useState(null);

  const [mode, setMode] = useState("Normal mode");
  useEffect(() => {
    setSrc(img);
    socket.on("Occupancy Grid", (dataURI) => {
      setSrc(dataURI);
    });
  }, []);

  const [isDraw, setIsDraw] = useState(false);
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);

  const [isDeleteWall, setIsDeleteWall] = useState(false);
  const [currentWall, setCurrentWall] = useState([]);
  const [selectedWall, setSelectedWall] = useState([]);

  function saveWall() {
    setMode("Normal mode");
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

  function deleteWall() {
    setMode("Delete mode");
    fetchCurrentWall();
  }
  function fetchCurrentWall() {
    setCurrentWall([
      {
        id: 0,
        startpoint: { x: 0, y: 0 },
        endpoint: { x: 100, y: 200 },
      },
      {
        id: 1,
        startpoint: { x: 0, y: 0 },
        endpoint: { x: 100, y: 150 },
      },
    ]);
    console.log(currentWall);
  }
  function sendSelecetedWall() {}

  function clearSelectedWall() {
    setIsDeleteWall(false);
    setMode("Normal mode");
    setSelectedWall([]);
  }
  function clearLines() {
    setMode("Normal mode");
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
      <Grid container direction="row" justify="center" alignItems="center">
        <h2>MODE:{mode}</h2>

        <h2 style={{ margin: "1rem" }}>Selected Wall ID:{selectedWall}</h2>
      </Grid>
      <Container
        className="Map"
        style={{
          height: 381,
          width: 381,
        }}
      >
        <Stage
          width={381}
          height={381}
          style={{ border: "1px solid #000000" }}
          onMouseDown={isDraw ? handleMouseDown : null}
        >
          <Layer>
            <URLImage src={src} x={x} y={y} />
          </Layer>
          <Layer>
            {lines.map((xline, i) => (
              <Line
                key={i}
                points={xline}
                stroke={src === img ? "white" : "black"}
                strokeWidth={0.5}
                tension={0.5}
                lineCap="round"
              />
            ))}
          </Layer>
          {isDeleteWall ? (
            <Layer>
              {currentWall.map((line, i) => (
                <Line
                  key={line.id}
                  points={[
                    line.startpoint.x,
                    line.startpoint.y,
                    line.endpoint.x,
                    line.endpoint.y,
                  ]}
                  stroke={"white"}
                  strokeWidth={2}
                  tension={0.5}
                  lineCap="round"
                  onMouseEnter={(e) => {
                    // style stage container:
                    const container = e.target.getStage().container();
                    container.style.cursor = "pointer";
                  }}
                  onMouseLeave={(e) => {
                    const container = e.target.getStage().container();
                    container.style.cursor = "default";
                  }}
                  onMouseDown={() => {
                    var newWallSelected = [...selectedWall];
                    if (selectedWall.indexOf(line.id) === -1)
                      newWallSelected.push(line.id);
                    setSelectedWall(newWallSelected);
                  }}
                />
              ))}
            </Layer>
          ) : null}
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
                  setMode("Draw mode");
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
          disbled={isDraw}
          onClick={
            !isDeleteWall
              ? () => {
                  setIsDeleteWall(true);
                  deleteWall();
                }
              : () => {
                  sendSelecetedWall();
                }
          }
        >
          Remove wall
        </Button>

        <Button
          variant="contained"
          color="secondary"
          style={{ margin: "1rem" }}
          disabled={!isDraw && !isDeleteWall}
          onClick={
            !isDeleteWall ? () => clearLines() : () => clearSelectedWall()
          }
        >
          CANCEL
        </Button>
      </Grid>
    </div>
  );
};

export default MyImage;
