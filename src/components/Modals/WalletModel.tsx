import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import Link from "next/link";
import WalletConnectLogo from "../../../public/assets/wallet/Blue (Default)/Logo.svg";
import EckoWalletLogo from "../../../public/assets/wallet/eckowallet1.svg";
import ZelcoreWalletLogo from "../../../public/assets/wallet/zelcore-logo.svg";
import KoalaWalletLogo from "../../../public/assets/wallet/koala.svg";
import ChainweaverWalletLogo from "../../../public/assets/wallet/chainweaver.png";
import BannerImage from "../../../public/assets/images/pact-img.png";
import Image from "next/image";
import { useAccountContext } from "@/contexts";
import { getAccounts, openZelcore } from "../../utils/zelcore";
import { useWalletConnectClient } from "@/contexts/WalletConnectContext";
import { useEckoWallletClient } from "@/contexts/EckoWalletContext";
import { useKoalaWallletClient } from "@/contexts/KoalaWalletContext";
import { NETWORKID } from "../../constants/contextConstants";
import userService from "@/services/user.service";
import { getBalance } from "@/utils/api/pact";
import { MatMenu, MatSearchBox } from "../../components";
import GoogleIcon from "@mui/icons-material/Google";

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
console.log(NETWORKID, "NETWORKID");
import { toast } from "react-toastify";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import {
  Box,
  styled,
  Avatar,
  Hidden,
  IconButton,
  keyframes,
  useMediaQuery,
  Button,
  TextField,
} from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// Define the rotating gradient animation
const rotate = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Define the gradient colors
const gradientColors =
  "linear-gradient(to right, #f44336, #e91e63, #9c27b0, #673ab7, #3f51b5, #2196f3, #03a9f4, #00bcd4, #009688, #4caf50, #8bc34a, #cddc39, #ffeb3b, #ffc107, #ff9800, #ff5722)";

const StyledButton = styled(Button)(({ theme }) => ({
  padding: 8,
  borderRadius: 8,
  color: theme.palette.primary.contrastText,
  background: "rgba(255, 255, 255, 0.1)", // Set a semi-transparent background for the button
  border: "2px solid transparent", // Set an initial transparent border
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#fff",
    textShadow: "0 0 8px #0f0",
    borderColor: "transparent", // Remove the initial transparent border
    backgroundClip: "padding-box", // Ensure the background stays within the border
    boxShadow: `0 0 10px 5px ${theme.palette.primary.main}`,
    border: "2px solid transparent", // Add a transparent border
    backgroundImage: gradientColors, // Apply the gradient colors to the border
    backgroundOrigin: "border-box", // Ensure the gradient applies to the border
    backgroundSize: "400% 400%",
    animation: `${rotate} 15s ease infinite`,
  },
  [theme.breakpoints.down("md")]: {
    display: "none !important",
  },
}));

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

const WalletsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "& button": {
    margin: "0 8px",
  },
}));

const CustomBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  bgcolor: "background.paper",
  border: "2px solid #5755FE",
  p: 4,
  borderRadius: 8,
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
  background: "#7AA2E3",
  boxShadow: "0 0 10px 5px #5755FE",
  padding: 16,
  textAlign: "center",
  "&:hover": {
    boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.2)",
  },
  "& h6": {
    color: theme.palette.primary.main,
    fontWeight: "bold",
  },
  "& p": {
    color: theme.palette.primary.dark,
  },
  "& button": {
    marginTop: 16,
  },
}));

const InnserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& button": {
    margin: "0 8px",
  },
}));

const UserMenu = styled(Box)({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  "& span": { margin: "0 8px" },
});

