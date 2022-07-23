////////////////////////////////////////////////////////////////////////
// Dependencies
let $ = require("jquery")

////////////////////////////////////////////////////////////////////////
// Shared variables
var charts = []

/**
 * Configuration prototype.
 */
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

/**
 * Creates a configuration from the prototype.
 * @returns A new configuration
 */
function spawnConfiguration() {
    return JSON.parse(JSON.stringify(chartConfigPrototype))
}

/**
 * Returns background color for a measure type
 * @param {string} type Type of measure
 * @returns Background color for a measure type
 */
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

/**
 * Returns border color for a measure type
 * @param {string} type Type of measure
 * @returns Border color for a measure type
 */
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

/**
 * Returns range for a measure type
 * @param {string} type Type of measure
 * @returns Range for a measure type
 */
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

/**
 * Returns a chart object.
 * If chart does not exist, it is created and added to the DOM.
 * @param {string} id Identifier of the chart
 * @returns Chart object
 */
function getChart(id) {
    if (!charts[id]) {
        var canvasId = '#' + id + 'Chart'
        var canvas = $('<canvas>').attr('id', canvasId)
        var card = $('<div>').addClass('col-sm-12 col-lg-10 col-xl-6')
        var container = $('#chartsContainer')
        card.append(canvas)
        container.append(card)
        var canvasDom = document.getElementById(canvasId)
        charts[id] = new Chart(canvasDom, spawnConfiguration())
    }
    return charts[id]
}

/**
 * Removes every chart.
 */
function clear() {
    $('#chartsContainer').empty()
    charts = []
}

/**
 * Format a title for a chart
 * @param {string} title Title
 * @returns Formatted title
 */
function formatTitle(title) {
    return title
        .split(/(?=[A-Z])/)
        .map(title => title[0].toUpperCase() + title.slice(1).toLowerCase())
        .join(" ")
}

module.exports = {
    spawn: spawnConfiguration,
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    valuesRange: valuesRange,
    get: getChart,
    formatTitle: formatTitle,
    clear: clear
}