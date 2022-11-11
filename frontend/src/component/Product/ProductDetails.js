import React, { Fragment, useEffect, useState } from "react";
//import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { Rating } from "@material-ui/lab";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart } from "../../actions/cartAction";
import ReviewCard from "./ReviewCard"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";

import {
  clearErrors,
  getProductDetails,
  newReview,
} from "../../actions/productAction";
//import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import { useParams } from "react-router-dom";
const ProductDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const alert = useAlert();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const increaseQuantity = () => {
    if (product.Stock <= quantity) return;
    console.log("inc");
    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;
    console.log("dec");
    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Item Added To Cart");
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };
  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));

    setOpen(false);
  };
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(id));
    //     if (reviewError) {
    //       alert.error(reviewError);
    //       dispatch(clearErrors());
    //     }

    //     if (success) {
    //       alert.success("Review Submitted Successfully");
    //       dispatch({ type: NEW_REVIEW_RESET });
    //     }
   
  }, [dispatch, id, error, alert]);
  return (
    <Fragment>
      {loading || !product ? (
        <Loader />
      ) : (
          <Fragment>
            
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className="ProductDetails">
            <div>
            
              {/* {product.images[0].url && (
                    <img
                    className="CarouselImage"
                    key={1}
                    src={product.images[0].url}
                    alt={`Slide`}
                  />
              )} */}
                  {/* <img src={product.images[0].url} alt={product.name} /> */}
                
            </div>
            {/* carousel end */}
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>

              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                      <button onClick={decreaseQuantity}>-</button>
                   
                      {/* <input readOnly type="number" value={quantity} /> */}
                      <span> {quantity} </span>
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    disabled={product.Stock <= 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status: 
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock <= 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>
              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
            </div>
            </div>
            <h3 className="reviewsHeading">REVIEWS</h3>

            <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
            </Dialog>
            {/* {product.reviews && 
              <div> {product.reviews[0]}</div>} */}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
