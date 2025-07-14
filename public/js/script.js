/*const socket = typeof io !== "undefined" ? io() : null;
if (!socket) {
    console.error("Socket.IO client library not loaded.");
} else {
    console.log("Socket connected");

    if(navigator.geolocation) {
        navigator.geolocation.watchPosition((position)=>{
            const{latitude, longitude} = position.coords;
            socket.emit("send location",{latitude,longitude});
        },(err)=>{
            console.error("Geolocation error:", err);
        },
        {
            timeout: 5000,
            enableHighAccuracy: true,
            maximumAge: 0
        });
    }

    const map = L.map("map").setView([0,0], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "OpenStreetMap"
    }).addTo(map);

    const markers = {};

    socket.on("receive-location", (data) => {
        const {id, latitude, longitude} = data;
        map.setView([latitude, longitude], 20);
        if(markers[id]){
            markers[id].setLatLng([latitude, longitude]);
        }
        else{
            markers[id] = L.marker([latitude, longitude]).addTo(map);
        }
    });

    socket.on("user-disconnect", (id) => {
        if(markers[id]){
            map.removeLayer(markers[id]);
            delete markers[id];
        }
    });
}*/

/*
const socket = typeof io !== "undefined" ? io() : null;

if (!socket) {
    console.error("Socket.IO not loaded.");
} else {
    const us = prompt("Enter your username: ");
    const myUsername = us;

const roomName = prompt("Enter roomname: ");
socket.emit("join-room", { username: myUsername, room: roomName});

  socket.on("welcome", (name) => {
        addMessage(`You joined room:- ${roomName}`);
    console.log("room joined");
    
});

    socket.on("welcome", (name) => {
        addMessage(`You joined as:- ${myUsername}`);
    console.log("Socket connected");
    
});
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                socket.emit("send-location", { latitude, longitude }); // fixed name
            },
            (err) => {
                console.error("Geolocation error:", err);
            },
            {
                timeout: 5000,
                enableHighAccuracy: true,
                maximumAge: 0
            }
        );
    }

    const map = L.map("map").setView([0, 0], 20);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
    }).addTo(map);

//marker.bindPopup("<b>Hello!</b><br>This is a popup.").openPopup();

    const markers = {};

    socket.on("receive-location", (data) => {
  const { id, username: senderName, latitude, longitude } = data;

  map.setView([latitude, longitude], 19);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    const marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup(`${sendername}`).openPopup();
    markers[id] = marker;
  }
});



  

  // Send message
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim()) {
      socket.emit("send-message", {message: input.value});
      addMessage(`You: ${input.value}`);
      input.value = "";
    }
  });

  function addMessage(text) {
    const msgBox = document.getElementById("messages");
    const div = document.createElement("div");
    div.textContent = text;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
  }
}

*/

const socket = typeof io !== "undefined" ? io() : null;

if (!socket) {
  console.error("Socket.IO not loaded.");
} else {
  const myUsername = prompt("Enter your username:");
  const roomName = prompt("Enter room name:");
  const password = prompt("enter room password:");

  socket.emit("join-room", { username: myUsername, room: roomName, password});

socket.on("room-error", (errorMessage) => {
  alert("Error: " + errorMessage);
  window.location.reload(); // optional: force user to re-enter
});


  socket.on("welcome", (message) => {
    addMessage(message); // Already includes room and username
    console.log("Room joined");
  });

  socket.on("receive-message", ({ username, message }) => {
    addMessage(`${username}: ${message}`);
  });

  socket.on("receive-location", (data) => {
    const { id, username: senderName, latitude, longitude } = data;

    map.setView([latitude, longitude], 19);

    if (markers[id]) {
      markers[id].setLatLng([latitude, longitude]);
    } else {
      const marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup(`${senderName}`).openPopup();
      markers[id] = marker;
    }
  });

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      {
        timeout: 5000,
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );
  }

  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim()) {
      socket.emit("send-message", { message: input.value });
      addMessage(`You: ${input.value}`);
      input.value = "";
    }
  });

  const map = L.map("map").setView([0, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  const markers = {};

  function addMessage(text) {
    const msgBox = document.getElementById("messages");
    const div = document.createElement("div");
    div.textContent = text;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
  }
}
