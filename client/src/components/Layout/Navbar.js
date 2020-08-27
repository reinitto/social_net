import React, { useState } from "react";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import { appName } from "../../constants";
import {
  Typography,
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  FormGroup,
  MenuItem,
  Menu,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useUser } from "../../context/user";

const useStyles = makeStyles((theme) => {
  console.log("theme", theme);
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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user, setUser } = useUser();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    const url = "/api/auth/logout";
    await fetch(url);
    setUser(null);
  };

  return (
    <div className={classes.root}>
      <FormGroup></FormGroup>
      <AppBar position="static">
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
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link className={classes.link} to="/account">
                    My account
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>Profile</MenuItem>
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
