import React from "react";

const Input = ({ name, label, errors, ...others }) => {
  //可以用{,...others}的形式把上面傳入的其他props用相同的形式放入input中(例：<input {...others} />)
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>

      <input name={name} id={name} className="form-control" {...others} />

      {errors && <div className="alert alert-danger">{errors}</div>}
    </div>
  );
};

export default Input;
