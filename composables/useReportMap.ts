import { ref, onMounted, nextTick } from 'vue';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

export function useReportMap(mapStyle, lngParam, latParam, fetchLotGeoJSON, createLengthLabel) {
  const mapInstance = ref<any>(null);

  function setMapStyle(style: string, showStreetView, mapDivId = 'report-map', svDivId = 'street-view-container') {
    if (mapStyle.value === style) return;
    mapStyle.value = style;
    showStreetView.value = false;
    const mapDiv = document.getElementById(mapDivId);
    if (mapDiv) mapDiv.style.display = 'block';
    const svDiv = document.getElementById(svDivId);
    if (svDiv) svDiv.style.display = 'none';
    if (mapInstance.value) {
      mapInstance.value.setStyle(`mapbox://styles/mapbox/${style}`);
    }
  }

  async function addLotBoundaryAndLabels(map, lng, lat) {
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

  function initMap(containerId = 'report-map') {
    // @ts-ignore
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA';
    const lng = lngParam.value !== null ? lngParam.value : 153.0405;
    const lat = latParam.value !== null ? latParam.value : -27.3516;
    // @ts-ignore
    mapInstance.value = new mapboxgl.Map({
      container: containerId,
      style: `mapbox://styles/mapbox/${mapStyle.value}`,
      center: [lng, lat],
      zoom: 19
    });
    addLotBoundaryAndLabels(mapInstance.value, lng, lat);
    mapInstance.value.on('styledata', () => {
      addLotBoundaryAndLabels(mapInstance.value, lng, lat);
    });
  }

  return {
    mapInstance,
    setMapStyle,
    initMap,
    addLotBoundaryAndLabels
  };
}
