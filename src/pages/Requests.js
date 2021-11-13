import Page from "../components/Page";
import {
  CheckCircleOutlineRounded,
  HighlightOffRounded,
} from "@mui/icons-material";
import {
  Card,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { popRequest, sendKYC } from "../helpers/database";
import { db } from "src/fire";

//

// ----------------------------------------------------------------------

export default function Requests() {
  const [user, setUser] = useState({ incomingRequests: {} });
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    console.log("fetching");
    db.collection("users")
      .doc(uid)
      .get()
      .then((res) => {
        console.log(res.data());
        setUser(res.data());
      });
  }, []);

  function Request({ to }) {
    function agree() {
      sendKYC(uid, to);
    }

    function disagree() {
      console.log("pop", uid);
      popRequest(uid);
    }

    return (
      <Grid container alignItems="center">
        <Grid item sm={10}>
          <Typography variant="h6">{to}</Typography>
        </Grid>
        <Grid item sm={1}>
          <IconButton onClick={agree}>
            <CheckCircleOutlineRounded />
          </IconButton>
        </Grid>
        <Grid item sm={1}>
          <IconButton onClick={disagree}>
            <HighlightOffRounded />
          </IconButton>
        </Grid>
      </Grid>
    );
  }

  return (
    <Page title="Dashboard | Requests">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Requests
        </Typography>
        <Card style={{ padding: 32 }}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            {user != {} &&
              Object.keys(user.incomingRequests).map((req) => {
                return <Request to={req} />;
              })}
          </Stack>
        </Card>
      </Container>
    </Page>
  );
}
