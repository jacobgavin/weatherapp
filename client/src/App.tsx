import { Component } from 'react';
import './App.css';
import Temperature from './components/Temperature';
import Loader from './components/Loader';
import { HistoryWeather } from './types';

class App extends Component<{}, {weather: HistoryWeather | undefined, meanTemp?:number, medianTemp?:number, minTemp?: number, maxTemp?: number}> {
  constructor(props: any) {
    super(props)
    this.state = {
      weather: undefined,
    }
  }
  componentDidMount() {
    this.getPastForecast(3)
  }

  getPastForecast(daysBack:number) {

    fetch("http://localhost:3001/api/getPastDay?day=" + daysBack + "&lat=57.708870&long=11.974560")
    .then(function(response) {
      return response.json()
    })
    .then((data) => {
      this.setState({ weather: data })
      this.setTemps(data)
    })
  }

  setTemps(weather:HistoryWeather) {
    const reducer = (accumulator:number, currentValue:number) => accumulator + currentValue;
    var minTemp:number = 0;
    var maxTemp:number = 0;

    const temperatures = weather.hourly.temperature_2m.filter(temp => temp !== null)
    temperatures.forEach((temperature, idx) => {
      /**
       * Start by calculating the min/max for each hour of the days
       */
      if(idx == 0) {
        minTemp = temperature
        maxTemp = temperature
      } else {
        if(temperature < minTemp) {
          minTemp = temperature
        }
        if(temperature > maxTemp) {
          maxTemp = temperature
        }
      }
    })
  
    const medianTemp = this.getMedianValue(temperatures);
    console.log({ medianTemp})
    this.setState({
      meanTemp: temperatures.reduce(reducer) / temperatures.length,
      medianTemp: medianTemp,
      minTemp: minTemp,
      maxTemp: maxTemp
    })
  }

  getMedianValue(temperatures:number[]) {
    if (temperatures.length === 0) {
      return 0
    }
    temperatures.sort()
    if(temperatures.length % 2 == 0) {
      // if we got an even number get the two in the middle.
      // add them together and divide by 2 to get the median
      const temp1 = temperatures[temperatures.length/2 - 1];
      const temp2 = temperatures[temperatures.length/2];
      return (temp1 + temp2) / 2
    }
    
    return temperatures[Math.floor(temperatures.length/2)]
  }

  render() {
    let coldStyle = "tempItem tempItem--cold"
    let hotStyle = "tempItem tempItem--hot"
    let style = "tempItem"
    console.log('state  ', this.state)
    return (
      <div className="App">
        <div className="container">
          <h1>Väder i Göteborg senaste {5} dagarna</h1>
          {this.state.minTemp && this.state.maxTemp && this.state.medianTemp && this.state.meanTemp ?
            <>
              <Temperature style={coldStyle}>{this.state.minTemp}</Temperature>
              <Temperature style={hotStyle}>{this.state.maxTemp}</Temperature>
              <Temperature style={style}>Median: {this.state.medianTemp}</Temperature>
              <Temperature style={style}>Mean: {this.state.meanTemp}</Temperature>
            </> 
            :
            <Loader />
          }
        </div>
        <a className="footer" href="https://openweathermap.org/" target="_blank">Powered by OpenWeatherMap</a>
      </div>
    );
  }
}

export default App;
