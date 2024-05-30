export const ICON_MAP_NIGHT = new Map();

addMapping([0, 1], "moon");
addMapping([2], "cloudyMoon");
addMapping([3], "clouds");
addMapping([45, 48], "fog");
addMapping([51, 53, 55, 56, 57, 61, 66, 80], "lightRain");
addMapping([63, 65, 67, 81, 82], "heavyRain");
addMapping([71, 73, 75, 77, 85, 86], "snow");
addMapping([95, 96, 99], "thunderstorm");

function addMapping(values, icon) {
	values.forEach((value) => {
		ICON_MAP_NIGHT.set(value, icon);
	});
}
