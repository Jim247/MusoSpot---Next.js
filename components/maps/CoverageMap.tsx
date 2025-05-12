"use client"
import React, { useEffect, useRef } from 'react';

interface CoverageMapProps {
  center: { lat: number; lng: number };
  radiusMiles: number;
}

export default function CoverageMap({ center, radiusMiles }: CoverageMapProps) {
  // Always call hooks at the top level
  const mapRef = useRef<L.Map | null>(null);
  const mapId = useRef(`map-${Math.random().toString(36).slice(2, 11)}`);

  useEffect(() => {
    let leafletMap: L.Map | null = null;
    let L: typeof import('leaflet');
    let cleanup: (() => void) | undefined;

    (async () => {
      if (typeof window === 'undefined') return;
      L = (await import('leaflet')).default;

      // Initialize map only if it doesn't exist
      if (!mapRef.current) {
        leafletMap = L.map(mapId.current, {
          zoomControl: true,
          dragging: true,
          scrollWheelZoom: false,
        }).setView([center.lat, center.lng], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(leafletMap);

        mapRef.current = leafletMap;
      }

      // Update view and circle
      mapRef.current!.setView([center.lat, center.lng]);

      // Clear existing layers except tile layers
      mapRef.current!.eachLayer((layer: L.Layer) => {
        if (
          layer instanceof L.Circle ||
          layer instanceof L.Marker
        ) {
          mapRef.current!.removeLayer(layer);
        }
      });

      // Create custom marker icon
      const markerIcon = L.divIcon({
        html: `<div style="
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--aw-color-primary);
          border: 3px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
        "></div>`,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      // Add marker with custom icon
      L.marker([center.lat, center.lng], { icon: markerIcon }).addTo(mapRef.current!);

      // Add coverage circle
      L.circle([center.lat, center.lng], {
        radius: radiusMiles * 1609.34,
        color: 'var(--aw-color-primary)',
        fillColor: 'var(--aw-color-primary)',
        fillOpacity: 0.1,
        weight: 1,
      }).addTo(mapRef.current!);

      cleanup = () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    })();

    return () => {
      if (cleanup) cleanup();
    };
  }, [center, radiusMiles]);

  // Validate coordinates after hooks
  if (!center?.lat || !center?.lng) {
    return (
      <div className="w-full h-64 rounded-lg mt-2 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Location not available</p>
      </div>
    );
  }

  return <div id={mapId.current} className="w-full h-64 rounded-lg mt-2" />;
}
