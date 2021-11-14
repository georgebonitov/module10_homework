window.onload=function(){
    const wsUri = "wss://echo-ws-service.herokuapp.com";
    
    const output = document.getElementById("output");
    const btnSend = document.querySelector('.j-btn-send');
    const btnLocation = document.querySelector('.j-btn-location');
    
    let websocket;
    
    let isLocation = false;
    
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) {
        console.log("CONNECTED");
    };
    websocket.onclose = function(evt) {
        console.log("DISCONNECTED");
    };
    
    function writeToScreen(message) {
        let pre = document.createElement("p");
        pre.style.wordWrap = "break-word";
        pre.innerHTML = message;
        output.appendChild(pre);
    }
    
    websocket.onmessage = function(evt) {
        if (isLocation === false) {
            writeToScreen(
                '<span style="color: blue;">RESPONSE: ' + evt.data+'</span>'
                );
            };
        }
        websocket.onerror = function(evt) {
            writeToScreen(
                '<span style="color: red;">ERROR:</span> ' + evt.data
                );
            };
            
            btnSend.addEventListener('click', () => {
                isLocation = false;
                const message = document.querySelector('input').value;
                writeToScreen("SENT: " + message);
                websocket.send(message);
            });
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { coords } = position;
                    const linkCoords = 'https://www.openstreetmap.org/#map=13/' + coords.latitude + '/' + coords.longitude;
                    btnLocation.addEventListener('click', () => {
                        isLocation = true;
                        writeToScreen("SENT LOCATION: " + linkCoords);
                        websocket.send(coords.latitude, coords.longitude);
                    });
                });
            }
        }
        