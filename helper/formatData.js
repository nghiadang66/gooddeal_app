import { randomColorsArray } from './color';

export const lineData = (data) => {
    const dataLength = data.length;
    const labels = [];
    const datas = [];
    for (let i=0; i<dataLength; i++) {
        labels.push(data[i][0]);
        datas.push(data[i][1]);
    }

    return {
        labels: labels.map((elm, i) => (i>0 && i<dataLength-1) ? '' : elm),
        datasets: [
            {
                data: datas,
            }
        ],
    };
}

export const pieData = (data, color, size) => {
    const colors = randomColorsArray(data.length);
    return data.map((item, index) => {
        return {
            name: item[0],
            value: item[1],
            color: colors[index],
            legendFontColor: color,
            legendFontSize: size,
        };
    })
}