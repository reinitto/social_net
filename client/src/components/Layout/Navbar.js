import React, { useState, useRef } from "react";
import { CssBaseline } from "@material-ui/core";

import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import { appName } from "../../constants";
import {
  Typography,
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Menu,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useUser } from "../../context/user";
import { useConversations } from "../../context/conversations";

const useStyles = makeStyles((theme) => {
  return {
    menuButton: {
      marginRight: theme.spacing(2),
    },
    link: {
      flexGrow: 1,
      textTransform: "capitalize",
      textDecoration: "none",
      color: theme.palette.common.black,
    },
    title: {
      color: theme.palette.primary.contrastText,
    },
  };
});

function Navbar() {
  const classes = useStyles();
  const { user, setUser, logoutUser } = useUser();
  const { disconnectSocket } = useConversations();
  let anchorEl = useRef(null);
  const [open, setOpen] = useState(false);

  const handleMenu = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const logout = async () => {
    const url = "/api/auth/logout";
    await fetch(url);
    logoutUser();
    disconnectSocket();
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" className={`${classes.link} ${classes.title}`}>
            <Typography variant="h6">{appName.replace("-", " ")}</Typography>
          </Link>
          {user && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                ref={anchorEl}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl.current}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link className={classes.link} to="/account">
                    My account
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link className={classes.link} to={`/profile/${user.id}`}>
                    Profile
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link className={classes.link} to={`/friends`}>
                    Friends
                  </Link>
                </MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
