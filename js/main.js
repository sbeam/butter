'use strict';

$(document).ready(function() {

    var url = 'http://stats.reviewed.com:8086/db/hydra-timing/series'
    var params = {
        u: 'root',
        p: 'root',
    }

    var queries = [
        "select histogram(value, 100) from domContentLoadedEventEnd where time > now() - 3h and value < 10000",
        "select count(value), median(value), mean(value), stddev(value) from domContentLoadedEventEnd group by time(3m) where time > now() - 30m and value < 5000 and page_ids = 'articles.show' limit 1000"
    ]

    params['q'] = queries[0]

    var req = $.ajax({
        type: "GET",
        url: url,
        data: params
    })

    req.done( function(data) {

        var second = $.map(data[0].points, function(v, i) { return { count: v[2], value: v[1] } })
        second = _.sortBy(second, function(a) { return a.value } )
        console.log(second)

     // var second = d3.layout.histogram()(data[0].points).map(function(d){
     //     console.log(d)
     //     return {'count': d[1], 'value':d[2]}
     // });

        var histo = data_graphic({
            title: "Histogram 2",
            description: "Already binned data being fed in.",
            data: second,
            binned: true,
            chart_type: 'histogram',
            width: 375*2,
            height: 500,
            right: 20,
            target: '#histogram2',
            y_extended_ticks: true,
            x_accessor:'value',
            y_accessor:'count',
            rollover_callback: function(d, i) {
                $('#histogram2 svg .active_datapoint')
                    .html('Value: ' + d3.round(d.x,2) +  '   Count: ' + d.y);
            }
        })

    })
    req.fail( function(jqXhr, textStatus) {
        alert('fail!')
        console.log(textStatus)
    })


})
