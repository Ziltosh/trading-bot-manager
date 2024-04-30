export const optimisationSomme = (data: (number | string)[]) => {
    let somme = 0;
    for (let i = 0; i < data.length; i++) {
        if (typeof data[i] === "string") {
            somme += parseFloat(<string>data[i]);
            continue;
        }
        somme += <number>data[i];
    }

    return somme;
};

export const optimisationMax = (data: (number | string)[]) => {
    const allNumbers = data.map((element) => {
        if (typeof element === "string") {
            return parseFloat(element);
        }
        return element;
    });

    return Math.max(...allNumbers);
};

export const optimisationMin = (data: (number | string)[]) => {
    const allNumbers = data.map((element) => {
        if (typeof element === "string") {
            return parseFloat(element);
        }
        return element;
    });

    return Math.min(...allNumbers);
};

export const optimisationMoyenne = (data: (number | string)[]) => {
    const allNumbers = data.map((element) => {
        if (typeof element === "string") {
            return parseFloat(element);
        }
        return element;
    });

    return allNumbers.reduce((acc, curr) => acc + curr, 0) / allNumbers.length;
};
