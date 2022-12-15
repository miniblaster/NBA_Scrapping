import React, { useEffect, useState } from "react";
import axios from "axios";
import cheerio from "cheerio";
import 'bootstrap/dist/css/bootstrap.css';

import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [quarter, setQuarter] = useState(10);
  const [current, setCurrent] = useState("00:00");
  const [elapsed, setElapsed] = useState(0);
  const [team1, setTeam1] = useState(0);
  const [team2, setTeam2] = useState(0);
  const [flag, setFlag] = useState(false);

  const quarterChange = (e) => {
    setQuarter(e.target.value);
  }

  const urlChange = (e) => {
    let temp = e.target.value;
    setUrl(temp.substr(23, temp.length-23));
  }

  const handleStart = (e) => {
    if (url === "") {
      alert("Please input the match url...");
      return;
    }
    setFlag(!flag);
  }
  
  useEffect(() => {
    while (flag) {
      const interval = setInterval(() => {
        const getCurrent = async () => {
          try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const current = $("div.matchScore > span").text();
            setCurrent(current.trim());
            $('div.scoresDetails .content .active').each((_idx, el) => {
              const score = $(el).text();
              if (_idx === 0)  setTeam1(parseInt(score));
              if (_idx === 2)  setTeam2(parseInt(score));
            });
          } catch (error) {
            throw error;
          }
        };
        getCurrent();
      }, 2000);

      return () => clearInterval(interval)
    }
  }, [flag, url]);

  useEffect(() => {
    let currentTime = current.substring(3);
    let currentMin = parseInt(currentTime.substring(0, 2));
    let currentSec = parseInt(currentTime.substring(3));
    let elapsed1 = quarter * 60 - currentMin * 60 - currentSec;
    setElapsed(elapsed1);
  }, [current, quarter, team1, team2]);

  return (
    <div className="App mt-5">
      <h4> Hi, Michael. You can contact me via </h4>
      <h4> Gmail: minionboss0626@gmail.com, Telegram: Minion Boss, Skype: live:.cid.4caa89ed3d550b5c </h4>
      <hr />
      <h1> NBA calc </h1>
        <button className={flag ? "btn btn-warning": "btn btn-primary"} onClick={handleStart}> {flag ? "Stop Scraping" : "Start Scraping"} </button>
        <div className="section mt-4">
          <label htmlFor="url" className="mx-2"> Input the URL: </label>
          <input type="text" id="url" onChange={urlChange} />
        </div>
      <div className="m-auto" style={{width: "500px", textAlign: ""}}>
        <div className="section mt-4">
          <label htmlFor="quarter" className="mx-2"> Length of Quarter: </label>
          <input type="text" defaultValue={10} onChange={quarterChange} />
        </div>
        <div className="section mt-2">
          <label htmlFor=""> Current Time: <span> {flag === false ? "00:00" : current} </span> </label>
        </div>      
        <div className="section mt-2">
          <label htmlFor=""> Current Total Score for Quarter : <span> {flag === false ? 0 : team1 + team2} </span> </label>
        </div>
        <div className="section mt-2">
          <label htmlFor=""> Current Pace per minute : <span> {flag === false ? 0 : ((team1 + team2) / elapsed * 60).toFixed(4)} </span> </label>
        </div>           
        <div className="section mt-2">
          <label htmlFor=""> Current Projected Total Score : <span> {flag === false ? 0 : ((team1 + team2) / elapsed * 60).toFixed(4)} </span> </label>
        </div>   
        <div className="section mt-2">
          <label htmlFor=""> Time Elapsed: <span> {flag === false ? "0 min 0 sec" : Math.floor(elapsed / 60) + " min " + elapsed % 60 + " sec"} </span> </label>
        </div>
      </div>
    </div>
  );
}

export default App;
