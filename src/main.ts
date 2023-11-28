import { fetchWeatherApi } from 'openmeteo';
const params = {
	"latitude": 51.4055,
	"longitude": 19.7032,
	"hourly": "temperature_2m",
	"timezone": "Europe/Berlin"
};
const weather = async () => {
    const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {

        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature2m: hourly.variables(0)!.valuesArray()!,
        },

    };

    // `weatherData` now contains a simple structure with arrays for datetime and weather data

    /* for (let i = 0; i < weatherData.hourly.time.length; i++) {
        console.log(
            weatherData.hourly.time[i].toISOString(),
            weatherData.hourly.temperature2m[i]
        );
    } */
    const data = [];
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
        data.push({ key: weatherData.hourly.time[i], y: weatherData.hourly.temperature2m[i]});
    }
    for (let i = 0; i < data.length; i++) {
        console.log(Object.values(data[i])[0].toLocaleString(), Object.values(data[i])[1]);
    }
    // console.log(data);
    // const chart = ervy.bar(data, { legend: { left: 10, top: 10 } });
    // console.log(chart);
    return data;
}
let data = weather();
export default data;
