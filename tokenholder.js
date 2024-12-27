const WebSocket = require("ws");
const encrypted1 = require("./fetch1.js");
const encrypted2 = require("./fetch2.js");
const {
  ᐃΔⲆΔΔⵠⲆ,
  ⵠⲆΔⲆⲆⵠΔⲆᐃ
} = require("./fetchToken.js");
const {
  request
} = require("./requst.js");
const log = console.log;
let recaptchaToken;
let token;
let lut1;
let lut2;
let lut3;
let info1;
let info2;
let fetchToken = ᐃΔⲆΔΔⵠⲆ;
let decode = ⵠⲆΔⲆⲆⵠΔⲆᐃ;
function fetchse() {
  request(`https://token.starve.io/token?id=0`, function (b) {
    var a = b.split("_");
    b = a[0] + "_";
    a = Math.abs(fetchToken(Number(a[1])));
    token = b + a;
    log(token);
  });
  request(`https://token2.starve.io/let`, function (b) {
    b = b.split(":");
    var a = b[0].split("_");
    var c = a[0] + "_";
    a = Math.abs(encrypted1[a[1]]);
    lut1 = c + a;
    info1 = a;
    a = b[1].split("_");
    c = a[0] + "_";
    a = Math.abs(encrypted2[a[1]]);
    lut2 = c + a;
    info2 = a;
    c = b[2].split("_");
    b = c[0] + "_";
    c = Math.abs(encrypted2[c[1]]);
    lut3 = b + c;
    log(lut1);
    log(lut2);
    log(lut3);
  });
}
function trySend(data) {
  if (!data.server) {
    return;
  }
  const socketUrl = `${data.server}?${lut3}`;
  if (token && lut1 && lut2) {
    log("connecting");
    const socket = new WebSocket(socketUrl, {
      headers: {
        connection: "Upgrade",
        pragma: "no-cache",
        "cache-control": "no-cache",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        upgrade: "websocket",
        origin: "https://starve.io",
        "sec-websocket-version": "13",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "sec-websocket-extensions": "permessage-deflate; client_max_window_bits"
      }
    });
    socket.binaryType = "arraybuffer";
    socket.addEventListener("open", () => {
      log("WebSocket connection opened");
      socket.send(JSON.stringify(["jeralo", 4040, 2360, 52, data.token, data.token_id, 0, 0, 0, 0, 0, 1, 0, 0, 0, null, token, data.recaptcha, lut1, lut2]));
    });
    socket.addEventListener("message", event => {
      if (typeof event.data == "string") {
        var msg = JSON.parse(event.data);
        // log(msg);
      } else {
        var msg = decode(event.data, info1, info2);
        // var ⵠⲆΔⲆⲆ = ᐃᐃᐃΔ[ⲆᐃΔΔⲆⲆΔ[247]];
        // var ui8 = new Uint8Array(event.data);
        switch (msg[0]) {
          case 16:
            log(msg[2]);
            if (msg[2] <= 90) {
              socket.send(JSON.stringify([33, 201]));
            }
            break;
          case 38:
            if (msg[1] <= 90) {
              socket.send(JSON.stringify([33, 201]));
            }
            break;
        }
      }
    });
    socket.addEventListener("close", () => {
      log("Connection closed");
    });
    setInterval(() => {
      if (socket.readyState == 1) {
        // socket.send(JSON.stringify([33, 201]))
        // socket.send(JSON.stringify([5, "TOKEN HOLDER?"]));
      }
    }, 2000);
  }
}
const wss = new WebSocket.Server({
  port: 8080
});
wss.on("connection", ws => {
  console.log("Client connected.");
  ws.on("message", message => {
    const data = JSON.parse(message);
    log(data);
    fetchse();
    setTimeout(() => {
      trySend(data);
    }, 2000);
  });
  ws.on("close", () => {
    console.log("Client disconnected.");
  });
  ws.on("error", error => {
    console.error(`WebSocket error: ${error}`);
  });
});
