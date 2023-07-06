import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";
import axios from "axios";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

export const WatchListItem = (props) => {
  const [options, updateOptions] = useState([]);
  const [data, setData] = useState([]);
  async function getData(tick) {
    axios
      .get(
        "https://finnhub.io/api/v1/quote?symbol=" +
          tick +
          "&token=c90l3oiad3ia4mbs7if0"
      )
      .then((response) => {
        const data = response.data;
        // console.log("data=", data);
        if (data) {
          setData({
            tick,
            ...data,
          });
        }
      });
  }
  useEffect(() => {
    getData(props.tick);
    // setInterval(() => getData(props.tick), 10000);
  }, [props.tick]);

  return (
    <tr>
      <td className="tick-flex">
        {props.tick}
        {data.d <= 0 ? (
          <ArrowDropDownIcon style={{ color: "red", fontSize: "1.6em" }} />
        ) : (
          <ArrowDropUpIcon style={{ color: "lightgreen", fontSize: "1.6em" }} />
        )}
      </td>
      <td>{data.h}</td>
      <td>{data.l}</td>
      <td>{data.o}</td>
      <td>{data.c}</td>
      <td
        style={{
          whiteSpace: "nowrap",
          width: "0.1%",
          textAlign: "center",
          color: "red",
        }}
      >
        {props.flag == "watch" ? (
          <HighlightOffIcon
            style={{ cursor: "pointer" }}
            onClick={() => {
              props.removeTick(props.tick);
            }}
          />
        ) : (
          <AddCircleRoundedIcon
            style={{ cursor: "pointer", color: "lightblue" }}
            onClick={() => {
              props.add(props.tick);
            }}
          />
        )}
      </td>
    </tr>
  );
};
