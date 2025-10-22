import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";

// Fix Leaflet's default icon issue in React
delete L.Icon.Default.prototype._getIconUrl();
L.Icon.Default.mergeOptions({
iconRetinaUrl:
"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom hook to fly to a bus when searched
function FlyToBus({ bus }) {
const map = useMap();
useEffect(() => {
if (bus) {
    map.flyTo([bus.lat, bus.lon], 15, { duration: 1.5 });
}
}, [bus, map]);
return null;
}

// Function to create custom colored marker icons
function markerIcon(color) {
return new L.Icon({
iconUrl: `https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-${color}.png`,
shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
iconSize: [25, 41],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
});
}

const activeIcon = markerIcon("green");
const ghostIcon = markerIcon("red");

export default function BusMap() {
const [buses, setBuses] = useState({});
const [selected, setSelected] = useState(null);
const [showGhosts, setShowGhosts] = useState(true);
const [darkMode, setDarkMode] = useState(false);
const [searchId, setSearchId] = useState("");
const [searchedBus, setSearchedBus] = useState(null);

// Setup WebSocket connection
useEffect(() => {
const socket = io("http://localhost:3100", {
    cors: {
    origin: "*",
    },
});

socket.on("connect", () => {
    console.log("Connected to WebSocket server");
});

socket.on("busData", (data) => {
    setBuses((prev) => ({ ...prev, ...data }));
});

socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
});

return () => {
    socket.disconnect();
};
}, []);

const busList = useMemo(() => Object.values(buses), [buses]);

const handleSearch = (e) => {
e.preventDefault();
if (!searchId) return;

const bus = buses[searchId];
if (bus) {
    setSearchedBus(bus);
    setSelected(bus);
} else {
    alert("Bus not found!");
}
};
const position = { lat: 26.4330, lon: 80.3453 };
return (
<div style={{ height: "100vh", width: "100%", position: "relative" }}>
    <MapContainer
    center={[26.4330, 80.3453]}
    zoom={12}
    style={{ height: "100%", width: "100%" }}
    >
        <Marker position={[position.lat, position.lon]} icon={activeIcon}>
        <Popup>Tracked Object</Popup>
        </Marker>

    <TileLayer
        url={
        darkMode
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
    />

    <FlyToBus bus={searchedBus} />

    {/* Render bus markers with custom icons */}
    {busList
        .filter((bus) => showGhosts || !bus.is_ghost)
        .map((bus) => (
        <Marker
            key={bus.id}
            position={[bus.lat, bus.lon]}
            icon={bus.is_ghost ? ghostIcon : activeIcon} // <-- Custom icon applied here
            eventHandlers={{
            click: () => setSelected(bus),
            }}
        />
        ))}

    {/* Popup for selected bus */}
    {selected && (
        <Popup
        position={[selected.lat, selected.lon]}
        onClose={() => setSelected(null)}
        >
        <div>
            <strong>Bus:</strong> {selected.id} <br />
            <strong>Status:</strong>{" "}
            {selected.is_ghost ? "Ghost (red)" : "Active (green)"} <br />
            {selected.route && (
            <>
                <strong>Route:</strong> {selected.route}
                <br />
            </>
            )}
            {selected.speed && (
            <>
                <strong>Speed:</strong> {selected.speed} km/h
            </>
            )}
        </div>
        </Popup>
    )}
    </MapContainer>

    {/* Controls */}
    <div
    style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 1000,
    }}
    >
    <button
        onClick={() => setShowGhosts((prev) => !prev)}
        style={{
        padding: "8px 12px",
        border: "none",
        borderRadius: "8px",
        background: showGhosts ? "#dc3545" : "#28a745",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
    >
        {showGhosts ? "Hide Ghost Buses" : "Show Ghost Buses"}
    </button>

    <button
        onClick={() => setDarkMode((prev) => !prev)}
        style={{
        padding: "8px 12px",
        border: "none",
        borderRadius: "8px",
        background: darkMode ? "#333" : "#555",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
    >
        {darkMode ? "Light Mode" : "Dark Mode"}
    </button>

    <form
        onSubmit={handleSearch}
        style={{
        display: "flex",
        gap: "6px",
        background: "white",
        padding: "6px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
    >
        <input
        type="text"
        placeholder="Enter Bus ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        style={{
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "120px",
        }}
        />
        <button
        type="submit"
        style={{
            padding: "9px 10px",
            border: "none",
            borderRadius: "6px",
            background: "#007bff",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
        }}
        >
        Go
        </button>
    </form>
    </div>

    {/* Legend */}
    <div
    style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        background: "rgba(255,255,255,0.9)",
        padding: "8px 12px",
        borderRadius: "8px",
        fontSize: "14px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    }}
    >
    <div>
        <img
        src="https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-green.png"
        alt="active"
        style={{ width: 15, verticalAlign: "middle", marginRight: 6 }}
        />
        Active
    </div>
    <div>
        <img
        src="https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-red.png"
        alt="ghost"
        style={{ width: 15, verticalAlign: "middle", marginRight: 6 }}
        />
        Ghost
    </div>
    </div>
</div>
);
}