<template>
  <div class="page-bg min-h-screen w-full flex flex-col items-center justify-start">
    <!-- Header -->
    <header class="sticky top-0 z-20 bg-white flex items-center justify-between mb-8 py-4 px-6 border-b border-gray-200 shadow-sm w-screen left-0" style="max-width:100vw;">
      <div class="flex items-center gap-3">
        <svg class="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0H7m6 0v6m0 0H7m6 0h6" /></svg>
        <span class="text-xl font-bold text-gray-800"></span>
      </div>
      <span class="text-xs text-gray-400">Generated: {{ new Date().toLocaleDateString() }}</span>
    </header>
    <!-- Address Card (full width, white) -->
    <div class="w-full flex justify-center bg-transparent">
      <div class="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100 w-full max-w-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold leading-tight mb-1 text-gray-900">{{ property.address }}</h1>
          <div class="text-base text-gray-500 font-medium mb-2">
            
          </div>
        </div>
        <button class="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-semibold text-sm shadow hover:brightness-110 transition whitespace-nowrap">This is my home</button>
      </div>
    </div>
    <!-- Google Street View Hybrid Card -->
    <div class="w-full flex justify-center mb-8">
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 w-full max-w-3xl overflow-hidden flex flex-col items-center relative">
        <div v-if="!showStreetView360" class="w-full h-[28rem] relative cursor-pointer group" @click="openStreetView360">
          <img
            :src="streetViewUrl"
            alt="Google Street View"
            class="object-cover w-full h-full select-none"
            @error="streetViewImgError = true"
          />
          <div v-if="streetViewImgError" class="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-lg font-semibold">
            No Street View available for this address.
          </div>
          <div v-else class="absolute inset-0 flex flex-col items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-14 h-14 mb-2 text-white drop-shadow" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="rgba(0,0,0,0.2)"/><path d="M8 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span class="text-white text-lg font-bold drop-shadow">View 360°</span>
          </div>
        </div>
        <div v-else class="w-full h-[28rem]" id="street-view-360"></div>
        <button v-if="showStreetView360" @click="closeStreetView360" class="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow transition"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
      </div>
    </div>
    <!-- Main Content Card -->
    <div class="bg-white rounded-2xl shadow-md p-5 mb-8 border border-gray-100 w-full max-w-3xl">
      <!-- Category Cards -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Access Card -->
        <div class="rounded-2xl shadow-md bg-white p-6 border border-gray-200 hover:shadow-lg transition flex flex-col justify-between min-h-[140px]">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-block w-3 h-3 rounded-full bg-black shadow"></span>
            <span class="font-semibold text-black text-lg">Access</span>
          </div>
          <div class="text-black text-base leading-relaxed flex-1">
            <p v-if="property.access">{{ property.access }}</p>
            <p v-else>No access data available.</p>
          </div>
        </div>
        <!-- Hazard Card -->
        <div class="rounded-2xl shadow-md bg-white p-6 border border-gray-200 hover:shadow-lg transition flex flex-col justify-between min-h-[140px]">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-block w-3 h-3 rounded-full bg-black shadow"></span>
            <span class="font-semibold text-black text-lg">Hazard</span>
          </div>
          <div class="space-y-4">
            <!-- Bushfire -->
            <div class="flex items-center gap-3">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 12V7a2 2 0 012-2h2m8 0h2a2 2 0 012 2v5m-8 4v4m0 0h4m-4 0H8" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17c0-2.5 2-3.5 2-5.5 0-1.5-1-2.5-2-2.5s-2 1-2 2.5c0 2 2 3 2 5.5z" fill="#fff" stroke="#FF6B6B" stroke-width="1.5"/></svg>
              <div>
                <span class="font-semibold text-black">Bushfire</span>
                <span class="ml-2 px-2 py-0.5 rounded bg-gray-200 text-xs font-semibold text-gray-600 align-middle">NOT DETECTED</span>
                <div class="text-gray-500 text-sm leading-relaxed mt-1">We haven't detected any bushfire related overlays on this property.</div>
              </div>
            </div>
            <!-- Flood -->
            <div class="flex items-center gap-3">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 12V7a2 2 0 012-2h2m8 0h2a2 2 0 012 2v5" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 18c1.5 1.5 4.5 1.5 6 0s4.5-1.5 6 0" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round"/></svg>
              <div>
                <span class="font-semibold text-black">Flood</span>
                <span class="ml-2 px-2 py-0.5 rounded bg-gray-200 text-xs font-semibold text-gray-600 align-middle">NOT DETECTED</span>
                <div class="text-gray-500 text-sm leading-relaxed mt-1">We haven't detected any flood management overlays on this property.</div>
              </div>
            </div>
            <!-- Noise -->
            <div class="flex items-center gap-3">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 12V7a2 2 0 012-2h2m8 0h2a2 2 0 012 2v5" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 18c1.5-1.5 6.5-1.5 8 0" stroke="#F59E42" stroke-width="1.5" stroke-linecap="round"/></svg>
              <div>
                <span class="font-semibold text-black">Noise</span>
                <span class="ml-2 px-2 py-0.5 rounded bg-gray-200 text-xs font-semibold text-gray-600 align-middle">NOT DETECTED</span>
                <div class="text-gray-500 text-sm leading-relaxed mt-1">We haven't detected any noise overlays on this property.</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Safety Card -->
        <div class="rounded-2xl shadow-md bg-white p-6 border border-gray-200 hover:shadow-lg transition flex flex-col justify-between min-h-[140px]">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-block w-3 h-3 rounded-full bg-black shadow"></span>
            <span class="font-semibold text-black text-lg">Safety</span>
          </div>
          <div class="text-black text-base leading-relaxed flex-1">
            <p v-if="property.safety">{{ property.safety }}</p>
            <p v-else>No safety data available.</p>
          </div>
        </div>
        <!-- Census Card -->
        <div class="rounded-2xl shadow-md bg-white p-6 border border-gray-200 hover:shadow-lg transition flex flex-col justify-between min-h-[140px]">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-block w-3 h-3 rounded-full bg-black shadow"></span>
            <span class="font-semibold text-black text-lg">Census</span>
          </div>
          <div class="text-black text-base leading-relaxed flex-1">
            <p v-if="property.census">{{ property.census }}</p>
            <p v-else>No census data available.</p>
          </div>
        </div>
      </section>
    </div>
    <!-- Map Card (full width, white) -->
    <div class="w-full flex justify-center bg-transparent">
      <div class="bg-white rounded-2xl shadow-md p-0 mb-8 border border-gray-100 w-full max-w-3xl overflow-hidden">
        <div class="flex justify-end p-4 gap-2">
          <button @click="setMapStyle('satellite-v9')" :class="['px-3 py-1 rounded font-semibold text-sm', mapStyle === 'satellite-v9' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">Satellite</button>
          <button @click="setMapStyle('streets-v12')" :class="['px-3 py-1 rounded font-semibold text-sm', mapStyle === 'streets-v12' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">Default</button>
          <button @click="setMapStyle('street-view')" :class="['px-3 py-1 rounded font-semibold text-sm', mapStyle === 'street-view' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">Street View</button>
        </div>
        <div v-if="!showStreetView" class="w-full h-96" id="report-map"></div>
        <div v-else class="w-full h-96" id="street-view-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import type { Property } from '@/types/property';
