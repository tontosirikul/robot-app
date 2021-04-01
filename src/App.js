import "./App.scss";
import MapSection from "./Components/MapSection";
import { Button, Grid } from "@material-ui/core";
import React from "react";

function App() {
  return (
    <div className="container">
      <nav>Navbar</nav>
      <main>
        <MapSection />
      </main>
      <div id="sidebar">Sidebar</div>
      <div className="content1">Content1</div>
      <div className="content2">Content2</div>
      <div className="content3">Content2</div>
      <footer>Footer</footer>
    </div>
  );
}

export default App;
