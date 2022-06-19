const chartConfigPrototype = {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: "value",
                type: "line",
                backgroundColor: "rgb(75, 192, 192, 0.5)",
                borderColor: "rgb(75, 192, 192)",
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                data: []
            },
            {
                label: "min",
                type: "line",
                backgroundColor: "rgb(75, 192, 255, 0.5)",
                borderColor: "transparent",
                pointRadius: 0,
                fill: 0,
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                data: []
            },
            {
                label: "max",
                type: "line",
                backgroundColor: "rgb(75, 192, 255, 0.5)",
                borderColor: "transparent",
                pointRadius: 0,
                fill: 0,
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                data: []
            }
        ]
    },
    options: {
        responsive: true,
        animation: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: "",
                font: {
                    size: 18,
                    weight: "bold"
                }
            },
            legend: {
                position: "right"
            },
            decimation: {
                enabled: true,
                algorithm: "lttb"
            }
        },
        scales: {
            x: {
            },
            y: {
                type: "linear",
                display: true
            }
        }
    }
}

function spawnConfiguration() {
    return JSON.parse(JSON.stringify(chartConfigPrototype))
}

function backgroundColor(type) {
    switch (type) {
        case "temperature":
            return "rgb(255, 192, 72, 0.5)"
        case "humidity":
            return "rgb(75, 192, 255, 0.5)"
        case "heatIndex":
            return "rgb(255, 72, 72, 0.5)"
        case "lightLevel":
            return "rgb(128, 192, 72, 0.5)"
        default:
            return "rgb(128, 128, 128, 0.5)"
    }
}

function borderColor(type) {
    switch (type) {
        case "temperature":
            return "rgb(255, 192, 72)"
        case "humidity":
            return "rgb(75, 192, 255)"
        case "heatIndex":
            return "rgb(255, 72, 72)"
        case "lightLevel":
            return "rgb(128, 192, 72)"
        default:
            return "rgb(128, 128, 128)"
    }
}

function valuesRange(type) {
    switch (type) {
        case "temperature":
        case "heatIndex":
            return [10.0, 40.0]
        case "humidity":
            return [0.0, 100.0]
        case "lightLevel":
            return [0.0, 1.0]
        default:
            return null
    }
}