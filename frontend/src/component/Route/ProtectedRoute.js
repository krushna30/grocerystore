import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import {Navigate, Route } from "react-router-dom";
// const ProtectedRoute = ({children}) => {
//   const { loading, isAuthenticated, user } = useSelector((state) => state.user);
//   return (
//     <Fragment>
//       {loading === false && (
//         <Route
//         //   {...rest}
//           render={(props) => {
//             if (isAuthenticated === false) {
//               return <Navigate to="/login" />;
//             }

//             // if (isAdmin === true && user.role !== "admin") {
//             //   return <Redirect to="/login" />;
//             // }

//             return children ;
//           }}
//         />
//       )}
//     </Fragment>
//   );
// };
const { loading, isAuthenticated, user } = useSelector((state) => state.user);
const ProtectedRoute = ({
   
    children,
  }) => {
    if (isAuthenticated === false) {
              return <Navigate to="/login" />;
    } 
  
    return children;
  };

export default ProtectedRoute;
