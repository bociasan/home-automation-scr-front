const WebSocket = require('ws');

let state = {
    lightAutomation : true,
    ledOutVal : false,
    ledInVal : false,
    isLocked : true,
    temperatureValue : 18.0,
    humidityValue : 35.0,
    gasValue : 0,
    isNIGHT : 0
}

const wss = new WebSocket.Server({port: 80});
wss.on('connection', function connection(ws) {

    ws.send(JSON.stringify({message: 'conected'}))

    ws.on('message', function message(data, isBinary) {
        function notifyClientsStateChanged(){
            wss.clients.forEach(function each(client) {
                // if (client !== ws && client.readyState === WebSocket.OPEN) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({state: state, type: 'getState'}))
                }
            });
        }

        // const messageBody = JSON.parse(data)
        const messageBody = data.toString()

        switch (messageBody){
            case 'getState':
                // console.log('is getstate')
                ws.send(JSON.stringify({state: state, type: 'getState'}))
                break
            case 'doorButtonClick':
                state.isLocked = !state.isLocked
                notifyClientsStateChanged()
                break

            case 'lockDoor':
                state.isLocked = true
                notifyClientsStateChanged()
                break
            case 'unlockDoor':
                state.isLocked = false
                notifyClientsStateChanged()
                break
            case 'automationOn':
                state.lightAutomation = true
                notifyClientsStateChanged()
                break
            case 'automationOff':
                state.lightAutomation = false
                notifyClientsStateChanged()
                break

            case 'indoorLightOn':
                state.ledInVal = true
                notifyClientsStateChanged()
                break
            case 'indoorLightOff':
                state.ledInVal = false
                notifyClientsStateChanged()
                break

            case 'outdoorLightOn':
                state.ledOutVal = true
                notifyClientsStateChanged()
                break
            case 'outdoorLightOff':
                state.ledOutVal = false
                notifyClientsStateChanged()
                break

            default:
                wss.clients.forEach(function each(client) {
                    // if (client !== ws && client.readyState === WebSocket.OPEN) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(data, {binary: isBinary});
                    }
                });
                break
        }

    });


});


