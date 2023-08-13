function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return unescape(pair[1]);
        }
    }
    return ('');
}

document.addEventListener("DOMContentLoaded", () => {

    // <snippet_Connection>
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:8095/api/ApiHub/")
        .configureLogging(signalR.LogLevel.Information)
        .build();
    // </snippet_Connection>

    // <snippet_ReceiveMessage>
    connection.on("SendDeviceLogEvent", (params) => {

        document.getElementById('caption').innerText = "Transaction Completed";
        window.parent.postMessage('closeModal', '*');
        //document.getElementById('closeButton').style.visibility = "visible";

        console.log("reecieved");
        window.open('', '_self', '');
        window.close();
       // window.close();
       // self.close();
    });
    // </snippet_ReceiveMessage>



    async function start() {
        try {
            //  debugger
            await connection.start();
            await connection.invoke("RegisterUsername", getQueryVariable('TransactionReference'));
            console.log("SignalR Connected.");
        } catch (err) {
            console.log(err);
            setTimeout(start, 10000);
        }
    };

    connection.onclose(start);

    // Start the connection.
    start();
});
