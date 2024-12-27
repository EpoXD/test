// ==UserScript==
// @name         Holder
// @namespace    http://tampermonkey.net/
// @version      2024-12-26
// @description  try to take over the world!
// @author       You
// @match        https://starve.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=starve.io
// @run-at       document-start
// @grant        none
// ==/UserScript==

let log = console.context().log;
window.log = log;
let client;
let world;
let user;
let server;
let token;
let token_id;
let tokenCounter = 0;
let ogopd = Object.getOwnPropertyDescriptor;
let ohop = Object.prototype.hasOwnProperty;
Object.getOwnPropertyDescriptor = function () {
  return false;
};
let sussyTime = performance.now();
Object.prototype.hasOwnProperty = function () {
  if (performance.now() - sussyTime < 5000) {
    return ohop.apply(this, arguments);
  } else {
    return false;
  }
};
let master = Symbol();
function hooks() {
  Object.defineProperty(Object.prototype, "connect", {
    get() {
      return this[master];
    },
    set(data) {
      this[master] = data;
      if (!client) {
        client = this;
        window.client = client;
        log(client);
      }
    }
  });
  Object.defineProperty(Object.prototype, "mode", {
    get() {
      return this[master];
    },
    set(data) {
      this[master] = data;
      if (!world && !this.cache) {
        world = this;
        window.world = world;
        log(world);
      }
    }
  });
  Object.defineProperty(Object.prototype, "control", {
    get() {
      return this[master];
    },
    set(data) {
      this[master] = data;
      if (!user) {
        user = this;
        log(user);
        window.user = user;
        document.getElementById("trevda").style.display = "none";
      }
    }
  });
}
hooks();
function visuals() {
  // Create the main container
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "10px";
  container.style.right = "10px";
  container.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  container.style.border = "1px solid #ccc";
  container.style.borderRadius = "8px";
  container.style.padding = "10px";
  container.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  container.style.zIndex = "9999";
  container.style.fontFamily = "Arial, sans-serif";

  // Helper function to create a labeled input
  function createLabeledInput(labelText, inputPlaceholder, defaultValue = "") {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.marginBottom = "10px";
    const label = document.createElement("label");
    label.textContent = labelText;
    label.style.marginRight = "10px";
    label.style.fontWeight = "bold";
    label.style.minWidth = "60px"; // Ensure labels align
    wrapper.appendChild(label);
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = inputPlaceholder;
    input.value = defaultValue;
    input.style.flex = "1";
    input.style.padding = "5px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "4px";
    wrapper.appendChild(input);
    container.appendChild(wrapper);
    return input;
  }

  // Create the inputs and their labels
  const tokenInput = createLabeledInput("Token:", "Enter Token", "DefaultTokenName");
  const tokenIdInput = createLabeledInput("TokenId:", "Enter TokenId", "DefaultTokenId");

  // Create the Join button
  const joinButton = document.createElement("button");
  joinButton.textContent = "Join";
  joinButton.style.display = "block";
  joinButton.style.width = "100%";
  joinButton.style.padding = "5px";
  joinButton.style.backgroundColor = "#007bff";
  joinButton.style.color = "#fff";
  joinButton.style.border = "none";
  joinButton.style.borderRadius = "4px";
  joinButton.style.cursor = "pointer";
  joinButton.style.fontWeight = "bold";
  tokenInput.value = user[window.token];
  tokenIdInput.value = user[window.token_id];
  joinButton.addEventListener("click", () => {
    const token = tokenInput.value;
    const tokenId = tokenIdInput.value;
    if (token && tokenId) {
      ws();
      alert(`Joining with Token: ${token} and TokenId: ${tokenId}`);
    } else {
      alert("Please fill in both Token and TokenId fields.");
    }
  });
  container.appendChild(joinButton);
  document.body.appendChild(container);
}
function cutWebSocketUrl(url) {
  return url.replace(/\?.*$/, "");
}
function hookWs() {
  let proox = Proxy;
  (function () {
    window.WebSocket = new proox(WebSocket, {
      construct(target, argArray) {
        let ws = new target(...argArray);
        log(ws);
        if (!ws.url.includes("localhost")) {
          server = cutWebSocketUrl(ws.url);
        }
        ws.send = new proox(ws.send, {
          apply(target, thisArg, argArray) {
            if (typeof argArray[0] === "string") {
              const data = JSON.parse(argArray[0]);
            }
            return target.apply(thisArg, argArray);
          }
        });
        return ws;
      }
    });
  })();
}
document.addEventListener("DOMContentLoaded", event => {
  hookWs();
});
function mainHooks() {
  for (let i in user) {
    if (typeof user[i] === "string") {
      tokenCounter++;
      if (tokenCounter === 1) {
        token = i;
        window.token = i;
      }
      if (tokenCounter === 2) {
        token_id = i;
        window.token_id = i;
      }
    }
  }
}
let ready_ = 0;
function ws() {
  const ws = new WebSocket("ws://localhost:8080");
  ws.addEventListener("open", event => {
    ws.send(JSON.stringify({
      token: user[window.token],
      token_id: user[window.token_id],
      server: server
    }));
  });
  ws.addEventListener("close", event => {});
  ws.addEventListener("error", event => {});
  ws.addEventListener("message", event => {});
}
function initialize() {
  if (ready_ === 0 && user && client && world) {
    mainHooks();
    visuals();
    log("On");
    ready_++;
  }
}
setInterval(initialize, 200);