"use client";
import { Fragment, useState, Children } from "react";
import { Menu, ThemeProvider, styled, useTheme } from "@mui/material";

// STYLED COMPONENT
const MenuButton = styled("div")(({ theme }) => ({
  display: "inline-block",
  color: theme.palette.text.primary,
  "& div:hover": { backgroundColor: theme.palette.action.hover },
}));

export default function MatMenu(props) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const children = Children.toArray(props.children);
  let { shouldCloseOnItemClick = true, horizontalPosition = "left" } = props;

  const handleClose = () => setAnchorEl(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);

  return (
    <Fragment>
      <MenuButton onClick={handleClick}>{props.menuButton}</MenuButton>
      <ThemeProvider theme={theme}>
        <Menu
          elevation={8}
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={handleClose}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "bottom", horizontal: horizontalPosition }}
          transformOrigin={{ vertical: "top", horizontal: horizontalPosition }}
        >
          {children.map((child, index) => (
            <div
              onClick={shouldCloseOnItemClick ? handleClose : () => {}}
              key={index}
            >
              {child}
            </div>
          ))}
        </Menu>
      </ThemeProvider>
    </Fragment>
  );
}
