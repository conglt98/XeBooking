$(document).ready(function () {
    updateContainer(afterLoad);

    $(window).resize(function () {
        updateContainer(afterLoad);
    });
});

function afterLoad(booking, bustype) {
    $('#donut-value').html(booking);
    $('#bus-type-value').html(bustype);

}

function updateContainer(afterLoad) {
    var objToday = new Date(),
        weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
        dayOfWeek = weekday[objToday.getDay()],
        domEnder = function () {
            var a = objToday;
            if (/1/.test(parseInt((a + "").charAt(0)))) return "th";
            a = parseInt((a + "").charAt(1));
            return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th"
        }(),
        dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
        months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear();
    var today = dayOfWeek + ", " + dayOfMonth + " of " + curMonth + ", " + curYear;

    document.getElementById("date").innerHTML = "Today is " + today;

    /*    animateValue("num-signup", 0, 1000000, 1);
        animateValue("num-sale", 0, 100000, 1);
        animateValue("num-visit", 0, 100000, 1);
        animateValue("num-revenue", 0, 1000000, 1);
    */
    //column chart
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawColColors);



    //line chart
    google.charts.load('current', {
        packages: ['corechart', 'line']
    });
    google.charts.setOnLoadCallback(drawChartLine);


    //donut
    google.charts.load("current", {
        packages: ["corechart"]
    });
    google.charts.setOnLoadCallback(drawChartDonut);

    google.charts.setOnLoadCallback(drawChartBusType);

    google.charts.setOnLoadCallback(drawChartBusRoute);

}

function drawChartBusRoute() {
    // var data = google.visualization.arrayToDataTable([
    //     ['Task', 'Hours per Day'],
    //     ['New York - Dallas', 52],
    //     ['Ho Chi Minh - Dallas', 24],
    //     ['Dallas - Ho Chi Minh', 14],
    //     ['Other', 10]
    // ]);

    var options = {
        colors: ['#d70303', '#56c568', '#3fa2f7', '#999999'],
        pieSliceText: "none",
        legend: {
            position: 'right'
        },
        animation: {
            duration: 1000,
            easing: 'in',
            startup: true
        },
        chartArea: {
            left: "0%",
            width: "200px",
            height: "400px"
        },
        backgroundColor: 'transparent'

    };

    // var chart = new google.visualization.PieChart(document.getElementById('chart_busroute'));
    // chart.draw(data, options);

    var jsonData = $.ajax({
        url: "/charts/chart_busroute",
        dataType: "json",
        async: false,
        success: (
            function (data) {
                jsonData = data;

                console.log(jsonData);
                c = jsonData.Revenue;
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Route');
                data.addColumn('number', 'Bookings');
                data.addRows(c.length);
                for (var i = 0; i < c.length; i++) {
                    data.setCell(i, 0, c[i].route);
                    data.setCell(i, 1, c[i].book);
                }
                visualization = new google.visualization.PieChart(
                    document.getElementById('chart_busroute'));
                visualization.draw(data, options);
            })
    }).responseText;
}



function drawChartBusType() {
    // var data = google.visualization.arrayToDataTable([
    //     ['Task', 'Hours per Day'],
    //     ['Normal', 30],
    //     ['Air', 30],
    //     ['Sleeper', 40]
    // ]);

    var options = {
        colors: ['#999999', '#d70303', '#56c568'],
        pieHole: 0.6,
        legend: "none",
        pieSliceText: "none",
        animation: {
            duration: 1000,
            easing: 'in',
            startup: true
        },
        chartArea: {
            left: "0%",
            width: "200px",
            height: "400px"
        },
        backgroundColor: 'transparent'
    };

    // var chart = new google.visualization.PieChart(document.getElementById('chart_bustype'));
    // chart.draw(data, options);

    var jsonData = $.ajax({
        url: "/charts/chart_bustype",
        dataType: "json",
        async: false,
        success: (
            function (data) {
                jsonData = data;

                console.log(jsonData);
                c = jsonData.Bustype;
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Bustype');
                data.addColumn('number', 'Used');
                data.addRows(c.length);
                for (var i = 0; i < c.length; i++) {
                    data.setCell(i, 0, c[i].bustype);
                    data.setCell(i, 1, c[i].used);
                }
                visualization = new google.visualization.PieChart(
                    document.getElementById('chart_bustype'));
                visualization.draw(data, options);
            })
    }).responseText;
}