export default function WalletModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { session, connect, disconnect, isInitializing, accounts } =
    useWalletConnectClient();
  const { eckoWalletConnect, eckoSuccessWalletAddress, eckoAccounts } =
    useEckoWallletClient();
  const { koalaWalletConnect, koalaSuccessWalletAddress, koalaAccounts } =
    useKoalaWallletClient();
  const account = useAccountContext();
  const [open, setOpen] = useState(false);
  const [openZelcoreModal, setOpenZelcoreModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [successWalletAddress, setSuccessWalletAddress] = useState<string>("");
  const [zelcoreAccounts, setZelcoreAccounts] = useState<[string] | []>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [approved, setApproved] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [balance, setBalance] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openChainModal, setOpenChainModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [userSelectionFor2FA, setUserSelectionFor2FA] = useState(false);
  const [secret, setSecret] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConnect = () => {
    connect();
    handleClose();
  };
  const [qrImage, setQrImage] = useState("");

  const checkUser = async (address: string) => {
    const user = await userService.getUser(
      address.length > 0 ? address : "null"
    );
    if (user?.data?.status === "success") {
      console.log(user, "user");
      if (user?.data?.data?.is2FAEnabled) {
        enable2FA();
      }
      return;

      // localStorage.setItem("token", user.data.token);
      // localStorage.setItem("address", user.data.data.walletAddress);
      // setSuccessWalletAddress(user.data.data.walletAddress);
      // setOpenRegisterModal(false);
      // setIsModalOpen(false);
    } else {
      setOpenRegisterModal(true);
    }
  };

  const getBalanceLocal = async (address: string) => {
    const balance = await getBalance(address);
    console.log(balance, "balance");
    setBalance(balance || 0);
    // return balance;
  };
  console.log(balance, "balance");

  useEffect(() => {
    const address = localStorage.getItem("address") || "";
    if (address?.length > 0) {
      checkUser(address);
      getBalanceLocal(address);
    }
  }, []);

  const registerUser = async () => {
    const user: any = await userService.register({
      walletAddress: successWalletAddress,
      email: email,
      name: firstName,
    });
    if (user?.data?.status === "success") {
      toast.success("User Registered Successfully");
      localStorage.setItem("token", user.data.token);
      setOpenRegisterModal(false);
      setIsModalOpen(false);
      localStorage.setItem("address", successWalletAddress);
      setUserSelectionFor2FA(true);
    } else {
      toast.error(user.data.message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // setLoading(true);
    await registerUser();
  };

  const getAccountsFromWallet = async () => {
    openZelcore();
    const getAccountsResponse = await getAccounts();
    console.log(getAccountsResponse, "getAccountsResponse");

    // {
    //   data: Array(12) [
    //     'k:be8f86f55b1eb1114b273709af2c39e7376a4e3eab101b4f5abe7e85088fce1a', 'be8f86f55b1eb1114b273709af2c39e7376a4e3eab101b4f5abe7e85088fce1a',
    //     'k:cf9eb79200aa590ba4d642cca9bb75ae40bca52462ed250651d4b0bd2315aa1d', 'cf9eb79200aa590ba4d642cca9bb75ae40bca52462ed250651d4b0bd2315aa1d',
    //     'k:3e4ff7eccc2d6a58fc6cc5baa5fd6bcfa85914a67907d6e856758cd0fd4d07a3', '3e4ff7eccc2d6a58fc6cc5baa5fd6bcfa85914a67907d6e856758cd0fd4d07a3',
    //     'k:e2f0e0b97c55b3c844556cb972d8ff5ed4bb465d9f07f94723faa8254a20d846', 'e2f0e0b97c55b3c844556cb972d8ff5ed4bb465d9f07f94723faa8254a20d846',
    //     'k:f1dc9e400b1084e742103588b87a5aa250992c026010fddd2339ef210ffdf749', 'f1dc9e400b1084e742103588b87a5aa250992c026010fddd2339ef210ffdf749',
    //     'k:68744014be82389ca15ae093e520eeee0c785aec11948c7695d6c56954398b73', '68744014be82389ca15ae093e520eeee0c785aec11948c7695d6c56954398b73'
    //   ],
    //   status: 'success'
    // }
    if (getAccountsResponse.status === "success") {
      // setSuccessWalletAddress(getAccountsResponse.data);
      // setApproved(true);
      setZelcoreAccounts(getAccountsResponse.data);
      setOpen(false);
      setOpenZelcoreModal(true);
      // toast.success("Zelcore Wallet Connected Successfully");
    } else {
      /* walletError(); */
    }
  };

  const handleZelcoreOpen = async () => {
    getAccountsFromWallet();
  };

  const onEckoWalletConnect = async () => {
    setLoading(true);
    setIsModalOpen(false);
    const response = await eckoWalletConnect();
    if (response?.status === "success") {
      console.log(response, "response");
      setSuccessWalletAddress(response.account.account);
      setOpen(false);
      toast.success("Ecko Wallet Connected Successfully");
      setLoading(false);
      checkUser(response.account.account);
    }
  };

  const handleConnectChainweaver = async () => {
    const data = await account.setVerifiedAccount(address);
    console.log(data, "data");
    if (data?.status === "success") {
      setSuccessWalletAddress(data.data.account);
      setOpen(false);
      setOpenChainModal(false);
      checkUser(data.data.account);
      toast.success("Chainweaver Connected Successfully");
    }
  };

  const modalOpen = () => {
    setOpenChainModal(true);
  };

  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  useEffect(() => {
    // 'kadena:mainnet01:a1a5cc2c40ce6e96906426314998cd1c639f6a24ea96dc512d369d2e6dcb170a'

    if (accounts && accounts.length > 0) {
      setSuccessWalletAddress(`k:${accounts[0]?.split(":")[2]}`);
      localStorage.setItem("accountType", "walletconnect");
      checkUser(`k:${accounts[0]?.split(":")[2]}`);
    }
  }, [accounts]);

  const onKoalaWalletConnect = async () => {
    setLoading(true);
    setIsModalOpen(false);
    const response = await koalaWalletConnect();
    if (response?.status === "success") {
      console.log(response, "response");
      setSuccessWalletAddress(response.account.account);
      setOpen(false);
      toast.success("Koala Wallet Connected Successfully");
      setLoading(false);
      checkUser(response.account.account);
    }
  };

  const googleLoginClick = () => {
    //api call https://api.example.com/auth/google

    const googleLoginUrl = "http://localhost:5000/auth/google";

    window.location.href = googleLoginUrl;
  };

  // useEffect(() => {
  //   //api call /check-sessions
  //   const checkSession = async () => {
  //     const response = await fetch(
  //       "http://localhost:5000/check-session",
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     console.log(data, "data");
  //   };
  //   checkSession();
  // }, []);

  const enable2FA = async () => {
    const token = localStorage.getItem("token");
    console.log(token, "token");
    const response = await userService.enable2FA(token || "");
    console.log(response, "response");
    if (response?.data?.status === "success") {
      setQrImage(response.data.data.qrCodeUrl);
      setSecret(response.data.data.secret);
      setIsTwoFactorModalOpen(true);
    }
  };

  const verify2FA = async (code: string) => {
    const data = {
      token: code,
      secret,
    };
    const response = await userService.verify2FA(data);
    console.log(response, "response");
    if (response?.data?.status === "success") {
      // setSuccessWalletAddress(response.data.data.walletAddress);
      // setOpenRegisterModal(true);
      setIsTwoFactorModalOpen(false);
      setUserSelectionFor2FA(false);
      toast.success("Login Successfully");
    }else{
      toast.error("Invalid Code");
    }
  };

  console.log(successWalletAddress, "successWalletAddress");
  console.log(qrImage, "qrImage");
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      {/* <StyledButton onClick={handleOpen}>
        <span>Wallet Connect</span>
      </StyledButton> */}
      <motion.div whileHover={{ scale: 1.1 }}>
        {/* <StyledButton onClick={handleOpen}>
          <span>
            {successWalletAddress
              ? `${successWalletAddress.slice(
                  0,
                  6
                )}...${successWalletAddress.slice(-4)}`
              : "Connect Wallet"}
          </span>
        </StyledButton> */}
        {successWalletAddress.length > 0 ? (
          // <Button onClick={() => setDropdownOpen(!dropdownOpen)}>
          //   {successWalletAddress
          //     ? `${successWalletAddress.slice(
          //         0,
          //         6
          //       )}...${successWalletAddress.slice(-4)}`
          //     : "Connect Wallet"}
          // </Button>
          <MatMenu
            menuButton={
              <UserMenu>
                <Hidden xsDown></Hidden>
                {/* <Avatar
                    src={"/assets/images/admin.png"}
                    alt="user photo"
                    variant="rounded"
                    sx={{ cursor: "pointer", width: 32, height: 32 }}
                  /> */}
                <Button
                  sx={{
                    color: "white",
                    textTransform: "none",
                    fontSize: 16,
                    fontWeight: 600,
                    borderRadius: 24,
                    background: "#5755FE",
                    padding: "8px 16px",
                  }}
                >
                  {successWalletAddress
                    ? `${successWalletAddress.slice(
                        0,
                        6
                      )}...${successWalletAddress.slice(-4)}`
                    : "Connect Wallet"}
                </Button>
              </UserMenu>
            }
          >
            {/* <StyledItem>
                <Link href="/">
                  
                </Link>
              </StyledItem> */}

            <StyledItem>
              <Link href="/profile">
                <Person />
                <span>Profile</span>
              </Link>
            </StyledItem>

            <StyledItem>
              <Settings />
              <span>Settings</span>
            </StyledItem>

            <StyledItem
              onClick={() => {
                if (localStorage.getItem("accountType") === "walletconnect") {
                  disconnect();
                }
                localStorage.removeItem("accountType");
                localStorage.removeItem("token");
                localStorage.removeItem("address");

                setSuccessWalletAddress("");
                setDropdownOpen(false);
              }}
            >
              <PowerSettingsNew />
              <span>Logout</span>
            </StyledItem>
          </MatMenu>
        ) : (
          // <StyledButton onClick={enable2FA}>
          <StyledButton onClick={handleOpen}>
            <span>Connect Wallet</span>
          </StyledButton>
        )}
      </motion.div>
      {/* DropDown */}
      {dropdownOpen && (
        <Box
          sx={{
            position: "absolute",
            top: 50,
            right: 0,
            zIndex: 999,
            background: "#fff",
            padding: 16,
            boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.2)",
            borderRadius: 8,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 16 }}>
            {successWalletAddress}
          </Typography>
          <Button
            onClick={() => {
              localStorage.removeItem("address");
              setSuccessWalletAddress("");
              setDropdownOpen(false);
            }}
          >
            Disconnect
          </Button>
        </Box>
      )}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open && openChainModal === false}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        {/* <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Fade> */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CustomBox>
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 1,
                right: 1,
                color: "red",
                zIndex: 999,
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: "transparent",
                  color: "red",
                }}
              >
                X
              </Avatar>
            </IconButton>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" component="h2" sx={{ mt: 4 }}>
                Connect Wallet
              </Typography>

              <Typography sx={{ mt: 2 }} variant="h6" component="h2">
                Connect your wallet to access your account
              </Typography>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ marginTop: 36 }}
            >
              <InnserBox>
                <motion.div
                  //rotate the image on hover
                  whileHover={{ rotate: 360 }}
                  whileTap={{ rotate: 0 }}
                >
                  <Image
                    src={BannerImage}
                    alt="Pact"
                    width={250}
                    height={250}
                  />
                </motion.div>

                <Box
                  sx={{
                    borderLeft: "1px solid #ccc",
                    height: 200,
                    margin: "0 56px",
                  }}
                ></Box>
                <WalletsBox>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button onClick={handleConnect}>
                      <Image
                        src={WalletConnectLogo}
                        alt="Wallet Connect"
                        width={80}
                        height={80}
                      />
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button onClick={onEckoWalletConnect}>
                      <Image
                        src={EckoWalletLogo}
                        alt="Ecko Wallet"
                        width={80}
                        height={80}
                      />
                    </Button>
                  </motion.div>
                </WalletsBox>
                <WalletsBox>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button onClick={onKoalaWalletConnect}>
                      <Image
                        src={KoalaWalletLogo}
                        alt="Koala Wallet"
                        width={80}
                        height={80}
                      />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button onClick={getAccountsFromWallet}>
                      <Image
                        src={ZelcoreWalletLogo}
                        alt="Zelcore Wallet"
                        width={80}
                        height={80}
                      />
                    </Button>
                  </motion.div>
                </WalletsBox>
                <WalletsBox>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button onClick={modalOpen}>
                      <Image
                        src={ChainweaverWalletLogo}
                        alt="Chainweaver Wallet"
                        width={80}
                        height={80}
                      />
                    </Button>
                  </motion.div>
                </WalletsBox>
              </InnserBox>
            </motion.div>
          </CustomBox>
        </motion.div>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open && openChainModal === true}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        {/* inputfield */}
        <CustomBox sx={{ width: 400 }}>
          <div>
            <TextField
              id="outlined-basic"
              label="Enter Account"
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button onClick={handleConnectChainweaver}>Connect</Button>
            <Button onClick={() => setOpenChainModal(false)}>Back</Button>
          </div>
        </CustomBox>
      </Modal>

      {/* Register Modal with emailaddress and name */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openRegisterModal}
        onClose={() => setOpenRegisterModal(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <CustomBox>
          <IconButton
            onClick={() => setOpenRegisterModal(false)}
            sx={{
              position: "absolute",
              top: 1,
              right: 1,
              color: "red",
              zIndex: 999,
            }}
          >
            <Avatar
              sx={{
                backgroundColor: "transparent",
                color: "red",
              }}
            >
              X
            </Avatar>
          </IconButton>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h2" sx={{ mt: 4 }}>
              Register
            </Typography>
            <Typography sx={{ mt: 2 }} variant="h6" component="h2">
              Register your account
            </Typography>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ marginTop: 36 }}
          >
            <form onSubmit={handleSubmit}>
              <TextField
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Email Address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit">Register</Button>
            </form>

            {/* //google login */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button onClick={googleLoginClick}>
                <GoogleIcon />
                Google Login
              </Button>
            </div>
          </motion.div>
        </CustomBox>
      </Modal>

      {/* Zelcore Modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openZelcoreModal}
        onClose={() => setOpenZelcoreModal(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <CustomBox>
          <IconButton
            onClick={() => setOpenZelcoreModal(false)}
            sx={{
              position: "absolute",
              top: 1,
              right: 1,
              color: "red",
              zIndex: 999,
            }}
          >
            <Avatar
              sx={{
                backgroundColor: "transparent",
                color: "red",
              }}
            >
              X
            </Avatar>
          </IconButton>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h2" sx={{ mt: 4 }}>
              Select Account
            </Typography>
            <Typography sx={{ mt: 2 }} variant="h6" component="h2">
              Select your account
            </Typography>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ marginTop: 36 }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Account</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedAccount}
                label="Account"
                onChange={(e: SelectChangeEvent) =>
                  setSelectedAccount(e.target.value)
                }
              >
                {zelcoreAccounts.map((account, index) => (
                  <MenuItem key={index} value={account}>
                    {account}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              onClick={() => {
                setSuccessWalletAddress(selectedAccount);
                setOpenZelcoreModal(false);
                checkUser(selectedAccount);
              }}
            >
              Connect
            </Button>
          </motion.div>
        </CustomBox>
      </Modal>

      {/* 2FA Modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isTwoFactorModalOpen}
        onClose={() => setIsTwoFactorModalOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <CustomBox>
          <IconButton
            onClick={() => setIsTwoFactorModalOpen(false)}
            sx={{
              position: "absolute",
              top: 1,
              right: 1,
              color: "red",
              zIndex: 999,
            }}
          >
            <Avatar
              sx={{
                backgroundColor: "transparent",
                color: "red",
              }}
            >
              X
            </Avatar>
          </IconButton>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h2" sx={{ mt: 4 }}>
              2FA
            </Typography>
            <Typography sx={{ mt: 2 }} variant="h6" component="h2">
              Enter the code from your authenticator app
            </Typography>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ marginTop: 36 }}
          >
            <img src={qrImage} alt="QR Code" />
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ marginTop: 36 }}
          >
            <TextField
              id="outlined-basic"
              label="Enter Code"
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button onClick={() => verify2FA(address)}>Verify</Button>
          </motion.div>
        </CustomBox>
      </Modal>

      {/* Modal for as to enable 2fa or skip */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={userSelectionFor2FA}
        onClose={() => setUserSelectionFor2FA(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <CustomBox>
          <IconButton
            onClick={() => setUserSelectionFor2FA(false)}
            sx={{
              position: "absolute",
              top: 1,
              right: 1,
              color: "red",
              zIndex: 999,
            }}
          >
            <Avatar
              sx={{
                backgroundColor: "transparent",
                color: "red",
              }}
            >
              X
            </Avatar>
          </IconButton>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h2" sx={{ mt: 4 }}>
              2FA
            </Typography>
            <Typography sx={{ mt: 2 }} variant="h6" component="h2">
              Enable 2FA for more security
            </Typography>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ marginTop: 36 }}
          >
            <Button onClick={enable2FA}>Enable 2FA</Button>
            <Button onClick={() => setUserSelectionFor2FA(false)}>Skip</Button>
          </motion.div>
        </CustomBox>
      </Modal>
    </div>
  );
}
