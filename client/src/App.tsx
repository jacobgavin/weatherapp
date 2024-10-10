import { Component } from 'react';
import './App.css';
import { hour } from './types'
import Temperature from './components/Temperature';
import Loader from './components/Loader';
import { data } from './dummyData';

class App extends Component<{}, {days:Array<any>, debug:boolean, meanTemp?:number, medianTemp?:number, minTemp?: number, maxTemp?: number}> {
  constructor(props: any) {
    super(props)
    this.state = {
      days: [],
      debug: false,
    }
  }
  componentDidMount() {    
    this.getPastForecast(30)
  }

  getPastForecast(daysBack:number) {
    let allDays = new Array
    var fetches = []
    if(this.state.debug) {
      for(var i=0;i<daysBack;i++) {
        allDays.push(data)
      }
      this.setState({
        days: allDays
      })
      this.setTemps(allDays)
      return;
    }
    for(var i = 0; i < daysBack; i++) {
      fetches.push(
        fetch("http://localhost:3001/api/getPastDay?day=" + i + "&lat=57.708870&long=11.974560")
        .then(function(response) {
          return response.json()
        })
        .then(function(data) {
          allDays.push(data)
        })
      )
    }
    Promise.all(fetches).then(() => {
      this.setState({
        days: allDays
      })
      this.setTemps(allDays)
    })
  }

  setTemps(days:Array<any>) {
    const reducer = (accumulator:number, currentValue:number) => accumulator + currentValue;
    var minTemp:number = 0;
    var maxTemp:number = 0;

    if(days.length > 0 ) {
      let avregesPerDay = days.map((day, idx) => {
        let temps = day.hourly.data.map((hour:hour) => hour.temperature)
        /**
         * Start by calculating the min/max for each hour of the days
         */
        if(idx == 0) {
          minTemp = day.daily.data[0].temperatureMin
          maxTemp = day.daily.data[0].temperatureMax
        } else {
          if(day.daily.data[0].temperatureMin < minTemp) {
            minTemp = day.daily.data[0].temperatureMin
          }
          if(day.daily.data[0].temperatureMax > maxTemp) {
            maxTemp = day.daily.data[0].temperatureMax
          }
        }

        /**
         * Sum all temps from 1 day and calculate median per day
         */
        let medianPerDay = temps.reduce(reducer) / 24

        return medianPerDay
      })
      this.setState({
        meanTemp: avregesPerDay.reduce(reducer) / days.length,
        medianTemp: this.getMedianValue(avregesPerDay),
        minTemp: minTemp,
        maxTemp: maxTemp
      })
    }
  }

  getMedianValue(days:number[]) {
    days.sort()
    if(days.length % 2 == 0) {
      // if we got an even number get the two in the middle.
      // add them together and divide by 2 to get the median
      return (days[days.length/2 - 1] + days[days.length/2 + 1]) / 2
    }
    return days[days.length/2]
  }

  render() {
    let coldStyle = "tempItem tempItem--cold"
    let hotStyle = "tempItem tempItem--hot"
    let style = "tempItem"

    return (
      <div className="App">
        <div className="container">
          <h1>Väder i Göteborg senaste {this.state.days.length} dagarna</h1>
          {this.state.days && this.state.days.length > 0 ?
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
        <a className="footer" href="https://darksky.net/poweredby/" target="_blank">Powered by darksky</a>
      </div>
    );
  }
}

export default App;
