var timeInterval = 3600
var refreshInterval = 30
var isFirstRefresh = true
var timer = null
var baseUrl = "http://localhost:8080"
var data = []
var roomId = 'living'
var charts = {}


function refreshLoop() {
    return setTimeout(function () {
        refreshData()
        timer = refreshLoop()
    }, refreshInterval * 1000)
}

function refreshData()  {
    var currentTimestamp = Math.floor(Date.now() / 1000)
    var fromTimestamp = currentTimestamp - timeInterval
    var url = baseUrl + "/measures"
        + "?fromTimestamp=" + fromTimestamp
        + "&toTimestamp=" + currentTimestamp
    if (roomId) {
        url += "&roomId=" + roomId
    }
    $.get(url, refresh)
}

function refresh(response) {
    data = response
/*
    var roomIds = response.map(measure => measure.roomId)
    roomIds = roomIds.filter((item, index) => roomIds.indexOf(item) === index)
    var roomInput = $("#roomInput")
    var lastValue = roomInput.val()
    roomInput.empty()
    roomIds.forEach(roomId => {
        var option = $("<option>").val(roomId).html(roomId)
        if (roomId === lastValue) {
            option.prop('selected', true);
        }
        roomInput.append(option)
    })
    if (isFirstRefresh) {
        roomId = roomIds[0];
        isFirstRefresh = false
    }
*/
    updateCurrentView()
}

function getCanvas(measureType) {
    var canvasId = '#' + measureType + 'Chart'
    var canvas = document.getElementById(canvasId)
    if (!canvas) {
        var canvasObject = $('<canvas>').attr('id', canvasId)
        var container = $('<div>').addClass('col-sm-12 col-lg-10 col-xl-6')
        $('#chartsContainer').append(container)
        container.append(canvasObject)
        canvas = document.getElementById(canvasId)
    }
    return canvas
}

function getChart(measureType) {
    if (!charts[measureType]) {
        var canvas = getCanvas(measureType)
        charts[measureType] = new Chart(canvas, spawnConfiguration())
    }
    return charts[measureType]
}

function formatTitle(title) {
    return title.split(/(?=[A-Z])/).map(title => title[0].toUpperCase() + title.slice(1).toLowerCase()).join(" ")
}

function updateCurrentView() {
    if (!roomId) {
        return
    }
    var measureTypes = data.filter(value => value.roomId === roomId).map(measure => measure.type)
    measureTypes = measureTypes.filter((item, index) => measureTypes.indexOf(item) === index)
    measureTypes.forEach(measureType => {
        var chart = getChart(measureType)
        var measureData = data.filter(value => value.roomId === roomId && value.type === measureType)
        chart.options.plugins.title.text = formatTitle(measureType)
        chart.data.labels = measureData.map(value => (new Date(value.timestamp * 1000)).toLocaleString())
        chart.data.datasets[0].data = measureData.map(value => value.value)
        chart.data.datasets[0].backgroundColor = backgroundColor(measureType)
        chart.data.datasets[0].borderColor = borderColor(measureType)
        chart.data.datasets[1].data = measureData.map(value => value.value - value.absoluteError)
        chart.data.datasets[1].backgroundColor = backgroundColor(measureType)
        chart.data.datasets[2].data = measureData.map(value => value.value + value.absoluteError)
        chart.data.datasets[2].backgroundColor = backgroundColor(measureType)
        var range = valuesRange(measureType)
        if (range) {
            chart.options.scales.y.suggestedMin = range[0]
            chart.options.scales.y.suggestedMax = range[1]
        }
        chart.update()
    })
}

$(function() {
    $('#timeIntervalInput').change(function () {
        timeInterval = parseInt($(this).val());
        clearTimeout(timer)
        timer = refreshLoop()
	refreshData()
    })
    $(document).on('click', '#roomInput', function () {
        $('#chartsContainer').empty()
        charts = {}
        roomId = $(this).val()
	refreshData()
    })
    refreshLoop()
    refreshData()
})
