export function DifferentYearsFormat(startDate : Date, endDate: Date) : string
{
    const startDay = startDate.getDay().toString().padStart(2, "0");
    const startMonth = (startDate.getMonth() + 1).toString().padStart(2, "0");
    const startYear = (startDate.getFullYear() % 100).toString().padStart(2, "0");

    const endDay = endDate.getDay().toString().padStart(2, "0");
    const endMonth = (endDate.getMonth() + 1).toString().padStart(2, "0");
    const endYear = (endDate.getFullYear() % 100).toString().padStart(2, "0");

    return `${startDay}.${startMonth}.${startYear} - ${endDay}.${endMonth}.${endYear}`;
}

export function DifferentMonthsFormat(startDate : Date, endDate : Date) : string
{
    const startDayMonth = startDate.toLocaleDateString("ru-Ru", { month: "long", day: "numeric" });

    const endDayMonth = endDate.toLocaleDateString("ru-Ru", { month: "long", day: "numeric" });
    const endYear = endDate.getFullYear().toString();

    return `${startDayMonth} - ${endDayMonth} ${endYear}`;
}

export function SameMonthsFormat(startDate : Date, endDate : Date) : string
{
    const startDay = startDate.toLocaleDateString("ru-Ru", { day: "numeric" });

    const endDayMonth = endDate.toLocaleDateString("ru-Ru", { month: "long", day: "numeric" });
    const endYear = endDate.getFullYear().toString();

    return `${startDay} - ${endDayMonth} ${endYear}`;
}

export function toDatetimeFormat(date : string) : string {
    return date.split(".").reverse().join("-");
}

export function DateFromLocaleString(value : string): Date | undefined {
    const timestamp = Date.parse(toDatetimeFormat(value));
    return isNaN(timestamp) ? undefined : new Date(timestamp);
}