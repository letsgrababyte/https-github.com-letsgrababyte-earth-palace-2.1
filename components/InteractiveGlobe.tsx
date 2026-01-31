import React, { useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';

// Declare WorldWind global variable provided by the script in index.html
declare const WorldWind: any;

interface InteractiveGlobeProps {
  size?: number | string; // Allow '100%'
  isInteractive?: boolean;
  onClick?: () => void;
  onLocationSelect?: (locationData: any) => void;
  autoRotate?: boolean;
  highQuality?: boolean;
  showLabels?: boolean;
  borderOpacity?: number; // 0 to 1
  borderColor?: string;   // Hex color
}

// Helper to convert hex to WorldWind Color
const hexToWwColor = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return new WorldWind.Color(r, g, b, alpha);
};

export const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({ 
  size = 48, 
  isInteractive = false, 
  onClick, 
  onLocationSelect,
  autoRotate = true,
  showLabels = false,
  borderOpacity = 0.6,
  borderColor = '#22c55e', // default green
}) => {
  const canvasId = useRef(`wwd-canvas-${Math.random().toString(36).substr(2, 9)}`);
  const wwdRef = useRef<any>(null);
  const polygonLayerRef = useRef<any>(null);
  const labelLayerRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync label visibility
  useEffect(() => {
    if (labelLayerRef.current) {
      labelLayerRef.current.enabled = showLabels;
      if (wwdRef.current) wwdRef.current.redraw();
    }
  }, [showLabels]);

  // Sync border styles
  useEffect(() => {
    if (polygonLayerRef.current && wwdRef.current) {
      const newColor = hexToWwColor(borderColor, borderOpacity);
      polygonLayerRef.current.renderables.forEach((renderable: any) => {
        if (renderable.attributes) {
          renderable.attributes.outlineColor = newColor;
        }
      });
      wwdRef.current.redraw();
    }
  }, [borderColor, borderOpacity]);

  useEffect(() => {
    if (typeof WorldWind === 'undefined') {
      console.error("WorldWind library not loaded.");
      return;
    }

    // Initialize WorldWindow
    const wwd = new WorldWind.WorldWindow(canvasId.current);
    wwdRef.current = wwd;

    // Standard Layers
    const layers = [
      new WorldWind.BMNGLayer(),
      new WorldWind.AtmosphereLayer(), 
      new WorldWind.StarFieldLayer(),
    ];

    if (isInteractive) {
        layers.push(new WorldWind.CompassLayer());
        const controls = new WorldWind.ViewControlsLayer(wwd);
        controls.placement = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0);
        layers.push(controls);
    }

    layers.forEach(layer => {
      layer.enabled = true;
      wwd.addLayer(layer);
    });

    // --- Load GeoJSON for Countries ---
    if (isInteractive) {
        setLoading(true);
        
        const safetyTimeout = setTimeout(() => {
            setLoading(false);
        }, 15000);

        const polygonLayer = new WorldWind.RenderableLayer("Countries");
        polygonLayerRef.current = polygonLayer;
        
        const labelLayer = new WorldWind.RenderableLayer("Country Names");
        labelLayer.enabled = showLabels;
        labelLayerRef.current = labelLayer;

        polygonLayer.pickEnabled = true;
        wwd.addLayer(polygonLayer);
        wwd.addLayer(labelLayer);

        const shapeConfigurationCallback = (geometry: any, properties: any) => {
            const configuration = new WorldWind.ShapeAttributes(null);
            configuration.drawOutline = true;
            configuration.outlineColor = hexToWwColor(borderColor, borderOpacity); 
            configuration.outlineWidth = 0.8;
            configuration.drawInterior = true;
            configuration.interiorColor = new WorldWind.Color(0.1, 0.5, 0.1, 0.1);

            const highlightAttributes = new WorldWind.ShapeAttributes(configuration);
            highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.2); 
            highlightAttributes.outlineColor = WorldWind.Color.WHITE;
            highlightAttributes.outlineWidth = 2.0;

            const rawName = properties.name || properties.NAME || properties.admin || properties.ADMIN || properties.title;
            const countryId = properties.id || properties.iso_a3 || properties.ISO_A3;

            if (rawName && geometry) {
                let lat = 0, lon = 0;
                if (countryId === 'USA' || rawName.toLowerCase().includes('united states')) {
                    lat = 39.8283; lon = -98.5795;
                } else if (geometry.type === 'Polygon') {
                    const ring = geometry.coordinates[0];
                    ring.forEach((p: any) => { lon += p[0]; lat += p[1]; });
                    lat /= ring.length; lon /= ring.length;
                } else if (geometry.type === 'MultiPolygon') {
                    let maxVertices = 0;
                    let bestRing = geometry.coordinates[0][0];
                    geometry.coordinates.forEach((poly: any) => {
                        if (poly[0].length > maxVertices) {
                            maxVertices = poly[0].length;
                            bestRing = poly[0];
                        }
                    });
                    bestRing.forEach((p: any) => { lon += p[0]; lat += p[1]; });
                    lat /= bestRing.length; lon /= bestRing.length;
                }

                const text = new WorldWind.GeographicText(new WorldWind.Position(lat, lon, 10000), rawName);
                text.attributes.color = WorldWind.Color.WHITE;
                text.attributes.outlineColor = WorldWind.Color.BLACK;
                text.attributes.font.size = 12;
                text.attributes.enableOutline = true;
                text.declutterGroup = 1;
                labelLayer.addRenderable(text);
            }

            return {
                attributes: configuration,
                highlightAttributes: highlightAttributes,
                userProperties: properties
            };
        };

        const parserCompletionCallback = (layer: any) => {
            clearTimeout(safetyTimeout);
            wwd.redraw();
            setLoading(false);
        };

        const geoJsonUrl = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";
        
        try {
            const parser = new WorldWind.GeoJSONParser(geoJsonUrl);
            parser.load(parserCompletionCallback, shapeConfigurationCallback, polygonLayer);
        } catch (e) {
            console.error("GeoJSON parser failed", e);
            clearTimeout(safetyTimeout);
            setLoading(false);
        }

        const handleInteraction = (recognizer: any) => {
            const x = recognizer.clientX;
            const y = recognizer.clientY;
            const pickList = wwd.pick(wwd.canvasCoordinates(x, y));
            if (pickList.objects.length > 0) {
                const topPick = pickList.objects.find((obj: any) => !obj.isTerrain && obj.userObject);
                if (topPick) {
                    const renderable = topPick.userObject;
                    const props = renderable.userProperties || renderable._userProperties || renderable.properties || (renderable.attributes ? renderable.attributes.userProperties : null) || {};
                    const rawName = props.name || props.NAME || props.admin || props.ADMIN || props.title || props.formal_en;
                    const countryId = props.id || props.iso_a3 || props.ISO_A3 || renderable.id;

                    if (rawName || countryId) {
                        const targetLat = renderable.sector ? renderable.sector.centroidLatitude() : (topPick.position ? topPick.position.latitude : 0);
                        const targetLon = renderable.sector ? renderable.sector.centroidLongitude() : (topPick.position ? topPick.position.longitude : 0);
                        const navigator = wwd.navigator;
                        const startLat = navigator.lookAtLocation.latitude;
                        const startLon = navigator.lookAtLocation.longitude;
                        const startRange = navigator.range;
                        const targetRange = Math.min(6500000, startRange); 
                        const duration = 900;
                        const startTime = Date.now();
                        const animate = () => {
                            const now = Date.now();
                            const t = Math.min(1, (now - startTime) / duration);
                            const ease = 1 - Math.pow(1 - t, 4); 
                            navigator.lookAtLocation.latitude = startLat + (targetLat - startLat) * ease;
                            navigator.lookAtLocation.longitude = startLon + (targetLon - startLon) * ease;
                            navigator.range = startRange + (targetRange - startRange) * ease;
                            wwd.redraw();
                            if (t < 1) requestAnimationFrame(animate);
                        };
                        animate();
                        if (onLocationSelect) {
                            onLocationSelect({ ...props, name: rawName, countryCode: countryId });
                        }
                    }
                }
            }
        };

        new WorldWind.TapRecognizer(wwd, handleInteraction);
        new WorldWind.ClickRecognizer(wwd, handleInteraction);
        return () => clearTimeout(safetyTimeout);
    }

    if (!isInteractive) {
        wwd.worldWindowController = null;
    }

    if (autoRotate && !isInteractive) {
        const rotate = () => {
             if (wwdRef.current) {
                 const currentLookAt = wwdRef.current.navigator.lookAtLocation;
                 wwdRef.current.navigator.lookAtLocation = new WorldWind.Location(currentLookAt.latitude, currentLookAt.longitude + 0.3);
                 wwdRef.current.redraw();
                 animationRef.current = requestAnimationFrame(rotate);
             }
        };
        animationRef.current = requestAnimationFrame(rotate);
    }

    return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        wwdRef.current = null;
    };
  }, [isInteractive, autoRotate, size]);

  return (
    <div 
        className={`relative overflow-hidden bg-[#000814] ${isInteractive ? 'w-full h-full' : 'rounded-full shadow-inner'}`}
        style={typeof size === 'number' ? { width: size, height: size } : { width: '100%', height: '100%' }}
    >
      <canvas id={canvasId.current} className="w-full h-full block touch-none" style={{ cursor: isInteractive ? 'crosshair' : 'default' }}>
        Mapping Engine...
      </canvas>
      {loading && isInteractive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xl z-20 pointer-events-none">
              <div className="relative">
                  <div className="w-16 h-16 border-4 border-green-500/10 border-t-green-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center"><Globe className="h-6 w-6 text-green-500 animate-pulse" /></div>
              </div>
              <div className="mt-6 text-white text-[10px] font-black tracking-[0.4em] uppercase opacity-80">Syncing Globe...</div>
          </div>
      )}
      {!isInteractive && (
          <div className="absolute inset-0 z-30 cursor-pointer" onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}>
             <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] pointer-events-none"></div>
          </div>
      )}
    </div>
  );
};