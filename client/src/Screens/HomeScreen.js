import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Typography, Fab } from "@material-ui/core";
import PlantList from "../Components/PlantList/PlantList";
import { usePlants } from "../Context/PlantsContext";
import AddPlantModal from "../Components/AddPlantModal/AddPlantModal";
import api from "../Api/Backend";

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: "auto",
    display: "flex",
    alignItems: "stretch",
    width: "100%",
    minHeight: "100vh",
  },
}));

export const HomeScreen = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [addPlantModalOpen, setAddPlantModalOpen] = useState(false);
  const { plants } = usePlants();

  const onPlantPressed = (plantId) => {
    history.replace(`plant/${plantId}`);
  };

  const handleAddPlantPress = () => {
    setAddPlantModalOpen(true);
  };

  const handleAddPlant = async (plant) => {
    try {
      await api.createPlant(plant);
      setAddPlantModalOpen(false);
    } catch (error) {}
  };

  const handleModalClose = () => {
    setAddPlantModalOpen(false);
  };

  return (
    <div className={classes.root}>
      <Container style={{ paddingTop: 20 }}>
        <Typography style={{ fontSize: 26 }}>Plants</Typography>
        <PlantList data={plants} onPlantPressed={onPlantPressed} />
      </Container>
      <Fab color="primary" onClick={handleAddPlantPress} style={{ position: "fixed", bottom: 50, right: 50 }}></Fab>
      <AddPlantModal open={addPlantModalOpen} handleClose={handleModalClose} onAddPlant={handleAddPlant} />
    </div>
  );
};

export default HomeScreen;
