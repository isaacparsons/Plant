import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Button, Typography, Box } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import Graph from "../Components/Graph/Graph";
import TemperatureThreshold from "../Components/TemperatureThreshold/TemperatureThreshold";
import MoistureThreshold from "../Components/MoistureThreshold/MoistureThreshold";
import LightThreshold from "../Components/LightThreshold/LightThreshold";

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: "auto",
    display: "flex",
    alignItems: "stretch",
    width: "100%",
    minHeight: "100vh",
  },
}));

// Main page containing a display of the followed assets and graphs and any active alerts

export const PlantDetails = (props) => {
  const classes = useStyles();
  const history = useHistory();
  let { id } = useParams();

  const onBackPressed = () => {
    history.replace(`/`);
  };

  return (
    <div className={classes.root}>
      <Container style={{ paddingTop: 20 }}>
        <Button onClick={onBackPressed}>Back</Button>
        <Typography>{`Plant Details ${id}`}</Typography>
        <Box display="flex" width={"100%"}>
          <Box display="flex" flexDirection={"column"} width={"50%"} margin={2}>
            <TemperatureThreshold />
            <MoistureThreshold />
          </Box>
          <Box display="flex" flexDirection={"column"} width={"50%"} margin={2}>
            <LightThreshold />
          </Box>
        </Box>
        <Graph title={"Temperature"} />
        <Graph title={"Humidity"} />
        <Graph title={"Soil"} />
        <Graph title={"Light"} />
      </Container>
    </div>
  );
};

export default PlantDetails;
