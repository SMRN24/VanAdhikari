/* Style reminder: Forest Canopy / Field Notebook — a real paper-map surface with understated controls, warm overlays, and India-first civic intelligence. */
import "leaflet/dist/leaflet.css";
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export interface MapMarker {
  id: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  risk: "High" | "Medium" | "Low";
  claims: number;
  pending: number;
}

interface MapViewProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  markers?: MapMarker[];
  onMarkerSelect?: (marker: MapMarker) => void;
  onMapReady?: (map: LeafletMap) => void;
  showMarkers?: boolean;
  showBacklog?: boolean;
  showAnomalies?: boolean;
}

function MapBridge({ center, zoom, onMapReady }: { center: [number, number]; zoom: number; onMapReady?: (map: LeafletMap) => void }) {
  const map = useMap();
  useEffect(() => { onMapReady?.(map); }, [map, onMapReady]);
  useEffect(() => { map.setView(center, zoom, { animate: true }); }, [center, zoom, map]);
  return null;
}

const markerColor = (risk: MapMarker["risk"]) => risk === "High" ? "#c96f4b" : risk === "Medium" ? "#c49042" : "#5f9271";

export function MapView({
  className,
  initialCenter = [22.5, 79],
  initialZoom = 4.5,
  markers = [],
  onMarkerSelect,
  onMapReady,
  showMarkers = true,
  showBacklog = true,
  showAnomalies = true,
}: MapViewProps) {
  return (
    <div className={cn("relative w-full h-[500px]", className)}>
      <MapContainer center={initialCenter} zoom={initialZoom} minZoom={2} maxZoom={18} worldCopyJump scrollWheelZoom zoomControl={false} className="leaflet-map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
        />
        <MapBridge center={initialCenter} zoom={initialZoom} onMapReady={onMapReady} />
        {showBacklog && markers.map((marker) => <Circle key={`backlog-${marker.id}`} center={[marker.lat, marker.lng]} radius={Math.max(3500, marker.pending * 2.2)} pathOptions={{ color: "#c49042", weight: 1, fillColor: "#c49042", fillOpacity: 0.08 }} />)}
        {showMarkers && markers.map((marker) => (
          <CircleMarker
            key={marker.id}
            center={[marker.lat, marker.lng]}
            radius={showAnomalies && marker.risk === "High" ? 10 : showAnomalies && marker.risk === "Medium" ? 8 : 6}
            pathOptions={{ color: "#f7faf2", weight: showAnomalies && marker.risk !== "Low" ? 3 : 2, fillColor: showAnomalies ? markerColor(marker.risk) : "#5f9271", fillOpacity: 0.96 }}
            eventHandlers={{ click: () => onMarkerSelect?.(marker) }}
          >
            <Popup>
              <strong>{marker.district}</strong><br />
              <span>{marker.state} · {marker.risk} attention</span><br />
              <span>{marker.claims.toLocaleString()} claims · {marker.pending.toLocaleString()} pending</span>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
