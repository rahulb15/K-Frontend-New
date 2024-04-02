"use client";
import { useState, Fragment } from "react";
import { Icon, IconButton, styled } from "@mui/material";

import { Search, Close } from "@mui/icons-material";

import { topBarHeight } from "../utils/constant";

// STYLED COMPONENTS
const SearchContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 9,
  width: "100%",
  display: "flex",
  alignItems: "center",
  height: topBarHeight,
  background: theme.palette.primary.main,
  color: theme.palette.text.primary,
  "&::placeholder": {
    color: theme.palette.text.primary,
  },
}));

const SearchInput = styled("input")(({ theme }) => ({
  width: "100%",
  border: "none",
  outline: "none",
  fontSize: "1rem",
  paddingLeft: "20px",
  height: "calc(100% - 5px)",
  background: theme.palette.primary.main,
  color: theme.palette.text.primary,
  "&::placeholder": { color: theme.palette.text.primary },
}));

export default function MatSearchBox() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  return (
    <Fragment>
      {!open && (
        <IconButton onClick={toggle}>
          <Search />
        </IconButton>
      )}

      {open && (
        <SearchContainer>
          <SearchInput type="text" placeholder="Search here..." autoFocus />
          <IconButton onClick={toggle} sx={{ mx: 2, verticalAlign: "middle" }}>
            <Close />
          </IconButton>
        </SearchContainer>
      )}
    </Fragment>
  );
}
