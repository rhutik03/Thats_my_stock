import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";

export const NewsCard = (props) => {
  const [data, setData] = useState([]);
  async function getData(tick) {

    const date = new Date();

    let day = date.getDate();
    day = day<=9 ? "0"+day : day;
    let month = date.getMonth() + 1;
    month = month<=9 ? "0"+month : month
    let year = date.getFullYear();

    let currentDate = `${year}-${month}-${day}`;

    date.setDate(date.getDate()-14);

    day = date.getDate();
    day = day<=9 ? "0"+day : day;
    month = date.getMonth() + 1;
    month = month<=9 ? "0"+month : month
    year = date.getFullYear();

    let date1wAgo = `${year}-${month}-${day}`;

    let query= `https://finnhub.io/api/v1/company-news?symbol=${tick}&from=${date1wAgo}&to=${currentDate}&token=cieptdhr01qg5n3cavq0cieptdhr01qg5n3cavqg`
    console.log(query);
    console.log("bruh");
    axios
      .get(
        query    
      )
      .then((response) => {

        const dataSpliced = response.data.splice(1, 6);
        setData(dataSpliced.filter((ele) => ele.image));
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response);
        }
      });
  }

  useEffect(() => {
    getData(props.tick);
  }, [props.tick]);

  return (
    <Row xs={1} md={3} className="g-4" style={{marginTop:"5px",marginBottom:"5px"}}>
      {data.map((obj, idx) => (
        <Col key={idx}>
          <Card className="news-card">
            <Card.Img className="card-image" variant="top" style={{height:"25%"}} src={obj.image} />
            <Card.Body className="news-card-body">
              <Card.Title>{obj.headline}</Card.Title>
              <Card.Text id="clamped">{obj.summary}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <a href={obj.url}>
                Read More
              </a>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
