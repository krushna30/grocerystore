import "./App.css";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import React, { useState } from "react";
import Footer from "./component/layout/Footer/Footer";
import { useEffect } from "react";
import Home from "./component/Home/Home.js";
import Products from "./component/Product/Products.js";
import ProductDetails from "./component/Product/ProductDetails";
import Search from "./component/Product/Search.js";
import history from "./history";
import LoginSignUp from "./component/User/LoginSignUp";
// import Loader from "./component/layout/Loader/Loader";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import Payment from "./component/Cart/Payment.js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
function App() {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  return (
    <Router history={history}>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        {/* Protected Routes */}
        <Route
          exact
          path="/account"
          element={!loading && isAuthenticated ? <Profile /> : <LoginSignUp />}
        />
        <Route
          exact
          path="/me/update"
          element={
            !loading && isAuthenticated ? <UpdateProfile /> : <LoginSignUp />
          }
        />
        <Route
          exact
          path="/password/update"
          element={
            !loading && isAuthenticated ? <UpdatePassword /> : <LoginSignUp />
          }
        />
        <Route
          exact
          path="/password/forgot"
          element={!loading ? <ForgotPassword /> : <LoginSignUp />}
        />
        <Route
          exact
          path="/login/shipping"
          element={!loading && isAuthenticated ? <Shipping /> : <LoginSignUp />}
        />
        <Route
          exact
          path="/order/confirm"
          element={
            !loading && isAuthenticated ? <ConfirmOrder /> : <LoginSignUp />
          }
        />
        <Route
          exact
          path="/orders"
          element={!loading && isAuthenticated ? <MyOrders /> : <LoginSignUp />}
        />

        <Route
          exact
          path="/success"
          element={
            !loading && isAuthenticated ? <OrderSuccess /> : <LoginSignUp />
          }
        />

        <Route
          exact
          path="/order/:id"
          element={
            !loading && isAuthenticated ? <OrderDetails /> : <LoginSignUp />
          }
        />

        <Route
          exact
          path="/process/payment"
          element={
            stripeApiKey && (
              <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
              </Elements>
            )
          }
        />

        {/*  Admin routes */}
        <Route
          exact
          path="/admin/dashboard"
          element={
            !loading && isAuthenticated && user.role === "admin" ? (
              <Dashboard />
            ) : (
              <LoginSignUp />
            )
          }
        />

        <Route
          exact
          path="/admin/products"
          element={
            !loading && isAuthenticated && user.role === "admin" ? (
              <ProductList />
            ) : (
              <LoginSignUp />
            )
          }
        />

        <Route
          exact
          path="/admin/product"
          element={
            !loading && isAuthenticated && user.role === "admin" ? (
              <NewProduct />
            ) : (
              <LoginSignUp />
            )
          }
        />
        <Route
          exact
          path="/admin/orders"
          element={
            !loading && isAuthenticated && user.role === "admin" ? (
              <OrderList />
            ) : (
              <LoginSignUp />
            )
          }
        />

        <Route
          exact
          path="/admin/product/:id"
          element={
            !loading && isAuthenticated && user.role === "admin" ? (
              <UpdateProduct />
            ) : (
              <LoginSignUp />
            )
          }
        />

        <Route
          exact
          path="/admin/order/:id"
          element={
            !loading && isAuthenticated && user.role === "admin" ? (
              <ProcessOrder />
            ) : (
              <LoginSignUp />
            )
          }
        />

        <Route
          exact
          path="/admin/users"
          element={
            !loading && isAuthenticated && user.role === "admin" ? (
              <UsersList />
            ) : (
              <LoginSignUp />
            )
          }
        />

        <Route
          exact
          path="/admin/user/:id"
          element={
            !loading && isAuthenticated && user.role === "admin" ? (
              <UpdateUser />
            ) : (
              <LoginSignUp />
            )
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