function drawChartDonut() {
    // var data = google.visualization.arrayToDataTable([
    //     ['Task', 'Hours per Day'],
    //     ['Visit but not book bus', 30],
    //     ['Visit then book bus', 70]
    // ]);

    var options = {
        colors: ['#999999', '#d70303'],
        pieHole: 0.6,
        legend: "none",
        pieSliceText: "none",
        animation: {
            duration: 1000,
            easing: 'in',
            startup: true
        },
        chartArea: {
            left: "0%",
            width: "200px",
            height: "400px"
        },
        backgroundColor: 'transparent'

    };

    // var chart = new google.visualization.PieChart(document.getElementById('chart_donut'));
    // chart.draw(data, options);

    var jsonData = $.ajax({
        url: "/charts/chart_donut",
        dataType: "json",
        async: false,
        success: (
            function (data) {
                jsonData = data;

                console.log(jsonData);
                c = jsonData.Task;
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Task');
                data.addColumn('number', 'Percent');
                data.addRows(c.length);
                for (var i = 0; i < c.length; i++) {
                    data.setCell(i, 0, c[i].task);
                    data.setCell(i, 1, c[i].percent);
                }

                $('#donut-value').html(parseInt(c[1].percent*100/(c[0].percent+c[1].percent)));
                chartdonut = new google.visualization.PieChart(
                    document.getElementById('chart_donut'));
                chartdonut.draw(data, options);
                
                // // initial value
                // var percent = 0;
                // // start the animation loop
                // var handler = setInterval(function () {
                //     // values increment
                //     percent += 1;
                //     // apply new values
                //     data.setValue(0, 1, percent);
                //     data.setValue(1, 1, 100 - percent);
                //     // update the pie
                //     chartdonut.draw(data, options);
                //     // check if we have reached the desired value
                //     if (percent >= 30)
                //         // stop the loop
                //         clearInterval(handler);
                // }, 30);
            })
    }).responseText;


}

function drawColColors() {

    var options = {

        colors: ['#d70303'],
        hAxis: {
            title: 'Day of month',

        },
        vAxis: {
            title: 'Revenue every day'
        },
        animation: {
            duration: 1000,
            easing: 'out',
            startup: true
        }
    };

    // // var chart = new google.visualization.ColumnChart(document.getElementById('chart_col'));
    // // chart.draw(data, options);

    // // Instantiate and draw our chart, passing in some options.
    // var chart = new google.visualization.ColumnChart(document.getElementById('chart_col'));
    // chart.draw(data, options );

    // var jsonData = {
    //     "Revenue": [{
    //             "day": "May 1",
    //             "revenue": 3
    //         },
    //         {
    //             "day": "May 2",
    //             "revenue": 5
    //         },
    //         {
    //             "day": "May 3",
    //             "revenue": 4
    //         },
    //         {
    //             "day": "May 4",
    //             "revenue": 5
    //         },
    //         {
    //             "day": "May 5",
    //             "revenue": 7
    //         },
    //         {
    //             "day": "May 7",
    //             "revenue": 3
    //         },
    //         {
    //             "day": "May 8",
    //             "revenue": 6
    //         },
    //         {
    //             "day": "Today",
    //             "revenue": 9
    //         }
    //     ]
    // };


    var jsonData = $.ajax({
        url: "/charts/chart_col",
        dataType: "json",
        async: false,
        success: (
            function (data) {
                jsonData = data;

                console.log(jsonData);
                c = jsonData.Revenue;
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Day');
                data.addColumn('number', 'USD');
                data.addRows(c.length);
                for (var i = 0; i < c.length; i++) {
                    data.setCell(i, 0, c[i].day);
                    data.setCell(i, 1, c[i].revenue);
                }
                visualization = new google.visualization.ColumnChart(
                    document.getElementById('chart_col'));
                visualization.draw(data, options);
            })
    }).responseText;

}


function drawChartLine() {

    // var data = google.visualization.arrayToDataTable([
    //     ['Day', 'Unit'],
    //     ['May 1', 10],
    //     ['May 2', 14],
    //     ['May 3', 16],
    //     ['May 4', 22],
    //     ['May 6', 24],
    //     ['May 7', 12],
    //     ['May 8', 25],
    //     ['Today', 10],

    // ]);

    var options = {

        colors: ['#d70303'],
        hAxis: {
            title: 'Day of month',

        },
        legend: {
            line: 2,
            position: 'right'
        },
        vAxis: {
            title: 'Number of booking'
        },
        animation: {
            duration: 1000,
            easing: 'out',
            startup: true
        }
    };

    // var chart = new google.visualization.LineChart(document.getElementById('chart_line'));
    // chart.draw(data, google.charts.Line.convertOptions(options));

    var jsonData = $.ajax({
        url: "/charts/chart_line",
        dataType: "json",
        async: false,
        success: (
            function (data) {
                jsonData = data;

                console.log(jsonData);
                c = jsonData.Revenue;
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Day');
                data.addColumn('number', 'Unit');
                data.addRows(c.length);
                for (var i = 0; i < c.length; i++) {
                    data.setCell(i, 0, c[i].day);
                    data.setCell(i, 1, c[i].revenue);
                }
                visualization = new google.visualization.LineChart(
                    document.getElementById('chart_line'));
                visualization.draw(data, options);
            })
    }).responseText;
}

function animateValue(id, start, end, duration) {
    var range = end - start;
    var current = start;
    var increment = end > start ? 10000 : -10000;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function () {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}