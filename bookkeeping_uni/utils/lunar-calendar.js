import lunar from 'lunar-calendar';

export function getLunarDate(date) {
	// 将阳历日期转换为阴历日期
	const lunarDate = lunar.solarToLunar(
		date.getFullYear(),
		date.getMonth() + 1,
		date.getDate()
	);

	return `${lunarDate.lunarFestival ? lunarDate.lunarFestival : lunarDate.lunarDayName}`;
}