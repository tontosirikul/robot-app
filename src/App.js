import "./App.scss";
import MapSection from "./Components/MapSection";
import { Button, Grid } from "@material-ui/core";
import React from "react";

function App() {
  return (
    <div>
      <Grid container direction="column" justify="center" alignItems="center">
        <MapSection />
      </Grid>
    </div>
  );
}

export default App;
