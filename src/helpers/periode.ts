export const convertToDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};
