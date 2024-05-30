export const ICON_MAP_DAY = new Map();

addMapping([0, 1], "sun");
addMapping([2], "cloudySun");
addMapping([3], "clouds");
addMapping([45, 48], "fog");
addMapping([51, 53, 55, 56, 57, 61, 66, 80], "lightRain");
addMapping([63, 65, 67, 81, 82], "heavyRain");
addMapping([71, 73, 75, 77, 85, 86], "snow");
addMapping([95, 96, 99], "thunderstorm");

// Can call function declarations before defining them, will try that out here
function addMapping(values, icon) {
	values.forEach((value) => {
		ICON_MAP_DAY.set(value, icon);
	});
}
