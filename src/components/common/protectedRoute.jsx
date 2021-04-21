import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../../services/authService";

const ProtectedRoute = ({ component: Component, render, ...others }) => {
  //component規定開頭要大寫，所以把它rename
  return (
    <Route
      {...others}
      render={(props) => {
        //Redirect的to可以傳入一個object,設定一些值，其中state的值會傳入到被導向的網址，存在this.props.location.state裏面
        if (!auth.getCurrentUser())
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }, //把redirect前的location信息命名為from存入state裏跟著前往新網址
              }}
            />
          );
        //傳入的只有兩種值：component或render，沒有component的話就用傳下來的render function
        return Component ? <Component {...props} /> : render(props);
      }}
    ></Route>
  );
};

export default ProtectedRoute;
