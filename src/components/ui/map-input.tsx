import { Marker } from "react-map-gl";
import { MapBox } from "./map/map";
import { GbIconGerPin } from "../icons/icons";

const isValidLatitude = (val: any): val is number =>
  typeof val === "number" && !isNaN(val) && val >= -90 && val <= 90;

const isValidLongitude = (val: any): val is number =>
  typeof val === "number" && !isNaN(val) && val >= -180 && val <= 180;

export function MapInput({
  label,
  value,
  onChange,
  error,
}: {
  label?: string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  error?: string;
}) {

  const defaultLng = 106.91377748380476;
  const defaultLat = 47.92058872954049;

  const longitude = isValidLongitude(value[0]) ? value[0] : defaultLng;
  const latitude = isValidLatitude(value[1]) ? value[1] : defaultLat;

  return (
    <div className="group/input" data-invalid={!!error}>
      <h2 className="block subpixel-antialiased text-small group-data-[required=true]/input:after:content-['*'] group-data-[required=true]/input:after:text-danger group-data-[required=true]/input:after:ml-0.5 group-data-[invalid=true]/input:text-danger w-full text-foreground mb-2">
        {label}
      </h2>
      <div className="h-[300px] w-full rounded-lg overflow-hidden">
        <MapBox
          longitude={longitude}
          latitude={latitude}
          onClick={(e) => {
            onChange([e.lngLat.lng, e.lngLat.lat]);
          }}
        >
          {value[0] && value[1] && (
            <Marker longitude={value[0]} latitude={value[1]}>
              <GbIconGerPin className="shadow-lg" />
            </Marker>
          )}
        </MapBox>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
