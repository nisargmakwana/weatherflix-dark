"Use strict";
import { ICON_MAP_DAY } from "./iconMap-d.js";
import { ICON_MAP_NIGHT } from "./iconMap-n.js";
import { WEATHER_CODE_MAP } from "./weatherCodeMap.js";
import {
	clouds,
	cloudyMoon,
	cloudySun,
	fog,
	heavyRain,
	lightRain,
	moon,
	sun,
	snow,
	thunderstorm,
} from "./index.js";

// Elements
const weatherIcon = document.querySelector(".weather-icon");
const curTempEl = document.querySelector(".current-temperature");
const appTempEl = document.querySelector(".app-temp");
const dayEl = document.querySelector(".day");
const timeEl = document.querySelector(".time");
const overallWeatherEl = document.querySelector(".overall-weather");
const rainProbabilityEl = document.querySelector(".rain-probability");
const locationEl = document.querySelector(".location");
const dailyWeatherContainer = document.querySelector(
	".daily-weather-container"
);
const uvIndexEl = document.querySelector(".uv-index");
const uvStatusEl = document.querySelector(".uv-status");
const windSpeedEl = document.querySelector(".wind-speed");
const windStatusEl = document.querySelector(".wind-status");
const sunriseEl = document.querySelector(".sunrise");
const sunsetEl = document.querySelector(".sunset");
const humidityEl = document.querySelector(".humidity");
const humidityStatus = document.querySelector(".humidity-status");
const visibilityEl = document.querySelector(".visibility");
const visibilityStatus = document.querySelector(".visibility-status");
const aqiEl = document.querySelector(".aqi");
const aqiStatus = document.querySelector(".aqi-status");
const searchCityBtn = document.querySelector(".search button");
const searchCityEl = document.querySelector(".search input");
const toggleInput = document.querySelector("#toggle");
const htmlEl = document.querySelector("html");
const svgEl = document.querySelector(".svg");
let searchCity, latitude, longitude;

// Variables
const imgObj = {
	sun,
	moon,
	cloudySun,
	cloudyMoon,
	lightRain,
	heavyRain,
	fog,
	snow,
	clouds,
	thunderstorm,
};

// toggle dark mode

function toggleDarkMode() {
	toggleInput.checked
		? htmlEl.classList.add("dark")
		: htmlEl.classList.remove("dark");
}
toggleDarkMode();
toggleInput.addEventListener("click", toggleDarkMode);

// svg icon color dark mode
function searchIconColor() {
	htmlEl.classList.contains("dark")
		? svgEl.setAttribute("stroke", "#ffffff")
		: svgEl.setAttribute("stroke", "#111111");
}
searchIconColor();
toggleInput.addEventListener("click", searchIconColor);

// main function updateUI

