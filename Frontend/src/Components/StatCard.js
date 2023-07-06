import React, { useContext, useEffect, useState } from "react";
import { Button, Row, Col, Container, Card, CardGroup } from "react-bootstrap";
import { UserChosen } from "../App.js";
import axios from "axios";

export const StatCard = (props) => {
  // console.log(UserChosen);

  const { chosen, changeChosen } = useContext(UserChosen);
  const [stock, changeData] = useState({
    c: 1090.305,
    d: 79.665,
    dp: 7.8826,
    h: 1096.57,
    l: 1053.6,
    o: 1065.1,
    pc: 1010.64,
    t: 1648490652,
  });

  async function getData(tick) {
    axios
      .get(
        "https://finnhub.io/api/v1/quote?symbol=" +
          tick +
          "&token=c90l3oiad3ia4mbs7if0"
      )
      .then((response) => {
        console.log(response);

        const data = response.data;
        if (data.c) {
          changeData(data);
          changeChosen(tick);
          console.log(data);
        }
      });
  }

  useEffect(() => {
    console.log("hehe nice it works");
    getData(chosen);
  }, [chosen]);

  return (
    <Row>
      <Col xs={12} md={12} lg={12}>
        <Card className="search-card" border="info">
          <Card.Header style={{ fontSize: "1.3em" }}>
            <Row>
              <Col sm={6}> $ {stock.c}</Col>
              <Col sm={6} style={{ textAlign: "right" }}>
                {chosen}
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="stat" style={{ padding: "10px 30px" }}>
            <Row>
              <Col sm={6}>Open</Col>
              <Col sm={6}>{stock.o}</Col>
            </Row>
            <Row>
              <Col sm={6}>High</Col>
              <Col sm={6}>{stock.h}</Col>
            </Row>
            <Row>
              <Col sm={6}>Low</Col>
              <Col sm={6}>{stock.l}</Col>
            </Row>
            <Row>
              <Col sm={6}>Previous Close</Col>
              <Col sm={6}>{stock.pc}</Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
