const serialPortLIB = require('serialport');
var SerialPort = serialPortLIB.SerialPort;
const { ReadlineParser } = require('@serialport/parser-readline')

const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');

const httpServer = require('http').createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(content));
    res.end(content);
});

const io = require('socket.io')(httpServer);

port = new SerialPort({
    path:'COM10',
    baudRate: 9600,

});

parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));



io.on('connect', (socket) => {
    socket.on('connect', () => {
        console.log("connected"); 
    });

    port.on('open', ()=>{
        console.log('Serial Port is opened.');
    });

    parser.on('data', function (data) {
        console.log(data);
        socket.emit('data', data);
    });
});

httpServer.listen(5000, () => {
    console.log('go to http://localhost:5000');
})

//Let's run the code in terminal