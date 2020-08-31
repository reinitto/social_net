import React, { useState, useRef, Fragment } from "react";
import {
  IconButton,
  Popper,
  ClickAwayListener,
  ListItem,
  List,
  makeStyles,
} from "@material-ui/core";
import rejectFriendRequest from "../../utils/friends/rejectFriendRequest";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const buttonSideMenuStyles = makeStyles((theme) => {
  console.log("theme", theme);
  return {
    menuItem: {
      background: theme.palette.background.paper,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: theme.palette.grey[200],
      borderRadius: 4,
    },
  };
});

export const ActionButtonSideMenu = ({
  friendId,
  buttonText = "",
  menuPlacement = "top",
}) => {
  const [open, setOpen] = useState(false);
  const [buttonTextAndColor, setButtonTextAndColor] = useState([
    buttonText,
    "",
  ]);
  const menuRef = useRef(null);
  const classes = buttonSideMenuStyles();
  const handleMenu = () => {
    setOpen(!open);
  };
  const closeMenu = () => {
    setOpen(false);
  };
  const rejectRequest = async () => {
    const { error } = await rejectFriendRequest(friendId);
    if (error) {
      setButtonTextAndColor(["Action Failed", "error"]);
      setTimeout(setButtonTextAndColor([buttonText, ""]), 3000);
    } else {
      setButtonTextAndColor(["Success", ""]);
    }
  };
  return (
    <Fragment>
      <IconButton
        aria-label="friendhip request options"
        aria-haspopup="true"
        onClick={handleMenu}
        ref={menuRef}
      >
        <ArrowDropDownIcon />
      </IconButton>
      <Popper open={open} anchorEl={menuRef.current} placement={menuPlacement}>
        <ClickAwayListener onClickAway={closeMenu}>
          <List>
            <ListItem
              className={classes.menuItem}
              button
              onClick={rejectRequest}
              color={buttonTextAndColor[1]}
            >
              {buttonTextAndColor[0]}
            </ListItem>
          </List>
        </ClickAwayListener>
      </Popper>
    </Fragment>
  );
};

export default ActionButtonSideMenu;