import { createLengthLabel } from '@/utils/mapUtils';

const route = useRoute()
const addressParam = computed(() => route.query.address as string || '')
const latParam = computed(() => route.query.lat ? Number(route.query.lat) : null)
const lngParam = computed(() => route.query.lng ? Number(route.query.lng) : null)

// Use address/lat/lng from query if present, otherwise fallback to default
const property = ref<Property>({
  address: addressParam.value || '1 bearke place bracken ridge 4017 QLD',
  lotDp: 'Lot 1 DP 123456',
  access: 'Close to public transport and main roads.',
  hazard: { flood: 'Low risk', bushfire: 'Not in bushfire zone', noise: 'Low' },
  safety: 'Low crime rate, close to police station.',
  census: 'Population: 2,000, Median age: 35'
});

const mapStyle = ref('satellite-v9');
let mapInstance: any = null;
let streetViewPanorama: any = null;
const showStreetView = ref(false);
const showStreetView360 = ref(false);
const streetViewImgError = ref(false);
const streetViewUrl = computed(() => {
  // Use the address from the property card, fallback to a default if empty
  const address = property.value.address || '36-st-james-road-bondi-junction-2022';
  // Google Street View API expects address with dashes instead of spaces and all lowercase
  const formatted = address.trim().toLowerCase().replace(/\s+/g, '-');
  return `https://maps.googleapis.com/maps/api/streetview?size=640x360&radius=15&return_error_code=true&source=outdoor&location=${encodeURIComponent(formatted)}&key=AIzaSyDtcpZMaC13xHQEux1qzwv1g3GGGxkrKyc`;
});

