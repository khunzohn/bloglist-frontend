import React from "react";
const Notification = (props) => {
  if(!props.notification) {
      return <div></div>
  }  
  let { error, message } = props.notification  
  let style = null
  if(error) {
      style = {
          border: '5px solid red',
          background: 'grey'
      }
  } else {
    style = {
        border: '5px solid green',
        background: 'grey'
    }
  }
  return (
    <div style={style}>
      {message}
    </div>
  );
};

export default Notification
