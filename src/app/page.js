"use client";

import { useState, useEffect } from "react";

import { MainCard } from "./components/MainCard";
import { ContentBox } from "./components/ContentBox";
import { Header } from "./components/Header";
import { DateAndTime } from "./components/DateAndTime"
import { Search } from "./components/Search";
import { MetricsBox } from "./components/MetricsBox";
import { UnitSwitch } from "./components/UnitSwitch";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorScreen } from "./components/ErrorScreen";



import styles from "/src/app/page.module.css";

const App = () => {

  const [cityInput, setCityInput] = useState("");
  const [triggerFetch, setTriggerFetch] = useState(true);
  const [weatherData, setWeatherData] = useState();
  const [unitSystem, setUnitSystem] = useState("metric");

  useEffect(() => {
    //Parse a URL param to get a city if it exists
    const params = new URLSearchParams(window.location.search);
    const city = params.get('city') || params.get("City");

    if (city){
      setCityInput(city);
      setTriggerFetch(true);
    } else {
      setCityInput("Dublin, IE");
      setTriggerFetch(true);
    }
  }, []);

  useEffect(() => {
    if (triggerFetch) {
      const getData = async () => {
        const res = await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cityInput }),
        });
        const data = await res.json();
        setWeatherData({ ...data });
        setTriggerFetch(false); // Reset the trigger
      };
      getData();
    }
  }, [triggerFetch, cityInput]);


  console.log(weatherData);

  const ChangeSystem = () =>
    unitSystem == "metric"
      ? setUnitSystem("imperial")
      : setUnitSystem("metric");



  return weatherData && !weatherData.message ? (
    <div className={styles.wrapper}>
      <MainCard
        city={weatherData.name}
        country={weatherData.sys.country}
        description={weatherData.weather[0].description}
        iconName={weatherData.weather[0].icon}
        unitSystem={unitSystem}
        weatherData={weatherData}
        />
      <ContentBox>
        <Header>
          <DateAndTime weatherData={weatherData} unitSystem={unitSystem} />
          <Search
            placeHolder="Search a city..."
            value={cityInput}
            onFocus={(e) => {
              e.target.value = "";
              e.target.placeholder = "";
            }}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={(e) => {
              e.keyCode === 13 && setTriggerFetch(!triggerFetch);
              e.target.placeholder = "Search a city...";
            }}
          />
        </Header>
        <MetricsBox weatherData={weatherData} unitSystem={unitSystem} />
        <UnitSwitch onClick={ChangeSystem} unitSystem={unitSystem} />
      </ContentBox>
    </div>
   
  ) : weatherData && weatherData.message ? (
    <ErrorScreen errorMessage="City not found, try again!">
        <Search 
          onFocus={(e) => (e.target.value = "")}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={(e) => e.keyCode === 13 && setTriggerFetch(!triggerFetch)}
          />
    </ErrorScreen>
  ) : (
    <LoadingScreen loadingMessage="Loading data..."/>
  );
};

export default App;