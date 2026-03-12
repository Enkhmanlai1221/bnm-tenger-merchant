"use client";

import Map, { MapMouseEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type MapBoxProps = {
  longitude: number;
  latitude: number;
  zoom?: number;
  onClick?: (e: MapMouseEvent) => void;
  children?: React.ReactNode;
};

export function MapBox({
  longitude,
  latitude,
  zoom = 12,
  onClick,
  children,
}: MapBoxProps) {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        longitude,
        latitude,
        zoom,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onClick={onClick}
    >
      {children}
    </Map>
  );
}
