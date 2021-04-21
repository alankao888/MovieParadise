import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";

class LoginForm extends Form {
  //直接從Form繼承來各種method，只留下login特定的資料
  state = {
    data: { username: "", password: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label("Username"), //label可以讓錯誤訊息顯示出label指定的名字，而不是key的名字
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      await auth.login(this.state.data.username, this.state.data.password);
      const { state } = this.props.location; //看location裏有沒有state屬性（有沒有存入先前的網址，有的話表示是被redirect來的，登入完就把它送回原網址）
      window.location = state ? state.from.pathname : "/";
      //用window.location來設定導向的網址並整個網站重新載入（這樣App裏componentDidMount才會載入user資訊）
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data; //error message在response.data裏面
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("登入")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
