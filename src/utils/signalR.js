import { MessageBox, Message } from 'element-ui'

export function connection() {
  const baseUrl = "http://localhost:9989";
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(baseUrl + "/hubs/clientbrowser")
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("SendMessage", (message) => {
    console.log("SendMessage", message);
    Message({
      message: message,
      type: 'info',
      duration: 5 * 1000
    })
  });

  connection
    .start()
    .then(() => {
      console.log("SignalR connection started successfully.");
    })
    .catch((err) => {
      console.error("Error starting SignalR connection: " + err);
      connection = null;
    });
  return connection;
}
