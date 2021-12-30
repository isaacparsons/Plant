import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";

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

export const HomeScreen = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="xl" style={{ paddingTop: 20 }}>
        <Typography>HELLO WORLD</Typography>
      </Container>
    </div>
  );
};

export default HomeScreen;
