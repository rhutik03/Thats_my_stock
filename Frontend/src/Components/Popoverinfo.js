import React from "react";
import { Popover,OverlayTrigger,Button } from "react-bootstrap";
import { LuInfo } from "react-icons/lu";


const Popoverinfo = (props) =>{
    
    const popover = ()=> {
        return (
        <Popover id="popover-basic" style={{zIndex:"0"}}>
          <Popover.Header as="h3">{props.header}</Popover.Header>
          <Popover.Body>
            {props.body}
          </Popover.Body>
        </Popover>
        )
    };
    
    
    return(
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover}><Button style={{backgroundColor:"transparent", border:"none"}}><LuInfo color="black"/></Button></OverlayTrigger>
    );
}

export default Popoverinfo;