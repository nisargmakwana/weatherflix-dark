export const WEATHER_CODE_MAP = new Map();

addMapping(0, "Clear sky");
addMapping(1, "Mainly clear");
addMapping(2, "Partly cloudy");
addMapping(3, "Overcast");
addMapping(45, "Fog");
addMapping(48, "Depositing rime fog");
addMapping(51, "Light drizzle");
addMapping(53, "Moderate drizzle");
addMapping(55, "Dense drizzle");
addMapping(56, "LightFreezing drizzle");
addMapping(57, "Dense freezing drizzle");
addMapping(61, "Slight rain");
addMapping(63, "Moderate rain");
addMapping(65, "Heavy rain");
addMapping(66, "Freezing light rain");
addMapping(67, "Freezing Heavy rain");
addMapping(71, "Slight snow fall");
addMapping(73, "Moderate snow fall");
addMapping(75, "Heavy snow fall");
addMapping(77, "Snow grains");
addMapping(80, "Slight rain showers");
addMapping(81, "Moderate rain showers");
addMapping(82, "Violent rain showers");
addMapping(85, "Slight snow showers");
addMapping(86, "Heavy snow showers");
addMapping(95, "Thunderstorm");
addMapping(96, "Thunderstorm with slight hail");
addMapping(99, "Thunderstorm with heavy hail");

function addMapping(value, weatherCondition) {
	WEATHER_CODE_MAP.set(value, weatherCondition);
}
