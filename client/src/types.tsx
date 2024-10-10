export type HistoryWeather = {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[]
    temperature_2m: number[]
  }
}