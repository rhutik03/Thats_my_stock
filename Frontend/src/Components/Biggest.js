import React, { useEffect, useState } from "react";
import axios from "axios";
import { ListGroup, ListGroupItem, Row, Col, Table } from "react-bootstrap";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import getAPI from "../Utils/api";

export const Biggest = (props) => {
  const [data, setData] = useState([]);
  const url =
    "https://financialmodelingprep.com/api/v3/stock_market/" +
    props.type +
    "?apikey=" +
    getAPI();

  async function getData(tick) {
    console.log("bruh");
    axios.get(url).then((response) => {
      const array = response.data;
      console.log(array[0]);
      setData(array.splice(1, 7));
    });
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <h2>Biggest {props.type}</h2>
      <Table striped bordered hover size="sm" variant="dark">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Change%</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ele) => (
            <tr>
              <td>
                {ele.symbol}{" "}
                {ele.change <= 0 ? (
                  <ArrowDropDownIcon
                    style={{ color: "red", fontSize: "1.6em" }}
                  />
                ) : (
                  <ArrowDropUpIcon
                    style={{ color: "lightgreen", fontSize: "1.6em" }}
                  />
                )}
              </td>
              <td>{ele.change}</td>
              <td>{ele.price}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
