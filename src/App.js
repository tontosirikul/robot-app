import "./App.scss";
import MapSection from "./Components/MapSection";
import { Button, Grid } from "@material-ui/core";
import React from "react";

function App() {
  return (
    <div>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid container direction="row" justify="center" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            style={{ margin: "1rem" }}
          >
            Initial Pose
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: "1rem" }}
          >
            Send Goal
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: "1rem" }}
          >
            Add Virtual wall
          </Button>
        </Grid>

        <MapSection />
      </Grid>
    </div>
  );
}

export default App;
