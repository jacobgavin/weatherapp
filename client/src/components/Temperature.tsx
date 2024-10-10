import React, { Component } from 'react';


const Temperature = (props:any) => {
  let { style, children } = props
  return (
    <div className={style}>
      <span>{children}</span>
    </div>
  );
}


export default Temperature;
