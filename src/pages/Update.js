import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
// material
import {
  Grid,
  Button,
  Container,
  Stack,
  Typography,
  TextField,
  Card,
} from "@mui/material";
// components
import Page from "../components/Page";
//
import POSTS from "../_mocks_/blog";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import {
  getBlockData,
  getDataFromFirebase,
  getResponses,
  getUserData,
  pushRequest,
  updateKYC,
} from "src/helpers/database";
import { userData } from "src/helpers/userData";

// ----------------------------------------------------------------------

export default function Update() {
  const [requestResponses, setRequestResponses] = useState({});
  const [ownerUID, setOwnerUID] = useState("");

  const [user, setUser] = useState({
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
  const [newUserData, setNewUserData] = useState(user);

  const handleInput = (event) => {
    setOwnerUID(event.target.value);
  };

  const handleUserData = (prop) => (event) => {
    setNewUserData({ ...newUserData, [prop]: event.target.value });
  };

  function handleRequest() {
    if (ownerUID && user.uid) {
      pushRequest(ownerUID, user.uid);
    }
  }

  useEffect(async () => {
    setUser(await userData);

    const res = await getResponses(localStorage.getItem("uid"));
    console.log(res);

    if (res && Object.keys(res).length > 0) {
      const blockData = await getBlockData(res.blockHash, res.privateKey);
      setRequestResponses(blockData);
      const _userData = await userData;
      console.log(_userData, blockData);
      setNewUserData({
        ..._userData,
        address1: blockData.address1,
        address2: blockData.address2,
        city: blockData.city,
        landmark: blockData.landmark,
        country: blockData.country,
        state: blockData.state,
        pin: blockData.pin,
      });
    }
  }, []);

  async function update() {
    const res = await getDataFromFirebase(user.uid);
    const privateKey = res.privateKey;
    updateKYC(newUserData, privateKey);
  }

  return (
    <Page title="Update Address">
      <Container>
        <Card style={{ padding: 32 }}>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {Object.keys(requestResponses).length == 0 ? (
              <>
                <Typography component="h1" variant="h5">
                  Enter the UID of Resident (House Owner)
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Aadhar number"
                    name="aadhar"
                    autoFocus
                    value={ownerUID}
                    onChange={handleInput}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleRequest}
                  >
                    Request Aadhar
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography component="h1" variant="h5">
                  Update your aadhar
                </Typography>

                <Box component="form" noValidate sx={{ mt: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item sm={9}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Aadhar number"
                        name="aadhar"
                        disabled
                        value={user.uid}
                      />
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Name"
                        name="name"
                        disabled
                        value={user.name}
                      />
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Date of birth"
                        name="dob"
                        disabled
                        value={user.dob}
                      />
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Gender"
                        name="gender"
                        disabled
                        value={user.gender}
                      />
                    </Grid>
                    <Grid item sm={3}>
                      <img src={`data:image/png;base64,${user.photo}`} />
                    </Grid>
                  </Grid>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Phone"
                    name="phone"
                    disabled
                    value={user.phone}
                  />
                  <Grid container spacing={2}>
                    <Grid item sm={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Address 1"
                        name="address1"
                        value={newUserData.address1}
                        onChange={handleUserData("address1")}
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Address 2"
                        name="address2"
                        value={newUserData.address2}
                        onChange={handleUserData("address2")}
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Landmark"
                        name="lm"
                        value={newUserData.landmark}
                        onChange={handleUserData("landmark")}
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Country"
                        name="country"
                        disabled
                        value={newUserData.country}
                        onChange={handleUserData("country")}
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
                        value={newUserData.state}
                        onChange={handleUserData("state")}
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="PIN"
                        name="pin"
                        value={newUserData.pin}
                        onChange={handleUserData("pin")}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => {
                    update();
                  }}
                >
                  Update
                </Button>
              </>
            )}
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
