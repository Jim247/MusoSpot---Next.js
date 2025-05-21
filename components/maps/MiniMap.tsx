'use client';
import React, { useEffect, useRef, memo, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap } from 'leaflet';

interface MiniMapProps {
  lat: number;
  lng: number;
  className?: string;
  id: string;
  radius?: number;
}

export const MiniMap = memo(({ lat, lng, className = 'h-full w-full', id, radius }: MiniMapProps) => {
  const [leaflet, setLeaflet] = useState<typeof import('leaflet') | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamically import Leaflet on the client
  useEffect(() => {
    import('leaflet').then((L) => {
      setLeaflet(L);
    });
  }, []);

  useEffect(() => {
    if (!leaflet || !containerRef.current) return;

    const container = containerRef.current;
    const L = leaflet; // Store reference for cleanup

    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Calculate zoom level based on radius
      const zoomLevel = radius ? Math.min(13, Math.max(8, 13 - Math.log2(radius / 10))) : 13;

      const map = L.map(container, {
        attributionControl: false,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
      }).setView([lat, lng], zoomLevel);

      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
      }).addTo(map);

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
      L.marker([lat, lng], { icon: markerIcon }).addTo(map);

      // Add radius circle if radius is provided (ensure radius is a number)
      if (typeof radius === 'number' && radius > 0) {
        const circle = L.circle([lat, lng], {
          radius: radius * 1609.34, // Convert miles to meters
          color: 'var(--aw-color-primary)', // Use primary color from CSS
          fillColor: 'var(--aw-color-primary)',
          fillOpacity: 0.1,
          weight: 1,
        }).addTo(map);

        // Fit bounds to include the circle
        map.fitBounds(circle.getBounds(), { padding: [20, 20] });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leaflet, lat, lng, radius, id]);

  return <div id={id} ref={containerRef} className={`${className}`} />;
});

MiniMap.displayName = 'MiniMap';

export default MiniMap;
