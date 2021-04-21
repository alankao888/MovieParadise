import React, { Component } from "react";

class HeartButton extends Component {
  render() {
    let classes = "fa fa-heart";
    if (!this.props.liked) classes += "-o";
    return (
      <i
        onClick={this.props.onClick}
        className={classes}
        style={{ cursor: "pointer" }} //讓鼠標停在上面時出現手指
      />
    );
  }
}

export default HeartButton;
