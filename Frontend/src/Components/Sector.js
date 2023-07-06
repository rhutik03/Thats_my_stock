import React, { useState, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import getAPI from "../Utils/api";
Chart.register(...registerables);

export const Sector = () => {
  const [perData, setData] = useState([]);

  const url =
    "https://financialmodelingprep.com/api/v3/sectors-performance?apikey=" +
    getAPI();

  async function getData(tick) {
    console.log("bruh");
    axios.get(url).then((response) => {
      const array = response.data;
      console.log(array);
      setData(array);
    });
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>
        Sector Performance
      </h3>
      <Bar
        style={{ height: "300px" }}
        datasetIdKey="id"
        options={{
          indexAxis: "y",
          backgroundColor: "#333",
          layout: {
            padding: {
              top: 0,
              bottom: 30,
            },
          },
        }}
        data={{
          labels: perData.map((ele) => ele.sector),
          datasets: [
            {
              id: 1,
              label: " Percentage Change",
              data: perData.map((ele) => parseFloat(ele.changesPercentage)),
            },
          ],
        }}
      />
    </>
  );
};