navigator.geolocation.getCurrentPosition(
	function (position) {
		if (!latitude && !longitude) {
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
		}

		// UPDATING UI FUNCTION

		function updateUI(latitude, longitude) {
			fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`
			)
				.then((res) => res.json())
				.then((data) => {
					// WEATHER ICON
					const weatherCode = data.current.weather_code;
					if (data.current.is_day) {
						weatherIcon.setAttribute(
							"src",
							imgObj[ICON_MAP_DAY.get(weatherCode)]
						);
					} else {
						weatherIcon.setAttribute(
							"src",
							imgObj[ICON_MAP_NIGHT.get(weatherCode)]
						);
					}

					// CURRENT TEMP AND CURRENT APPARENT TEMPERATURE
					curTempEl.textContent = data.current.temperature_2m;
					appTempEl.textContent = data.current.apparent_temperature;

					// WEEKDAY AND TIME
					const date = new Date();
					console.log(date);
					const weekDay = Intl.DateTimeFormat("en-us", {
						weekday: "short",
					}).format(date);
					dayEl.textContent = weekDay;

					const time = Intl.DateTimeFormat("en-US", {
						hour: "numeric",
						minute: "numeric",
						hour12: true,
					}).format(date);
					timeEl.textContent = time;

					// WEATHER CODE SUMMARY AND PRECIPITAION PROBABILITY
					const overallWeather = WEATHER_CODE_MAP.get(
						data.current.weather_code
					);
					overallWeatherEl.textContent = overallWeather;

					const rainProbability = `${data.daily.precipitation_probability_max[0]}%`;
					rainProbabilityEl.textContent = rainProbability;

					// LOCATION

					fetch(
						`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=0f4f9905adc9d1f03e48a144cd60c351`
					)
						.then((res) => res.json())
						.then((data) => {
							const [locationData] = data;
							const locationString = `${locationData.name}, ${locationData.state}, ${locationData.country}`;
							locationEl.textContent = locationString;
						});

					// HOURLY FORECAST
					const dayArray = data.daily.time;
					const maxTempArray = data.daily.temperature_2m_max;
					const minTempArray = data.daily.temperature_2m_min;
					const dailyWeatherCodes = data.daily.weather_code;

					dailyWeatherContainer.innerHTML = "";
					renderForecast();
					function renderForecast() {
						for (let i = 0; i < 7; i++) {
							// Variables
							const forecastDate = new Date(dayArray[i]);
							const forecastWeekday = Intl.DateTimeFormat("en-US", {
								weekday: "short",
							}).format(forecastDate);
							const minTemp = minTempArray[i];
							const maxTemp = maxTempArray[i];
							let weaIcon;

							if (data.current.is_day) {
								weaIcon = imgObj[ICON_MAP_DAY.get(dailyWeatherCodes[i])];
							} else {
								weaIcon = imgObj[ICON_MAP_DAY.get(dailyWeatherCodes[i])];
							}

							// Rendering

							dailyWeatherContainer.insertAdjacentHTML(
								"beforeend",
								`<div
					class="mt-[2.5rem] text-[1.4rem] flex flex-col gap-[0.8rem] items-center w-[9.2rem] bg-white dark:bg-slate-950 py-[1rem] rounded-xl shadow-md">
					<p>${forecastWeekday}</p>
					<img src=${weaIcon} class="w-[3.5rem]" alt="">
					<p><span class="inline-block">${maxTemp}</span><span
							class="text-slate-500 dark:text-slate-400 inline-block ml-[0.8rem]">${minTemp}</span></p>
				</div>`
							);
						}
					}

					// UV-INDEX

					const uv = data.daily.uv_index_max[0];
					uvIndexEl.textContent = uv;

					if (uv > 0 && uv <= 2) {
						uvStatusEl.classList.add("text-[#00A300]"); // green
						uvStatusEl.textContent = "Low";
					} else if (uv > 2 && uv <= 5) {
						uvStatusEl.classList.add("text-[#E5C101]"); // yellow
						uvStatusEl.textContent = "Moderate";
					} else if (uv > 5 && uv <= 7) {
						uvStatusEl.classList.add("text-[#FD7F20]"); // orange
						uvStatusEl.textContent = "High";
					} else if (uv > 7 && uv <= 10) {
						uvStatusEl.classList.add("text-[#BA0F30]"); // red
						uvStatusEl.textContent = "Very high";
					} else if (uv > 10) {
						uvStatusEl.classList.add("text-[#603F8B]"); // purple
						uvStatusEl.textContent = "Extreme";
					}
					// WIND SEED
					const speed = data.current.wind_speed_10m;
					windSpeedEl.textContent = speed;

					if (speed < 1) {
						windStatusEl.classList.add("[text-[#00A300]"); //green
						windStatusEl.textContent = "Calm";
					} else if (speed > 1 && speed < 5) {
						windStatusEl.classList.add("[text-[#00A300]"); // green
						windStatusEl.textContent = "Light air";
					} else if (speed > 5 && speed < 38) {
						windStatusEl.classList.add("text-[#E5C101]"); // yellow
						windStatusEl.textContent = "Breeze";
					} else if (speed > 38 && speed < 49) {
						windStatusEl.classList.add("text-[#FD7F20]"); // orange
						windStatusEl.textContent = "Strong breeze";
					} else if (speed > 49 && speed < 88) {
						windStatusEl.classList.add("text-[#BA0F30]"); // red
						windStatusEl.textContent = "Gale";
					} else if (speed > 88 && speed < 102) {
						windStatusEl.classList.add("text-[#BA0F30]"); // red
						windStatusEl.textContent = "Storm";
					} else if (speed > 102 && speed < 117) {
						windStatusEl.classList.add("text-[#BA0F30]"); // red
						windStatusEl.textContent = "Violent Storm";
					} else if (speed > 117) {
						windStatusEl.classList.add("text-[#BA0F30]"); // red
						windStatusEl.textContent = "Hurricane";
					}

					// SUNRISE AND SUNSET
					const sunriseOptions = {
						hour: "numeric",
						minute: "numeric",
						hour12: true,
					};

					const sunriseStr = new Date(data.daily.sunrise[0]);
					const sunsetStr = new Date(data.daily.sunset[0]);
					const sunrise = Intl.DateTimeFormat("en-US", sunriseOptions).format(
						sunriseStr
					);
					const sunset = Intl.DateTimeFormat("en-US", sunriseOptions).format(
						sunsetStr
					);
					sunriseEl.textContent = sunrise;
					sunsetEl.textContent = sunset;

					// HUMIDITY
					const humidity = data.current.relative_humidity_2m;
					humidityEl.textContent = humidity;

					if (humidity <= 25) {
						humidityStatus.classList.add("text-[#BA0F30]"); // red
						humidityStatus.textContent = "Poor";
					} else if (humidity > 25 && humidity < 30) {
						humidityStatus.classList.add("text-[#FD7F20]"); // orange
						humidityStatus.textContent = "Fair";
					} else if (humidity >= 30 && humidity < 60) {
						humidityStatus.classList.add("text-[#00A300]"); // green
						humidityStatus.textContent = "Good";
					} else if (humidity >= 60 && humidity < 70) {
						humidityStatus.classList.add("text-[#FD7F20]"); // orange
						humidityStatus.textContent = "Fair";
					} else if (humidity >= 70) {
						humidityStatus.classList.add("text-[#BA0F30]"); // red
						humidityStatus.textContent = "High";
					}

					// VISIBILITY
					let visibility = data.hourly.visibility[0];
					visibility = (visibility / 1000).toFixed(1);
					visibilityEl.textContent = visibility;

					if (visibility < 1) {
						visibilityStatus.classList.add("text-[#BA0F30]"); // red
						visibilityStatus.textContent = "Fog";
					} else if (visibility > 1 && visibility < 10) {
						visibilityStatus.classList.add("text-[#FD7F20]"); // orange
						visibilityStatus.textContent = "Rain";
					} else if (visibility > 10 && visibility < 20) {
						visibilityStatus.classList.add("text-[#E5C101]"); // yellow
						visibilityStatus.textContent = "Pretty clear";
					} else if (visibility > 20) {
						visibilityStatus.classList.add("text-[#00A300]"); // green
						visibilityStatus.textContent = "Excellent";
					}

					// AQI INDEX

					fetch(
						`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi&timezone=auto`
					)
						.then((res) => res.json())
						.then((data) => {
							const aqi = data.current.us_aqi;
							aqiEl.textContent = aqi;

							if (aqi > 0 && aqi <= 50) {
								aqiStatus.classList.add("text-[#00A300]"); // green
								aqiStatus.textContent = "Excellent";
							} else if (aqi > 50 && aqi <= 100) {
								aqiStatus.classList.add("text-[#E5C101]"); // yellow
								aqiStatus.textContent = "Moderate";
							} else if (aqi > 100 && aqi <= 150) {
								aqiStatus.classList.add("text-[#FD7F20]"); // orange
								aqiStatus.textContent = "Unhealthy for Sensitive Groups";
							} else if (aqi > 150 && aqi <= 200) {
								aqiStatus.classList.add("text-[#BA0F30]"); // red
								aqiStatus.textContent = "Very Unhealthy";
							} else if (aqi > 200 && aqi <= 300) {
								aqiStatus.classList.add("text-[#603F8B]"); // purple
								aqiStatus.textContent = "Unhealthy";
							} else if (aqi > 300) {
								aqiStatus.classList.add("text-[#800000]"); // maroon
								aqiStatus.textContent = "Hazardous";
							}
						});
				});
		}
		updateUI(latitude, longitude);
		searchCityBtn.addEventListener("click", () => {
			searchCity = searchCityEl.value;
			fetch(
				`https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}&count=10&language=en&format=json`
			)
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					latitude = data.results[0].latitude;
					longitude = data.results[0].longitude;
					searchCityEl.value = "";
					updateUI(latitude, longitude);
				});
		});
	},
	function () {
		alert(
			"Couldn't get your location, hit 'Allow' on the popup or enter the correct city name"
		);
	}
);

console.log("Welcome to a quick weather dashboard!");
