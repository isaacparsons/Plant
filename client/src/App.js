import "./App.css";
import React from "react";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import HomeScreen from "./Screens/HomeScreen";
import PlantDetails from "./Screens/PlantDetails";

const muiTheme = createMuiTheme();

export const App = () => {
  return (
    <ThemeProvider theme={muiTheme}>
      <BrowserRouter>
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            backgroundColor: "#e6e6e6",
          }}
        >
          <Switch>
            <Route exact path="/">
              <HomeScreen />
            </Route>
            <Route path="/plant/:id">
              <PlantDetails />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
