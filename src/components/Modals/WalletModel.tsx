import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import WalletConnectLogo from "../../../public/assets/wallet/Blue (Default)/Logo.svg";
import EckoWalletLogo from "../../../public/assets/wallet/eckowallet1.svg";
import ZelcoreWalletLogo from "../../../public/assets/wallet/zelcore-logo.svg";
import KoalaWalletLogo from "../../../public/assets/wallet/koala.svg";
import ChainweaverWalletLogo from "../../../public/assets/wallet/chainweaver.png";
import BannerImage from "../../../public/assets/images/pact-img.png";
import Image from "next/image";
import { useWalletConnectClient } from "@/contexts/WalletConnectContext";
import { getAccounts, openZelcore } from "../../utils/zelcore";
import { useAccountContext } from "../../contexts";
import { NETWORKID } from "../../constants/contextConstants";
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
  MenuItem,
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

export default function WalletModal() {
  const { session, connect, disconnect, isInitializing } =
    useWalletConnectClient();
  const account = useAccountContext();
  console.log(account, "account");
  const [open, setOpen] = React.useState(false);
  const [accounts, setAccounts] = useState<any>();
  const [address, setAddress] = useState<string>("");
  const [successWalletAddress, setSuccessWalletAddress] = useState<string>("");
  const [zelcoreAccounts, setZelcoreAccounts] = useState<[string] | []>([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [approved, setApproved] = useState(false);
  const [openChainModal, setOpenChainModal] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConnect = () => {
    connect();
    handleClose();
  };

  const getAccountsFromWallet = async () => {
    console.log("getAccountsFromWallet");
    openZelcore();
    const getAccountsResponse = await getAccounts();
    console.log(getAccountsResponse, "getAccountsResponse");
    if (getAccountsResponse.status === "success") {
      setSuccessWalletAddress(getAccountsResponse.data);
      setApproved(true);
      setAccounts(getAccountsResponse.data);
      setOpen(false);
      toast.success("Zelcore Wallet Connected Successfully");
    } else {
      /* walletError(); */
    }
  };
  // useEffect(() => {
  //   async function fetchData() {
  //     await getAccountsFromWallet();
  //   }
  //   fetchData();
  // }, []);

  const handleZelcoreOpen = async () => {
    getAccountsFromWallet();
  };

  const eckoWalletConnect = async () => {
    // const checkNetwork = await window.kadena.request({
    //   method: "kda_getNetwork",
    // });
    console.log("ddddddddddd");
    // const checkNetwork = await (window as any).kadena.request({ method: "kda_getNetwork" });
    // console.log(checkNetwork, "checkNetwork");

    const checkNetwork = await (window as any).kadena.request({
      method: "kda_getNetwork",
    });
    console.log(checkNetwork, "checkNetwork");
    if (checkNetwork?.name === "Testnet" || checkNetwork?.name === "Mainnet") {
      console.log("Testnet");
      const response = await (window as any).kadena.request({
        method: "kda_connect",
        networkId: NETWORKID,
      });
      console.log(response, "response");
      if (response?.status === "success") {
        const account = await (window as any).kadena.request({
          method: "kda_checkStatus",
          networkId: NETWORKID,
        });
        console.log(account, "account");
        if (account?.status === "success") {
          setSuccessWalletAddress(response.account.account);
          setAccounts(account.data);
          setOpen(false);
          toast.success("Ecko Wallet Connected Successfully");
        }
      }
    }
  };

  const koalaWalletConnect = async () => {
    const response = await (window as any).koala.request({
      method: "kda_connect",
      networkId: NETWORKID,
    });
    console.log(response, "response");
    if (response?.status === "success") {
      setSuccessWalletAddress(response.wallet.account);
      setAccounts(account.data);
      setOpen(false);
      toast.success("Koala Wallet Connected Successfully");

      // const account = await (window as any).koala.request({
      //   method: "kda_checkStatus",
      //   networkId: NETWORKID,
      // });
      // console.log(account, "account");
      // if (account?.status === "success") {
      //   setAccounts(account.data);
      //   setOpen(false);
      //   toast.success("Koala Wallet Connected Successfully");
      // }
    }
  };

  console.log(accounts, "accounts");

  const handleConnectChainweaver = async () => {
    const data = await account.setVerifiedAccount(address);
    console.log(data, "data");
    if (data?.status === "success") {
      setSuccessWalletAddress(data.data.account);
      setOpen(false);
      setOpenChainModal(false);
      toast.success("Chainweaver Connected Successfully");
    }
  };

  const modalOpen = () => {
    setOpenChainModal(true);
  };

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      {/* <StyledButton onClick={handleOpen}>
        <span>Wallet Connect</span>
      </StyledButton> */}
      <motion.div whileHover={{ scale: 1.1 }}>
        <StyledButton onClick={handleOpen}>
          <span>
            {/* Wallet Connect */}
            {successWalletAddress ? successWalletAddress : "Connect Wallet"}
          </span>
        </StyledButton>
      </motion.div>

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
                    <Button onClick={eckoWalletConnect}>
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
                    <Button onClick={koalaWalletConnect}>
                      <Image
                        src={KoalaWalletLogo}
                        alt="Ecko Wallet"
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
                        alt="Zelcore Wallet"
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
        <CustomBox sx={{ width: 400 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Select Account
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedAccount}
              label="Select Account"
              onChange={(e: SelectChangeEvent) =>
                setSelectedAccount(e.target.value)
              }
            >
              {accounts?.map((account: any, index: number) => (
                <MenuItem key={index} value={account}>
                  {account}
                </MenuItem>
              ))}
            </Select>
            <Button onClick={handleConnectChainweaver}>Connect</Button>
            <Button onClick={() => setOpenChainModal(false)}>Back</Button>
          </FormControl>
        </CustomBox>
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
    </div>
  );
}
