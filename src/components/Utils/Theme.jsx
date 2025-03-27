import React from "react";
import "./Theme.css";
function Theme(props) {

  return (
    <a
      className={
        props.theme === "dark"
          ? "container-theme dark-theme"
          : "container-theme light-theme"
      }
      onClick={props.toggleTheme}
    ></a>
  );
}

export default Theme;
