import React from "react";
import auth from "../services/authService";
import Form from "./common/form";
import Joi from "joi-browser";
import * as userService from "../services/userService";

class RegisterForm extends Form {
  state = {
    data: { username: "", password: "", name: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().email().required().label("Username"),
    password: Joi.string().min(5).required().label("Password"),
    name: Joi.string().required().label("Name"),
  };

  doSubmit = async () => {
    try {
      const { headers } = await userService.register(this.state.data); //headers的資訊在response.headers裏面（後端要先設定headers可以access的值才行，詳細見後端的users model）
      auth.loginWithJwt(headers["x-auth-token"]);
      window.location = "/"; //回到主頁並整個網站重新載入
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        //這裡唯一可能的錯誤是email already registered
        const errors = { ...this.state.errors };
        errors.username = ex.response.data; //error message在response.data裏面
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("name", "Name")}
          {this.renderButton("註冊")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
