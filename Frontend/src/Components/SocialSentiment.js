import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";

import { Bar } from "react-chartjs-2";
import { UserChosen } from "../App";
Chart.register(...registerables);
export const SocialSentiment = () => {
  const { wl } = useContext(UserChosen);
  const [sentData, setData] = useState([
    {
      tick: "TSLA",
      mentions: 9245,
    },
    {
      tick: "GOOGL",
      mentions: 1910,
    },
    {
      tick: "MSFT",
      mentions: 3617,
    },
    {
      tick: "AMZN",
      mentions: 2254,
    },
    {
      tick: "TWTR",
      mentions: 2745,
    },
    {
      tick: "AAPL",
      mentions: 2828,
    },
    { tick: "FB", mentions: 1240 },
  ]);
  const [ticks, setTicks] = useState([]);
  const [chat, setChat] = useState([]);
  async function getData(watchlist) {
    let arr = [];
    watchlist.forEach((tick) => {
      axios
        .get(
          "https://finnhub.io/api/v1/stock/social-sentiment?symbol=" +
            tick +
            "&token=c90l3oiad3ia4mbs7if0"
        )
        .then((response) => {
          const data = response.data;
          console.log(data);

          const red = data.reddit;
          const twit = data.twitter;
          let mentions = 0;
          red.forEach((ele) => {
            mentions += ele.mention;
          });
          twit.forEach((ele) => {
            mentions += ele.mention;
          });
          arr.push({ tick, mentions });
          const obj = { tick, mentions };
        });
    });
  }
  useEffect(async () => {
    console.log("use effect");
  }, [wl]);

  return (
    <>
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>
        Social Media Sentiment
      </h3>
      <div>
        <Bar
          datasetIdKey="id"
          options={{
            indexAxis: "y",
            backgroundColor: "#333",
            layout: {
              padding: {
                top: 0,
                bottom: 10,
              },
            },
          }}
          data={{
            labels: sentData.map((e) => {
              console.log(e.tick);
              return e.tick;
            }),
            datasets: [
              {
                id: 1,
                label: "Twitter and Reddit Posts",
                data: sentData.map((e) => {
                  return e.mentions;
                }),
              },
            ],
          }}
        />
      </div>
    </>
  );
};
