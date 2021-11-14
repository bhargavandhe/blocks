import { ImportContactsRounded } from "@mui/icons-material";
import { Container, Stack, Card, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Page from "src/components/Page";
import { getLogs } from "src/helpers/database";

function Logs() {
  const [logs, setLogs] = useState([]);
  const uid = localStorage.getItem("uid");

  useEffect(async () => {
    const temp = await getLogs(uid);
    setLogs(temp.reverse());
  }, []);

  function Log(log) {
    const _log = log.log;
    const date = new Date(_log.time);

    return (
      <Card style={{ padding: 24, margin: 8 }}>
        <Grid container alignItems="center">
          <Grid item sm={1} style={{ paddingLeft: 32 }}>
            <ImportContactsRounded />
          </Grid>
          <Grid item sm={11}>
            <Stack>
              <Typography variant="h6">{_log.message}</Typography>

              <Typography variant="caption">{`${date.toDateString()}, ${date.toLocaleTimeString(
                "en-US"
              )}`}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    );
  }

  return (
    <Page title="Dashboard | Logs">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Recent Activity
        </Typography>
        {logs.length > 0 ? (
          logs.map((log) => <Log log={log} />)
        ) : (
          <Typography>Loading ...</Typography>
        )}
      </Container>
    </Page>
  );
}

export default Logs;
