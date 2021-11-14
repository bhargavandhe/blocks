import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
// material
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
// components
import Page from "../components/Page";
//
import { Box } from "@mui/system";
import { userData } from "src/helpers/userData";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

export default function User() {
  const [details, setDetails] = useState({
    uid: "",
    name: "",
    phone: "",
    address1: "",
    address2: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    pin: "",
    dob: "",
    gender: "",
    photo: "",
  });

  useEffect(async () => {
    setDetails(await userData);
  }, []);

  return (
    <Page title="Details">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            My Aadhar
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/update"
            startIcon={<Icon icon={plusFill} />}
          >
            Update
          </Button>
        </Stack>

        <Card style={{ padding: 32 }}>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item sm={9}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Aadhar number"
                    name="aadhar"
                    disabled
                    value={details.uid}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Name"
                    name="name"
                    disabled
                    value={details.name}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Date of birth"
                    name="dob"
                    disabled
                    value={details.dob}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Gender"
                    name="gender"
                    disabled
                    value={details.gender}
                  />
                </Grid>
                <Grid item sm={3}>
                  <img src={`data:image/png;base64,${details.photo}`} />
                </Grid>
              </Grid>
              <TextField
                margin="normal"
                fullWidth
                label="Phone"
                name="phone"
                disabled
                value={details.phone}
              />

              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Address 1"
                    name="address1"
                    disabled
                    value={details.address1}
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Address 2"
                    name="address2"
                    disabled
                    value={details.address2}
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Landmark"
                    name="lm"
                    disabled
                    value={details.landmark}
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Country"
                    name="country"
                    disabled
                    value={details.country}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="State"
                    name="state"
                    disabled
                    value={details.state}
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="PIN"
                    name="pin"
                    disabled
                    value={details.pin}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
