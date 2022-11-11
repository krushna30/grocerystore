import {createStore, combineReducers, applyMiddleware } from "redux";
//import { legacy_createStore as createStore } from "redux";
import thunk from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";
import { productDetailsReducer, productsReducer  } from "./reducers/productReducer";
import { userReducer } from "./reducers/userReducer";
import { profileReducer } from "./reducers/userReducer";
import { forgotPasswordReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { newOrderReducer } from "./reducers/orderReducer";
import { myOrdersReducer } from "./reducers/orderReducer";
import { orderDetailsReducer } from "./reducers/orderReducer";
import { newProductReducer } from "./reducers/productReducer";
import { productReducer } from "./reducers/productReducer";
import { allOrdersReducer } from "./reducers/orderReducer";
import { orderReducer } from "./reducers/orderReducer";
import { allUsersReducer } from "./reducers/userReducer";
import { userDetailsReducer } from "./reducers/userReducer";
const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
   user: userReducer,
   profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
   newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  // newReview: newReviewReducer,
  newProduct: newProductReducer,
  product: productReducer,
 allOrders: allOrdersReducer,
 order: orderReducer,
   allUsers: allUsersReducer,
   userDetails: userDetailsReducer,
  // productReviews: productReviewsReducer,
  // review: reviewReducer,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};
const middleware = [thunk];
const store = createStore(  // it can be directly get imported from the redux
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;