import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cart from "./Components/Cart";
import Home from "./Components/Home";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import ProductDescription from "./Components/ProductDescription";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import setProductsAction from "./Actions/SetProductsAction";
import SetCartFromLocalStorageAction from "./Actions/SetCartFromLocalStorageAction";
import AddedToCart from "./Components/AddedToCart";
import Login from "./Components/Login";
import { auth } from "./Firebase";
import setUserAction from "./Actions/setUserAction";
import SignedInAction from "./Actions/SignedInAction";
import CheckoutSuccess from "./Components/CheckoutSuccess";
import NotFound from "./Components/NotFound";
import SignUp from "./Components/SignUp";
import { useState } from "react";
import MessageContainer from "./Components/messagecontainer/messageContainer"
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { CloseOutlined } from "@material-ui/icons";
import CheckListPage from "./Components/checklist/CheckListPage"

const cartFromLocalStorage = JSON.parse(
  localStorage.getItem("cart") || '{"items":[],"count":0}'
);
const signedInFromLocalStorage = JSON.parse(
  localStorage.getItem("signedIn") || "false"
);

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    maxWidth: "lg",
    maxHeight: "lg",
    backgroundColor: "#f5f5f5",
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


function App() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const signedIn = useSelector((state) => state.signedIn);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  }

  useEffect(() => {
    const apiCall = async () => {
      const response = await axios("https://fakestoreapi.com/products");
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("signedIn", JSON.stringify(signedIn));
      dispatch(setProductsAction(response.data));
    };

    apiCall();
  }, [cart, dispatch, signedIn]);

  useEffect(() => {
    dispatch(SetCartFromLocalStorageAction(cartFromLocalStorage));
    dispatch(SignedInAction(signedInFromLocalStorage));
  }, [dispatch]);
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      const initialUserState = {
        uid: "",
        email: "",
        emailVerified: false,
        displayName: "",
        isAnonymous: false,
        providerData: [
          {
            providerId: "",
            uid: "",
            displayName: "",
            email: "",
            phoneNumber: null,
            photoURL: null,
          },
        ],
        stsTokenManager: {
          refreshToken: "",
          accessToken: "",
          expirationTime: 0,
        },
        createdAt: "",
        lastLoginAt: "",
        apiKey: "",
        appName: "[DEFAULT]",
      };

      if (authUser) {
        if (signedIn) {
          dispatch(setUserAction(authUser));
        } else {
          dispatch(setUserAction(initialUserState));
        }
      } else {
        dispatch(setUserAction(initialUserState));
      }
    });
  }, [dispatch, signedIn]);

  const [show, setShow] = useState(false);


  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NavBar chatShow={show} chatShowfunc={setShow} />
                {console.log(show)}
                <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={show}
        sx={{height:"650px", width:"750px", position:"absolute", top:"25%", left:"25%"}}
      >
        <DialogTitle sx={{ m: 0, p: 2, color: "grey"}} id="customized-dialog-title">
          SmartShop Alexa
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: "grey"
          }}
        >
          <CloseOutlined />
        </IconButton>
        <DialogContent dividers>
          <MessageContainer />
        </DialogContent>
      </BootstrapDialog>
              <Home />
              <Footer />
              </>
            }
          />
          <Route
            path="/Login"
            element={
              <>
                <Login />
              </>
            }
          />
          <Route
            path="/products"
            exact
            element={
              <>
                <NavBar props={[show, setShow]}/>
                {console.log(show)}
                {show ? <MessageContainer /> : <Home />}
                <Footer />
              </>
            }
          />
          <Route
            path="/products/:id"
            exact
            element={
              <>
                <NavBar />
                <ProductDescription />
                <Footer />
              </>
            }
          />
          <Route
            path="/Cart"
            element={
              <>
                <NavBar />
                <Cart />
                <Footer />
              </>
            }
          />
          <Route
            path="/products/:id/AddedToCart"
            exact
            element={
              <>
                <NavBar />
                <AddedToCart />
                <Footer />
              </>
            }
          />
          <Route
            path="/Checkout-success"
            exact
            element={
              <>
                <NavBar />
                <CheckoutSuccess />
                <Footer />
              </>
            }
          />
          <Route
            path="/SignUp"
            exact
            element={
              <>
                <SignUp />
              </>
            }
          />
          <Route
            path="*"
            exact
            element={
              <>
                <NotFound />
              </>
            }
          />
          <Route
            path="/CheckList"
            element={
              <>
                <NavBar />
                <CheckListPage />
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
