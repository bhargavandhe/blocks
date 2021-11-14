import faker from "faker";
import PropTypes from "prop-types";
import { noCase } from "change-case";
import { useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { set, sub, formatDistanceToNow } from "date-fns";
import { Icon } from "@iconify/react";
import bellFill from "@iconify/icons-eva/bell-fill";
import clockFill from "@iconify/icons-eva/clock-fill";
import doneAllFill from "@iconify/icons-eva/done-all-fill";
// material
import { alpha } from "@mui/material/styles";
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from "@mui/material";
// utils
import { mockImgAvatar } from "../../utils/mockImages";
import { LOG_TYPES } from "../../helpers/logger";

// components
import Scrollbar from "../../components/Scrollbar";
import MenuPopover from "../../components/MenuPopover";
import { getLogs } from "src/helpers/database";

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">{notification.message}</Typography>
  );

  if (notification.type === LOG_TYPES.notification) {
    return {
      avatar: (
        <img
          alt={notification.message}
          src="/static/icons/ic_notification_package.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === LOG_TYPES.activity) {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_shipping.svg"
        />
      ),
      title,
    };
  }
  return {
    avatar: (
      <img
        alt={notification.title}
        src="/static/icons/ic_notification_shipping.svg"
      />
    ),
    title,
  };
}

function NotificationItem({ notification }) {
  const message = renderContent(notification);
  const date = new Date(notification.time);
  const route =
    notification.type == LOG_TYPES.request
      ? "/dashboard/requests"
      : "/dashboard/logs";

  return (
    <ListItemButton
      to={route}
      disableGutters
      component={RouterLink}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px",
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "background.neutral" }}>{message.avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={message.title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
            }}
          >
            <Box
              component={Icon}
              icon={clockFill}
              sx={{ mr: 0.5, width: 16, height: 16 }}
            />
            {`${date.toLocaleString()}`}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const uid = localStorage.getItem("uid");
  const [notifications, setNotifications] = useState([]);

  useEffect(async () => {
    const res = await getLogs(uid);
    console.log(res);
    var temp = [];
    for (const log of res) {
      console.log(log);
      if (
        log.type == LOG_TYPES.notification ||
        log.type == LOG_TYPES.shared ||
        log.type == LOG_TYPES.request
      )
        temp.push(log);
    }
    setNotifications(temp.reverse());
  }, []);

  return (
    <>
      <IconButton
        ref={anchorRef}
        size="large"
        color={open ? "primary" : "default"}
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.focusOpacity
              ),
          }),
        }}
      >
        <Badge color="error">
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
          </Box>

          <Tooltip title=" Mark all as read">
            <IconButton color="primary" onClick={() => {}}>
              <Icon icon={doneAllFill} width={20} height={20} />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { xs: 340, sm: "auto" } }}>
          <List disablePadding>
            {notifications.map((notification, index) => (
              <NotificationItem key={index} notification={notification} />
            ))}
          </List>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple component={RouterLink} to="#">
            View All
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
