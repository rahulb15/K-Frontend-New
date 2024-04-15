"use client";
import { memo } from "react";
import Link from "next/link";
import {
  Box,
  styled,
  Avatar,
  Hidden,
  MenuItem,
  IconButton,
  keyframes,
  useMediaQuery,
  Button,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import { NotificationProvider } from "../contexts/NotificationContext";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import Badge from "@mui/material/Badge";

//theme toggle icon
import { Brightness4, Brightness7 } from "@mui/icons-material";

import useAuth from "../hooks/useAuth";

import { Span } from "../components/Typography";
import { MatMenu, MatSearchBox } from "../components";
import { NotificationBar } from "../components/NotificationBar";
import WalletModal from "../components/Modals/WalletModel";
import { topBarHeight, themeLight, themeDark } from "../utils/constant";

import {
  Home,
  Menu,
  Person,
  Settings,
  WebAsset,
  MailOutline,
  StarOutline,
  PowerSettingsNew,
} from "@mui/icons-material";

// STYLED COMPONENTS
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 8,
  borderRadius: 8,
  color: theme.palette.primary.contrastText,
  "&:hover": { background: "rgba(255, 255, 255, 0.1)" },
  [theme.breakpoints.down("md")]: { display: "none !important" },
}));

// const StyledButton = styled(Button)(({ theme }) => ({
//   padding: 8,
//   borderRadius: 8,
//   color: theme.palette.primary.contrastText,
//   "&:hover": { background: "rgba(255, 255, 255, 0.1)" },
//   [theme.breakpoints.down("md")]: { display: "none !important" },
//   background: "rgba(255, 255, 255, 0.1)",
// }));

const TopbarRoot = styled("div")({
  top: 0,
  zIndex: 96,
  height: topBarHeight,
  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
});

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: { paddingLeft: 16, paddingRight: 16 },
  [theme.breakpoints.down("xs")]: { paddingLeft: 14, paddingRight: 16 },
}));

const UserMenu = styled(Box)({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  "& span": { margin: "0 8px" },
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary },
}));

const IconBox = styled("div")(({ theme }) => ({
  display: "inherit",
  [theme.breakpoints.down("md")]: { display: "none !important" },
}));

const Header = () => {
  const { logout, user } = useAuth();
  const [mode, setMode] = React.useState("light");
  const [cartItems, setCartItems] = React.useState([
    "Apple",
    "Banana",
    "Orange",
  ]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = React.useMemo(
    () =>
      createTheme({
        ...(mode === "light" ? themeLight : themeDark),
        // Additional theme configuration
      }),
    [mode]
  );

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };




  return (
    <ThemeProvider theme={theme}>
      <TopbarRoot>
        <TopbarContainer>
          <Box display="flex">
            <IconBox>
              <StyledIconButton>
                {/* <Image
                  src="/assets/images/logo-white.svg"
                  alt="logo"
                  width={150}
                  height={150}
                /> */}
              </StyledIconButton>
            </IconBox>
          </Box>

          <Box display="flex" alignItems="center">
            <MatSearchBox />

            {/* <StyledButton>
              <Span>Wallet Connect</Span>
            </StyledButton> */}
            <WalletModal />

            <MatMenu
              menuButton={
                <IconButton>
                  {/* <ShoppingCartIcon /> */}
                  {cartItems.length === 0 && <ShoppingCartIcon />}
                  {cartItems.length > 0 && (
                    <Badge badgeContent={cartItems.length} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  )}
                </IconButton>
              }
            >
              {cartItems.length === 0 ? (
                <MenuItem>Your cart is empty</MenuItem>
              ) : (
                cartItems.map((item, index) => (
                  <MenuItem key={index}>
                    {item}
                    <IconButton onClick={() => removeFromCart(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </MenuItem>
                ))
              )}
            </MatMenu>

            <NotificationProvider>
              <NotificationBar />
            </NotificationProvider>

            {/* <ShoppingCart /> */}
            <IconButton onClick={toggleTheme}>
              {mode === "light" ? <Brightness4 /> : <Brightness7 />}
            </IconButton>

            {/* <MatMenu
              menuButton={
                <UserMenu>
                  <Hidden xsDown>
                  </Hidden>
                  <Avatar
                    src={"/assets/images/admin.png"}
                    alt="user photo"
                    variant="rounded"
                    sx={{ cursor: "pointer", width: 32, height: 32 }}
                  />
                </UserMenu>
              }
            >
              <StyledItem>
                <Link href="/">
                  <Home />
                  <Span>Home</Span>
                </Link>
              </StyledItem>

              <StyledItem>
                <Link href="/profile">
                  <Person />
                  <Span>Profile</Span>
                </Link>
              </StyledItem>

              <StyledItem>
                <Settings />
                <Span>Settings</Span>
              </StyledItem>

              <StyledItem onClick={logout}>
                <PowerSettingsNew />
                <Span>Logout</Span>
              </StyledItem>
            </MatMenu> */}
          </Box>
        </TopbarContainer>
      </TopbarRoot>
    </ThemeProvider>
  );
};

export default memo(Header);
