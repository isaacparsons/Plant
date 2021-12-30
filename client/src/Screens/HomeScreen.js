import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";
import PlantList from "../Components/PlantList/PlantList";

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: "auto",
    display: "flex",
    alignItems: "stretch",
    width: "100%",
    minHeight: "100vh",
  },
}));

const plantData = [
  {
    id: 1,
    name: "test plant1",
    environment: [
      {
        temperature: 20.0,
        humidity: 15.3,
      },
    ],
    soil: [
      {
        moisture: 34.0,
      },
    ],
    light: [],
  },
  {
    id: 2,
    name: "test plant2",
    environment: [
      {
        temperature: 20.0,
        humidity: 15.3,
      },
    ],
    soil: [
      {
        moisture: 34.0,
      },
    ],
    light: [],
  },
];

export const HomeScreen = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const onPlantPressed = (plantId) => {
    history.replace(`plant/${plantId}`);
  };

  return (
    <div className={classes.root}>
      <Container style={{ paddingTop: 20 }}>
        <Typography style={{ fontSize: 26 }}>Plants</Typography>
        <PlantList data={plantData} onPlantPressed={onPlantPressed} />
      </Container>
    </div>
  );
};

export default HomeScreen;
