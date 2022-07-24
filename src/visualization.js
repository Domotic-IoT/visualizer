////////////////////////////////////////////////////////////////////////
// Dependencies
let $ = require("jquery")
require("chart.js")
let configuration = require("./configuration")
let ChartHelper = require("./Helper/chart")
let RoomRepository = require("./Repository/room.js")


////////////////////////////////////////////////////////////////////////
// Shared variables
var timer = null

/**
 * Loads and shows available rooms.
 */
async function displayRooms() {
    const rooms = await RoomRepository.search()
    var container = $('#roomInput')
    rooms.forEach(room => $('<option>').val(room.id).html(room.label).appendTo(container))
}

/**
 * Loads and shows available time intervals.
 */
async function displayTimeIntervals() {
    const intervals = configuration.timeIntervals
    var container = $('#timeIntervalInput')
    intervals.forEach(interval =>
        $('<option>')
        .val(interval.value)
        .html(interval.label)
        .appendTo(container)
    )
}

/**
 * Main loop.
 * Reads selected room identifier and time interval, then calls the update
 * function.
 * @returns Next iteration
 */
function loop() {
    // Clears previous loop
    clearTimeout(timer)

    // Reads parameters and refreshes view
    var roomId = $("#roomInput").val()
    var timeInterval = $("#timeIntervalInput").val()
    refresh(roomId, timeInterval)

    // Prepares next iteration
    return setTimeout(
        () => { timer = loop() },
        configuration.refreshInterval * 1000
    )
}

/**
 * Updates the view.
 * Reads new measures and uses them to update the page.
 * @param {string} roomId Room identifier
 * @param {int} timeInterval Number of seconds to display
 */
async function refresh(roomId, timeInterval) {
    // Reads measures
    var currentTimestamp = Math.floor(Date.now() / 1000)
    var fromTimestamp = currentTimestamp - timeInterval
    var url = configuration.baseUrl + "/measures"
        + "?fromTimestamp=" + fromTimestamp
        + "&toTimestamp=" + currentTimestamp
        + "&roomId=" + roomId
    var measures = await $.get(url)

    // Extracts measure types
    var measureTypes = measures.map(measure => measure.type)
    measureTypes = measureTypes.filter((item, index) => measureTypes.indexOf(item) === index)

    // Updates charts
    measureTypes.forEach(measureType => {
        var chart = ChartHelper.get(measureType)
        var measureData = measures.filter(value => value.type === measureType)
        var range = ChartHelper.valuesRange(measureType)

        // Sets options
        chart.options.plugins.title.text = ChartHelper.formatTitle(measureType)
        if (range) {
            chart.options.scales.y.suggestedMin = range[0]
            chart.options.scales.y.suggestedMax = range[1]
        }

        // Sets data
        chart.data.labels = measureData.map(value => (new Date(value.timestamp * 1000)).toLocaleString())
        // Actual measure
        chart.data.datasets[0].data = measureData.map(value => value.value)
        chart.data.datasets[0].backgroundColor = ChartHelper.backgroundColor(measureType)
        chart.data.datasets[0].borderColor = ChartHelper.borderColor(measureType)
        // Lowerbound
        chart.data.datasets[1].data = measureData.map(value => value.value - value.absoluteError)
        chart.data.datasets[1].backgroundColor = ChartHelper.backgroundColor(measureType)
        // Upperbound
        chart.data.datasets[2].data = measureData.map(value => value.value + value.absoluteError)
        chart.data.datasets[2].backgroundColor = ChartHelper.backgroundColor(measureType)
        chart.update()
    })
}

/**
 * On document ready.
 */
$(async function() {
    $("#timeIntervalInput").on("change", loop)
    $("#roomInput").on("change", () => { ChartHelper.clear(); loop() })
    $("#refreshInput").on("click", () => { loop(); return false; })
    await displayRooms()
    await displayTimeIntervals()
    loop()
})
