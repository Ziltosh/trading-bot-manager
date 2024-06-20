const chartPart = {
    id: 0,
    symbol: "",
    period: 30,
    leftpos: 0,
    digits: 5,
    scale: 2,
    graph: 1,
    fore: 0,
    grid: 0,
    volume: 0,
    scroll: 1,
    shift: 1,
    ohlc: 1,
    one_click: 0,
    one_click_btn: 0,
    askline: 1,
    days: 0,
    descriptions: 0,
    shift_size: 20,
    fixed_pos: 0,
    window_left: 0,
    window_top: 0,
    window_right: 100,
    window_bottom: 100,
    window_type: 1,
    background_color: 2626570,
    foreground_color: 16777215,
    barup_color: 6602270,
    bardown_color: 3947760,
    bullcandle_color: 6602270,
    bearcandle_color: 3947760,
    chartline_color: 65280,
    volumes_color: 3329330,
    grid_color: 10061943,
    askline_color: 255,
    stops_color: 255,
};

const windowPart = {
    height: 100,
    fixed_height: 0,
};

const expertPart = {
    name: "",
    flags: 0,
    window_num: 0,
};

export type makeParams = {
    id: number;
    symbol: string;
    period: number;
    robotPath: string;
    flags: number;
    inputs: string;
};

export const make = (params: makeParams) => {
    let fileContent = `
<chart>
    `;

    const chart: typeof chartPart = {
        ...chartPart,
        id: params.id,
        symbol: params.symbol,
        period: params.period,
    };

    Object.entries(chart).forEach((entry) => {
        fileContent += `${entry[0]}=${entry[1]}\n`;
    });

    fileContent += `\n<window>\n`;

    Object.entries(windowPart).forEach((entry) => {
        fileContent += `${entry[0]}=${entry[1]}\n`;
    });

    fileContent += `\n<indicator>\n</indicator>\n`;
    fileContent += `\n</window>\n`;

    fileContent += `\n<expert>\n`;

    const expert: typeof expertPart = {
        ...expertPart,
        name: params.robotPath,
        flags: params.flags,
    };

    Object.entries(expert).forEach((entry) => {
        fileContent += `${entry[0]}=${entry[1]}\n`;
    });

    fileContent += `\n<inputs>\n`;

    fileContent += params.inputs;

    fileContent += "\n</inputs>\n</expert>\n</chart>";

    return fileContent;
};

export const cleanParams = (paramsText: string) => {
    const regex = /^.*?,[1,2,3,F].*?=.*?$/gm;
    let result = paramsText.replace(regex, "");
    result = result.replace(/^[\n]*$/gm, "");

    return result;
};
