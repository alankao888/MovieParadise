import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };
  validate = () => {
    const options = {
      abortEarly: false, //abortEarly=true會讓有不valid的值時就跳出，無法validate所有值，所以把它設定為false
    };
    const result = Joi.validate(this.state.data, this.schema, options);
    const { error } = result;
    if (!error) return null;
    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value }; //[name]的寫法可以讓這個key值用變數name來傳入
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault(); //防止預設行為重新載入所有頁面
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    //e.currentTarget找出變動的那個element,這裡只用到currentTarget，把它解構然後重命名成input
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };
  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;
    return (
      <Input
        name={name}
        label={label}
        type={type}
        errors={errors[name]}
        value={data[name]}
        onChange={this.handleChange}
      />
    );
  };
  renderSelect = (name, label, options) => {
    const { data, errors } = this.state;
    return (
      <Select
        name={name}
        label={label}
        errors={errors[name]}
        onChange={this.handleChange}
        value={data[name]}
        options={options}
      />
    );
  };

  renderButton = (label) => (
    <button disabled={this.validate()} className="btn btn-primary">
      {label}
    </button>
  );
}

export default Form;
