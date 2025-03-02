import React from "react";
import {SetBlock} from "./components"; 

export const createSetBlocks = (data: { id: number; setNum: number }[]) => {
  return data.map((item) => (
    <SetBlock id={0} repNum={item.setNum} onCountChange={()=>{}}/>
  ));
};
