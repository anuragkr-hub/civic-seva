'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CivicIncident } from '../../types';
import { KOLKATA_WARDS } from '../../data/kolkataWards';
import { RotateCcw, Navigation } from 'lucide-react';

interface OSMMapProps {
  incidents: CivicIncident[];
  activeIncident: CivicIncident | null;
  onSelectIncident: (incident: CivicIncident) => void;
  isHeatmapMode: boolean;
  selectedWard: string;
}

const KOLKATA_CENTER: [number, number] = [22.5726, 88.3639];
const DEFAULT_ZOOM = 13;

export default function OSMMap({
  incidents,
  activeIncident,
  onSelectIncident,
  isHeatmapMode,
  selectedWard
}: OSMMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);

  // 1. Initialize Leaflet Map with OpenStreetMap (OSM) Tiles
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: KOLKATA_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      attributionControl: true,
      minZoom: 11,
      maxZoom: 18
    });

    // Real OpenStreetMap Standard Tile Layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors • Kolkata CivicSeva'
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    heatmapLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render Incident Markers with Priority Badges
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    incidents.forEach((inc) => {
      const isSelected = activeIncident?.id === inc.id;

      // Color scheme based on Civic Priority & Status
      let bgClass = 'bg-slate-700';
      let borderHex = '#334155';

      if (inc.status === 'verified_resolved') {
        bgClass = 'bg-emerald-600';
        borderHex = '#059669';
      } else if (inc.severity === 'critical' || inc.priorityScore >= 85) {
        bgClass = 'bg-red-600';
        borderHex = '#dc2626';
      } else if (inc.severity === 'high' || inc.priorityScore >= 70) {
        bgClass = 'bg-orange-600';
        borderHex = '#ea580c';
      } else if (inc.severity === 'medium') {
        bgClass = 'bg-amber-500';
        borderHex = '#d97706';
      }

      // Custom HTML Marker matching CivicSeva identity
      const isCritical = inc.severity === 'critical' && inc.status !== 'verified_resolved';
      const markerHtml = `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          ${
            isCritical
              ? `<div style="position: absolute; inset: -4px; border-radius: 9999px; background-color: #ef4444; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
              : ''
          }
          <div class="${bgClass}" style="position: relative; width: 34px; height: 34px; border-radius: 9999px; color: white; font-weight: 800; font-size: 11px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.35); border: 2.5px solid ${
        isSelected ? '#ffffff' : '#ffffff'
      }; transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'}; transition: transform 0.2s ease;">
            ${inc.priorityScore}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'civic-osm-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([inc.latitude, inc.longitude], { icon: customIcon });

      // Interactive Tooltip
      marker.bindTooltip(
        `
        <div style="font-family: system-ui, sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
          <strong style="color: #0f172a;">#${inc.id} • ${inc.categoryDisplay}</strong><br/>
          <span style="color: #64748b;">Ward ${inc.ward} (${inc.borough})</span><br/>
          <span style="color: #ea580c; font-weight: 700;">Civic Priority: ${inc.priorityScore}/100</span>
        </div>
      `,
        {
          direction: 'top',
          offset: [0, -14],
          opacity: 0.95
        }
      );

      // On Click: Trigger drawer preview & smooth pan
      marker.on('click', () => {
        onSelectIncident(inc);
        map.panTo([inc.latitude, inc.longitude], { animate: true, duration: 0.8 });
      });

      markersLayer.addLayer(marker);
    });
  }, [incidents, activeIncident, onSelectIncident]);

  // 3. Render Heatmap Density Layer (When Toggled)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const heatmapLayer = heatmapLayerRef.current;
    if (!map || !heatmapLayer) return;

    heatmapLayer.clearLayers();

    if (isHeatmapMode) {
      incidents.forEach((inc) => {
        const radius = Math.max(180, inc.priorityScore * 3.5);
        const circleColor = inc.priorityScore >= 85 ? '#dc2626' : inc.priorityScore >= 70 ? '#ea580c' : '#f59e0b';

        const circle = L.circle([inc.latitude, inc.longitude], {
          radius,
          color: circleColor,
          weight: 1,
          opacity: 0.7,
          fillColor: circleColor,
          fillOpacity: 0.28
        });

        heatmapLayer.addLayer(circle);
      });
    }
  }, [incidents, isHeatmapMode]);

  // 4. Smooth Flight when Ward is Selected from Dropdown
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || selectedWard === 'all') return;

    const wardNum = Number(selectedWard);
    const matchedWard = KOLKATA_WARDS.find((w) => w.ward === wardNum);

    if (matchedWard && matchedWard.coordinates) {
      map.flyTo([matchedWard.coordinates.lat, matchedWard.coordinates.lng], 15, {
        duration: 1.2
      });
    }
  }, [selectedWard]);

  // Recenter Action
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(KOLKATA_CENTER, DEFAULT_ZOOM, {
        duration: 1.0
      });
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* Real Leaflet OpenStreetMap Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Recenter / Navigation Button */}
      <button
        onClick={handleRecenter}
        className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-slate-800 px-3 py-2 rounded-xl shadow-lg border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
        title="Recenter Kolkata View"
      >
        <Navigation className="w-3.5 h-3.5 text-orange-600" />
        <span>Recenter Kolkata</span>
      </button>
    </div>
  );
}
