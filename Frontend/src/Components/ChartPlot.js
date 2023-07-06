import React, { Component, useContext, useState, useEffect } from "react";
// import CanvasJSReact from "../Assets/canvasjs.stock.react";
import { UserChosen } from "../App";
import getAPI from "../Utils/api";

// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

export const ChartPlot = () => {
  const { chosen } = useContext(UserChosen);
  const [isLoaded, changeLoad] = useState(false);
  const [dataPoints1, dp1] = useState([]);
  const [dataPoints2, dp2] = useState([]);
  const [dataPoints3, dp3] = useState([]);
  const [options, setOptions] = useState({});
  const containerProps = {
    width: "100%",
    height: "400px",
    margin: "auto",
  };

  useEffect(() => {
    console.log("changed chosen-", chosen);
    // changeLoad(false);

    fetch(
      "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +
        chosen +
        "&apikey=" +
        getAPI()
    )
      .then((res) => {
        console.log(chosen, "code-", res.status);
        return res.json();
      })
      .then((data) => {
        var dps1 = [],
          dps2 = [],
          dps3 = [];
        const parsedData = data["Time Series (Daily)"];
        for (var key in parsedData) {
          //   console.log(key);

          dps1.push({
            x: new Date(key),
            y: [
              Number(parsedData[key]["1. open"]),
              Number(parsedData[key]["2. high"]),
              Number(parsedData[key]["3. low"]),
              Number(parsedData[key]["4. close"]),
            ],
          });
          dps2.push({
            x: new Date(key),
            y: Number(parsedData[key]["5. volume"]),
          });
          dps3.push({
            x: new Date(key),
            y: Number(parsedData[key]["4. close"]),
          });
        }
        // console.log(dps1);
        dp1(dps1);

        dp2(dps2);
        dp3(dps3);
      });

    setOptions({
      theme: "dark",

      charts: [
        {
          axisX: {
            lineThickness: 5,
            tickLength: 0,
            labelFormatter: function (e) {
              return "";
            },
            crosshair: {
              enabled: true,
              snapToDataPoint: true,
              labelFormatter: function (e) {
                return "";
              },
            },
          },
          axisY: {
            title: "",
            prefix: "$",
            tickLength: 0,
          },
          toolTip: {
            shared: true,
          },
          data: [
            {
              name: chosen + " Price (in USD)",
              yValueFormatString: "$#,###.##",
              type: "candlestick",
              dataPoints: dataPoints1,
            },
          ],
        },
        {
          height: 100,
          axisX: {
            crosshair: {
              enabled: true,
              snapToDataPoint: true,
            },
          },
          axisY: {
            title: "Volume",
            prefix: "$",
            tickLength: 0,
          },
          toolTip: {
            shared: true,
          },
          data: [
            {
              name: "Volume",
              yValueFormatString: "$#,###.##",
              type: "column",
              dataPoints: dataPoints2,
            },
          ],
        },
      ],
      navigator: {
        data: [
          {
            dataPoints: dataPoints3,
          },
        ],
        slider: {
          minimum: new Date("2018-05-01"),
          maximum: new Date("2018-07-01"),
        },
      },
    });
    // console.log(dataPoints3);

    changeLoad(true);
  }, [chosen]);

  return (
    <div>
      <div>
        {!isLoaded && <div className="fetching">Fetching Data ...</div>}
        {
          // Reference: https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator
          // isLoaded && (
          //   <CanvasJSStockChart
          //     containerProps={containerProps}
          //     options={options}
          //   /* onRef = {ref => this.chart = ref} */
          //   />
          // )
        }
      </div>
    </div>
  );
};

export default ChartPlot;