// Add Google Maps type declaration for TS
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
declare global {
  interface Window {
    google?: any;
  }
}

async function fetchLotGeoJSON(lng: number, lat: number) {
  const url = `http://localhost:54321/rest/v1/rpc/get_lot_details?long=${lng}&lat=${lat}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data && data.length > 0 && data[0].geom) {
    return data[0].geom;
  }
  return null;
}

function setMapStyle(style: string) {
  if (style === 'street-view') {
    // Open Google Maps Street View in a new tab for the property address
    const address = property.value.address || 'Carseldine, QLD 4034';
    const url = `https://www.google.com/maps?q=&layer=c&cbll=-27.3516,153.0405&cbp=11,0,0,0,0`;
    window.open(url, '_blank');
    return;
  }
  mapStyle.value = style;
  showStreetView.value = false;
  const mapDiv = document.getElementById('report-map');
  if (mapDiv) mapDiv.style.display = 'block';
  const svDiv = document.getElementById('street-view-container');
  if (svDiv) svDiv.style.display = 'none';
  if (mapInstance) {
    mapInstance.setStyle(`mapbox://styles/mapbox/${style}`);
    // The lot boundary and overlays will be restored in the styledata event
  }
}

function openStreetView360() {
  if (streetViewImgError.value) return;
  showStreetView360.value = true;
  nextTick(() => {
    initStreetView360();
  });
}
function closeStreetView360() {
  showStreetView360.value = false;
}

function initStreetView360() {
  const svDiv = document.getElementById('street-view-360');
  if (!svDiv) return;
  svDiv.innerHTML = '';
  // Prefer lat/lng from query params if available
  const lat = latParam.value;
  const lng = lngParam.value;
  if (window.google && window.google.maps) {
    if (lat !== null && lng !== null) {
      // Use provided lat/lng directly
      const svService = new window.google.maps.StreetViewService();
      const location = { lat, lng };
      svService.getPanorama({ location, radius: 50 }, (data, svStatus) => {
        if (svStatus === 'OK' && data && data.location) {
          let heading = 165; // fallback default
          if (data.links && data.links.length > 0 && typeof data.links[0].heading === 'number') {
            heading = data.links[0].heading;
          }
          new window.google.maps.StreetViewPanorama(svDiv, {
            position: { lat: data.location.latLng.lat(), lng: data.location.latLng.lng() },
            pov: { heading, pitch: 0 },
            zoom: 1,
            addressControl: false,
            fullscreenControl: false,
            linksControl: true,
            panControl: true,
            enableCloseButton: false
          });
        } else {
          svDiv.innerHTML = '<div class="text-gray-400 text-center py-8">No Street View available for this location.</div>';
        }
      });
    } else {
      // Fallback: geocode the address
      const address = property.value.address || '1 bearke place bracken ridge 4017 QLD';
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const svService = new window.google.maps.StreetViewService();
          svService.getPanorama({ location, radius: 50 }, (data, svStatus) => {
            if (svStatus === 'OK' && data && data.location) {
              let heading = 165; // fallback default
              if (data.links && data.links.length > 0 && typeof data.links[0].heading === 'number') {
                heading = data.links[0].heading;
              }
              new window.google.maps.StreetViewPanorama(svDiv, {
                position: { lat: data.location.latLng.lat(), lng: data.location.latLng.lng() },
                pov: { heading, pitch: 0 },
                zoom: 1,
                addressControl: false,
                fullscreenControl: false,
                linksControl: true,
                panControl: true,
                enableCloseButton: false
              });
            } else {
              svDiv.innerHTML = '<div class="text-gray-400 text-center py-8">No Street View available for this address.</div>';
            }
          });
        } else {
          svDiv.innerHTML = '<div class="text-gray-400 text-center py-8">No Street View available for this address.</div>';
        }
      });
    }
  }
}

