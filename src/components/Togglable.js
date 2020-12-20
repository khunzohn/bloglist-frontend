import React, { useState, useImperativeHandle } from "react";

const Togglable = React.forwardRef((props, ref) => {
  const [loginVisible, setLoginVisible] = useState(false);

  const toggleLoginVisible = () => {
    setLoginVisible(!loginVisible);
  };

  useImperativeHandle(ref, () => {
    return { toggleLoginVisible };
  });

  if (loginVisible) {
    return (
      <div>
        {props.children}
        <button onClick={toggleLoginVisible}>Cancel</button>
      </div>
    );
  } else {
    return <button onClick={toggleLoginVisible}>{props.cta}</button>;
  }
});

export default Togglable;
