"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  RESTAURANT_LOCATION,
  getNeighbourhoodLocation,
} from "../lib/neighbourhoods";

const restaurantIcon = L.divIcon({
  className: "uber-map-marker",
  html: '<div class="restaurant-marker">R</div>',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const destinationIcon = L.divIcon({
  className: "uber-map-marker",
  html: '<div class="destination-marker">D</div>',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

function createCarIcon(bearing) {
  return L.divIcon({
    className: "uber-map-marker",
    html: `
      <div class="moving-car" style="transform: rotate(${bearing}deg)">
        <svg viewBox="0 0 48 48" width="42" height="42" aria-label="Delivery car">
          <circle cx="24" cy="24" r="23" fill="#247344" stroke="#ffffff" stroke-width="3"/>
          <g transform="translate(0 1)">
            <path d="M15 16 L18 10 L30 10 L33 16 L36 19 L36 32 L32 32 L32 35 L27 35 L27 32 L21 32 L21 35 L16 35 L16 32 L12 32 L12 19 Z"
              fill="#ffffff" stroke="#164b2b" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M19 13 L29 13 L31 18 L17 18 Z" fill="#8ed8f8"/>
            <path d="M16 21 L32 21 L32 28 L16 28 Z" fill="#d9f2ff"/>
            <path d="M14 21 L17 21 L17 26 L14 26 Z" fill="#263238"/>
            <path d="M31 21 L34 21 L34 26 L31 26 Z" fill="#263238"/>
            <circle cx="17" cy="30" r="2" fill="#263238"/>
            <circle cx="31" cy="30" r="2" fill="#263238"/>
          </g>
        </svg>
      </div>
    `,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
  });
}

function FitRoute({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length < 2) return;

    let frameId;

    frameId = requestAnimationFrame(() => {
      map.invalidateSize();

      const bounds = L.latLngBounds(positions);

      if (!bounds.isValid()) return;

      map.fitBounds(bounds, {
        paddingTopLeft: [45, 45],
        paddingBottomRight: [45, 45],
        maxZoom: 15,
        animate: false,
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [map, positions]);

  return null;
}

function getDistance(start, end) {
  return L.latLng(start).distanceTo(L.latLng(end));
}

function getPositionAndBearing(route, progress) {
  if (!route || route.length < 2) {
    return {
      position: route?.[0] ?? [0, 0],
      bearing: 0,
    };
  }

  const lengths = [];
  let total = 0;

  for (let i = 1; i < route.length; i++) {
    const length = getDistance(route[i - 1], route[i]);
    lengths.push(length);
    total += length;
  }

  if (!total) {
    return { position: route[0], bearing: 0 };
  }

  let remaining = total * Math.max(0, Math.min(1, progress));

  for (let i = 0; i < lengths.length; i++) {
    const start = route[i];
    const end = route[i + 1];
    const length = lengths[i];

    if (remaining <= length || i === lengths.length - 1) {
      const fraction = length
        ? Math.min(1, remaining / length)
        : 0;

      const position = [
        start[0] + (end[0] - start[0]) * fraction,
        start[1] + (end[1] - start[1]) * fraction,
      ];

      const lat1 = (start[0] * Math.PI) / 180;
      const lat2 = (end[0] * Math.PI) / 180;
      const deltaLon = ((end[1] - start[1]) * Math.PI) / 180;

      const y = Math.sin(deltaLon) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

      const bearing = (Math.atan2(y, x) * 180) / Math.PI;

      return {
        position,
        bearing: (bearing + 360) % 360,
      };
    }

    remaining -= length;
  }

  return {
    position: route[route.length - 1],
    bearing: 0,
  };
}

function getTravelledRoute(route, progress) {
  if (!route || route.length === 0) return [];
  if (progress <= 0) return [route[0]];

  const lengths = [];
  let total = 0;

  for (let i = 1; i < route.length; i++) {
    const length = getDistance(route[i - 1], route[i]);
    lengths.push(length);
    total += length;
  }

  if (!total) return [route[0]];

  let remaining = total * Math.min(1, progress);
  const result = [route[0]];

  for (let i = 1; i < route.length; i++) {
    const start = route[i - 1];
    const end = route[i];
    const length = lengths[i - 1];

    if (remaining >= length) {
      result.push(end);
      remaining -= length;
    } else {
      const fraction = length ? remaining / length : 0;

      result.push([
        start[0] + (end[0] - start[0]) * fraction,
        start[1] + (end[1] - start[1]) * fraction,
      ]);

      break;
    }
  }

  return result;
}

export default function TrackingMap({
  neighbourhood,
  progress = 0,
  status,
}) {
  const [roadRoute, setRoadRoute] = useState(null);
  const [routeMessage, setRouteMessage] = useState(
    "Finding the delivery route…"
  );

  const restaurant = useMemo(
    () => [
      RESTAURANT_LOCATION.latitude,
      RESTAURANT_LOCATION.longitude,
    ],
    []
  );

  const destinationLocation = getNeighbourhoodLocation(neighbourhood);

  const destination = useMemo(
    () => [
      destinationLocation.latitude,
      destinationLocation.longitude,
    ],
    [
      destinationLocation.latitude,
      destinationLocation.longitude,
    ]
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadRoute() {
      setRoadRoute(null);
      setRouteMessage("Finding the delivery route…");

      try {
        const url =
          "https://router.project-osrm.org/route/v1/driving/" +
          `${restaurant[1]},${restaurant[0]};` +
          `${destination[1]},${destination[0]}` +
          "?overview=full&geometries=geojson";

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Route request failed");
        }

        const data = await response.json();
        const coordinates = data.routes?.[0]?.geometry?.coordinates;

        if (!coordinates || coordinates.length < 2) {
          throw new Error("No route found");
        }

        setRoadRoute(
          coordinates.map(([longitude, latitude]) => [
            latitude,
            longitude,
          ])
        );

        setRouteMessage("Simulated driving route");
      } catch (error) {
        if (error.name === "AbortError") return;

        setRoadRoute([restaurant, destination]);
        setRouteMessage("Approximate simulated route");
      }
    }

    loadRoute();

    return () => controller.abort();
  }, [restaurant, destination]);

  const route = useMemo(
    () => roadRoute ?? [restaurant, destination],
    [roadRoute, restaurant, destination]
  );

  const fitPositions = useMemo(
    () => [restaurant, ...route, destination],
    [restaurant, route, destination]
  );

  const safeProgress = Number.isFinite(Number(progress))
    ? Math.max(0, Math.min(1, Number(progress)))
    : 0;

  const effectiveProgress =
    status === "Delivered"
      ? 1
      : status === "Delivering"
        ? safeProgress
        : 0;

  const car = useMemo(
    () => getPositionAndBearing(route, effectiveProgress),
    [route, effectiveProgress]
  );

  const travelledRoute = useMemo(
    () => getTravelledRoute(route, effectiveProgress),
    [route, effectiveProgress]
  );

  const carIcon = useMemo(
    () => createCarIcon(car.bearing),
    [car.bearing]
  );

  return (
    <div
      className="tracking-map"
      role="region"
      aria-label={`Delivery map to ${neighbourhood}`}
    >
      <MapContainer
        center={restaurant}
        zoom={13}
        scrollWheelZoom
        className="tracking-map-canvas"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <FitRoute positions={fitPositions} />

        <Polyline
          positions={route}
          pathOptions={{
            color: "#f07828",
            weight: 5,
            opacity: 0.75,
          }}
        />

        <Polyline
          positions={travelledRoute}
          pathOptions={{
            color: "#247344",
            weight: 6,
            opacity: 1,
          }}
        />

        <Marker position={restaurant} icon={restaurantIcon}>
          <Popup>Addis Eats · Starting point</Popup>
        </Marker>

        <Marker
          position={car.position}
          icon={carIcon}
          zIndexOffset={1000}
        >
          <Popup>
            {status === "Delivered"
              ? "Delivery completed"
              : status === "Delivering"
                ? "Your delivery is on the way"
                : "Courier starting point"}
          </Popup>
        </Marker>

        <Marker position={destination} icon={destinationIcon}>
          <Popup>Delivery destination · {neighbourhood}</Popup>
        </Marker>
      </MapContainer>

      <div className="tracking-map-caption">
        <span className="tracking-map-live-dot" />
        {routeMessage}
      </div>
    </div>
  );
}