// Helper to add lot boundary and overlays (polygon, outline, labels)
async function addLotBoundaryAndLabels(map: any, lng: number, lat: number) {
  const geojson = await fetchLotGeoJSON(lng, lat);
  if (geojson && geojson.type === 'Polygon') {
    const coords = geojson.coordinates[0];
    document.querySelectorAll('.lot-length-label').forEach(el => el.remove());
    const lotFeature = { type: 'Feature', geometry: geojson, properties: {} };
    const centroid = turf.centerOfMass(lotFeature);
    if (centroid && centroid.geometry && centroid.geometry.coordinates) {
      map.setCenter(centroid.geometry.coordinates);
    }
    if (map.getSource('lot-polygon')) {
      map.getSource('lot-polygon').setData(lotFeature);
    } else {
      map.addSource('lot-polygon', {
        type: 'geojson',
        data: lotFeature
      });
      map.addLayer({
        id: 'lot-polygon-fill',
        type: 'fill',
        source: 'lot-polygon',
        paint: {
          'fill-color': '#a259e6',
          'fill-opacity': 0.35
        }
      });
      map.addLayer({
        id: 'lot-polygon-outline',
        type: 'line',
        source: 'lot-polygon',
        paint: {
          'line-color': '#fff',
          'line-width': 3
        }
      });
    }
    for (let i = 0; i < coords.length - 1; i++) {
      const line = turf.lineString([coords[i], coords[i + 1]]);
      const len = turf.length(line, { units: 'kilometers' });
      const lenMeters = len * 1000;
      const mid = turf.midpoint(turf.point(coords[i]), turf.point(coords[i + 1]));
      new mapboxgl.Marker({ element: createLengthLabel(lenMeters) })
        .setLngLat(mid.geometry.coordinates as [number, number])
        .addTo(map);
    }
    setTimeout(() => {
      const mapboxLogo = document.querySelector('.mapboxgl-ctrl-logo');
      if (mapboxLogo) (mapboxLogo as HTMLElement).style.display = 'none';
      const mapboxAttribution = document.querySelector('.mapboxgl-ctrl-attrib');
      if (mapboxAttribution) (mapboxAttribution as HTMLElement).style.display = 'none';
    }, 500);
  }
}

