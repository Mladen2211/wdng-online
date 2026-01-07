'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import Map, { Marker as MapboxMarker, NavigationControl, MapMouseEvent, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Component to handle map centering
const MapCenterHandler = ({ coordinates, mapRef }: { coordinates: { lat: number; lng: number }, mapRef: React.RefObject<MapRef | null> }) => {
  useEffect(() => {
    if (coordinates && mapRef.current) {
      mapRef.current.flyTo({ center: [coordinates.lng, coordinates.lat], zoom: 15 });
    }
  }, [coordinates, mapRef]);
  
  return null;
};

const LocationSelectorDialog = ({
  currentLocation,
  currentCoordinates,
  onSelect,
  onClose
}: {
  currentLocation: string;
  currentCoordinates: { lat: number; lng: number } | undefined;
  onSelect: (location: string, coordinates: { lat: number; lng: number }) => void;
  onClose: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState(currentLocation);
  const [selectedCoordinates, setSelectedCoordinates] = useState(currentCoordinates || { lat: 45.8150, lng: 15.9775 });
  const [isSearching, setIsSearching] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const mapRef = useRef<MapRef>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col p-8 text-center">
          <h3 className="text-xl font-bold text-red-600 mb-2">Map Configuration Error</h3>
          <p className="text-stone-600 mb-4">
            The Mapbox token is missing. Please add <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> to your environment variables.
          </p>
          <button 
            onClick={onClose}
            className="bg-stone-100 text-stone-800 px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors self-center"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Search using OpenStreetMap Nominatim API with suggestions
  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=5&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setSearchSuggestions(data);
        setShowSuggestions(true);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search function
  const debouncedSearch = (query: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      handleSearch(query);
    }, 200); // 200ms delay - faster response
    setSearchTimeout(timeout);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuggestionSelect = (suggestion: any) => {
    const newCoords = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    };
    setSelectedCoordinates(newCoords);
    // Don't set searchQuery - let user type custom name
    setShowSuggestions(false);

    // Map will be centered automatically by the useEffect when coordinates change
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedCoordinates({ lat, lng });
    setShowSuggestions(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMarkerDragEnd = (event: any) => {
    const { lng, lat } = event.lngLat;
    setSelectedCoordinates({ lat, lng });
  };

  const handleMapClick = (event: MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    handleLocationSelect(lat, lng);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex justify-between items-center">
          <h3 className="font-bold text-stone-800">Select Location</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
            <X size={20} />
          </button>
        </div>

        {/* Search Suggestions Dropdown - positioned at top of modal */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="mx-4 mt-2 bg-white border border-stone-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent blur from firing
                  handleSuggestionSelect(suggestion);
                }}
                className="w-full text-left px-3 py-2 hover:bg-stone-50 border-b border-stone-100 last:border-b-0 focus:bg-stone-50 focus:outline-none transition-colors"
              >
                <div className="text-sm font-medium text-stone-800 truncate">
                  {suggestion.display_name}
                </div>
                <div className="text-xs text-stone-500">
                  {suggestion.type && `${suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}`}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative p-4 border-b border-stone-100">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                placeholder="Type a custom name for this location..."
                className={`w-full px-3 py-2 rounded-lg border text-sm font-medium text-stone-800 bg-white outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  selectedCoordinates ? 'border-green-500 bg-green-50' : 'border-stone-200'
                }`}
              />
              {selectedCoordinates && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                  <Check size={16} />
                </div>
              )}
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Map Area */}
        <div className="relative h-96 bg-stone-100">
          <Map
            ref={mapRef}
            initialViewState={{
              longitude: 15.9775,
              latitude: 45.8150,
              zoom: 13
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={MAPBOX_TOKEN}
            onClick={handleMapClick}
          >
            <NavigationControl position="top-right" />
            <MapCenterHandler coordinates={selectedCoordinates} mapRef={mapRef} />
            <MapboxMarker
              longitude={selectedCoordinates.lng}
              latitude={selectedCoordinates.lat}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
              color="#d97706" // amber-600
            />
          </Map>

          {/* Coordinates display */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <div className="text-xs font-mono text-stone-600">
              {selectedCoordinates.lat.toFixed(6)}, {selectedCoordinates.lng.toFixed(6)}
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <div className="text-xs text-stone-600">
              Click on the map or drag the marker to select location
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 flex justify-between items-center">
          <div className="text-sm text-stone-600">
            Selected: <span className="font-medium">{searchQuery || 'Custom Location'}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSelect(searchQuery, selectedCoordinates)}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Select Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelectorDialog;
