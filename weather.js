exports.handler = (event, context, callback) => {
    // TODO implement
    var http = require('http');
    var options = {
        host: 'http://api.openweathermap.org/',
        path: '/data/2.5/forecast?id=524901&APPID=1e1fdbbbd0b6e9b797cf758f7a7836d0'
    };
    var data = null;
    var req = http.get(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        console.log(res)
        res.on('data', function(d) {
            data = d;
        })
    });
    while (result == null);
    callback(null, data);
};

