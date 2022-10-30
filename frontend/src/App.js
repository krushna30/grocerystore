import "./App.css";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import Footer from "./component/layout/Footer/Footer";
import { useEffect } from "react";
import Home from "./component/Home/Home.js";
import Products from "./component/Product/Products.js";
import ProductDetails from "./component/Product/ProductDetails"
import Search from "./component/Product/Search.js";
import history from "./history";
import LoginSignUp from "./component/User/LoginSignUp";
// import Loader from "./component/layout/Loader/Loader";
import store from "./store";
import {loadUser} from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js"
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
//import ProtectedRoute from "./component/Route/ProtectedRoute";
function App() {

  const { loading,isAuthenticated ,user } = useSelector(state => state.user);
  
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });


    store.dispatch(loadUser());
  }, []);

  return (
    <Router history={history}>
      <Header />
      { isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp />} />
       <Route exact path="/account" element={ !loading && isAuthenticated  ? <Profile /> :<LoginSignUp /> } />
      {/* <Route exact path="/account" element={            <ProtectedRoute >
              <Profile />
            </ProtectedRoute>
} /> */}
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