onMounted(async () => {
  property.value = {
    address: addressParam.value || '1 bearke place bracken ridge 4017 QLD',
    lotDp: 'Lot 1 DP 123456',
    access: 'Close to public transport and main roads.',
    hazard: { flood: 'Low risk', bushfire: 'Not in bushfire zone', noise: 'Low' },
    safety: 'Low crime rate, close to police station.',
    census: 'Population: 2,000, Median age: 35'
  };

  // Mapbox map rendering
  if (typeof window !== 'undefined' && document.getElementById('report-map')) {
    if (!window.mapboxgl) {
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.onload = () => { initMap(); };
      document.head.appendChild(script);
      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    } else {
      initMap();
    }
  }

  // Load Google Maps JS API for Street View 360
  await nextTick();
  if (!window.google || !window.google.maps) {
    const gmapScript = document.createElement('script');
    gmapScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDtcpZMaC13xHQEux1qzwv1g3GGGxkrKyc';
    gmapScript.async = true;
    gmapScript.defer = true;
    gmapScript.onload = () => {
      initStreetView360();
    };
    document.head.appendChild(gmapScript);
  } else {
    initStreetView360();
  }

  // Hide Street View container by default
  const svDiv = document.getElementById('street-view-container');
  if (svDiv) svDiv.style.display = 'none';

  function initMap() {
    // @ts-ignore
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA';
    // Use dynamic lat/lng from query params if available, otherwise fallback
    const lng = lngParam.value !== null ? lngParam.value : 153.0405;
    const lat = latParam.value !== null ? latParam.value : -27.3516;
    // @ts-ignore
    mapInstance = new mapboxgl.Map({
      container: 'report-map',
      style: `mapbox://styles/mapbox/${mapStyle.value}`,
      center: [lng, lat],
      zoom: 19
    });
    // Remove marker: do not add a pin

    // Add lot boundary and overlays initially
    addLotBoundaryAndLabels(mapInstance, lng, lat);

    // Re-add overlays after every style change
    mapInstance.on('styledata', () => {
      addLotBoundaryAndLabels(mapInstance, lng, lat);
    });
  }

  function initStreetView360() {
    const svDiv = document.getElementById('street-view-360');
    if (!svDiv) return;
    svDiv.innerHTML = '';
    // Prefer lat/lng from query params, fallback to geocoding address
    if (latParam.value !== null && lngParam.value !== null) {
      // Use lat/lng directly for Street View panorama
      const svService = new window.google.maps.StreetViewService();
      const location = { lat: latParam.value, lng: latParam.value };
      svService.getPanorama({ location, radius: 50 }, (data, svStatus) => {
        if (svStatus === 'OK' && data && data.location) {
          let heading = 165; // fallback default
          if (data.links && data.links.length > 0 && typeof data.links[0].heading === 'number') {
            heading = data.links[0].heading;
          }
          new window.google.maps.StreetViewPanorama(svDiv, {
            position: { lat: data.location.latLng.lat(), lng: data.location.latLng.lng() },
            pov: { heading, pitch: 0 },
            zoom: 1,
            addressControl: false,
            fullscreenControl: false,
            linksControl: true,
            panControl: true,
            enableCloseButton: false
          });
        } else {
          svDiv.innerHTML = '<div class="text-gray-400 text-center py-8">No Street View available for this address.</div>';
        }
      });
    } else {
      // Fallback: geocode the address
      const address = property.value.address || '1 bearke place bracken ridge 4017 QLD';
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const svService = new window.google.maps.StreetViewService();
          svService.getPanorama({ location, radius: 50 }, (data, svStatus) => {
            if (svStatus === 'OK' && data && data.location) {
              let heading = 165;
              if (data.links && data.links.length > 0 && typeof data.links[0].heading === 'number') {
                heading = data.links[0].heading;
              }
              new window.google.maps.StreetViewPanorama(svDiv, {
                position: { lat: data.location.latLng.lat(), lng: data.location.latLng.lng() },
                pov: { heading, pitch: 0 },
                zoom: 1,
                addressControl: false,
                fullscreenControl: false,
                linksControl: true,
                panControl: true,
                enableCloseButton: false
              });
            } else {
              svDiv.innerHTML = '<div class="text-gray-400 text-center py-8">No Street View available for this address.</div>';
            }
          });
        } else {
          svDiv.innerHTML = '<div class="text-gray-400 text-center py-8">No Street View available for this address.</div>';
        }
      });
    }
  }
})

// Optional: Watch for address changes to reset Street View
watch(() => property.value.address, () => {
  showStreetView360.value = false;
  streetViewImgError.value = false;
});
</script>

<style scoped>
.page-bg {
  background: #ececec;
}
.container {
  min-height: 100vh;
}
.bg-white {
  background: #fff;
}
.shadow-md {
  box-shadow: 0 2px 8px 0 rgba(60, 60, 90, 0.07), 0 1.5px 4px 0 rgba(60, 60, 90, 0.04);
}
button {
  font-family: inherit;
}
.min-h-\[140px\] {
  min-height: 140px;
}
header.sticky {
  position: sticky;
  top: 0;
  left: 0;
  width: 100vw;
  max-width: 100vw;
  background: #fff;
  z-index: 20;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px 0 rgba(60, 60, 90, 0.04);
}
</style>
