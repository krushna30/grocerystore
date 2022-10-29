import {createStore, combineReducers, applyMiddleware } from "redux";
//import { legacy_createStore as createStore } from "redux";
import thunk from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";
import { productDetailsReducer, productsReducer  } from "./reducers/productReducer";
import { userReducer } from "./reducers/userReducer";
const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
   user: userReducer,
  // profile: profileReducer,
  // forgotPassword: forgotPasswordReducer,
  // cart: cartReducer,
  // newOrder: newOrderReducer,
  // myOrders: myOrdersReducer,
  // orderDetails: orderDetailsReducer,
  // newReview: newReviewReducer,
  // newProduct: newProductReducer,
  // product: productReducer,
  // allOrders: allOrdersReducer,
  // order: orderReducer,
  // allUsers: allUsersReducer,
  // userDetails: userDetailsReducer,
  // productReviews: productReviewsReducer,
  // review: reviewReducer,
});

let initialState = {};
const middleware = [thunk];
const store = createStore(  // it can be directly get imported from the redux
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;