<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
</template>

<script>
import { onMounted } from 'vue';
import maplibregl from 'maplibre-gl';
import { PMTiles, Protocol } from 'pmtiles';

export default {
  name: 'MapAI3',
  setup() {
    onMounted(() => {
      const protocol = new Protocol();
      maplibregl.addProtocol('pmtiles', protocol.tile);

      const PMTILES_URL = '/protomaps(vector)ODbL_firenze (1).pmtiles';
      const pmtileInstance = new PMTiles(PMTILES_URL);

      protocol.add(pmtileInstance);

      pmtileInstance.getMetadata().then((metadata) => {
        const descriptionElement = document.createElement('span');
        descriptionElement.textContent = metadata.description;
        document.body.appendChild(descriptionElement);
      });

      pmtileInstance.getHeader().then((header) => {
        const map = new maplibregl.Map({
          container: 'map',
          zoom: header.maxZoom - 2,
          center: [header.centerLon, header.centerLat],
          style: {
            version: 8,
            sources: {
              example_source: {
                type: 'vector',
                url: `pmtiles://${PMTILES_URL}`,
                attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>'
              }
            },
            layers: [
              {
                id: 'water',
                source: 'example_source',
                'source-layer': 'water',
                filter: ['==', ['geometry-type'], 'Polygon'],
                type: 'fill',
                paint: {
                  'fill-color': '#80b1d3'
                }
              },
              {
                id: 'buildings',
                source: 'example_source',
                'source-layer': 'buildings',
                type: 'fill',
                paint: {
                  'fill-color': '#d9d9d9'
                }
              },
              {
                id: 'roads',
                source: 'example_source',
                'source-layer': 'roads',
                type: 'line',
                paint: {
                  'line-color': '#fc8d62'
                }
              },
              {
                id: 'pois',
                source: 'example_source',
                'source-layer': 'pois',
                type: 'circle',
                paint: {
                  'circle-color': '#ffffb3'
                }
              }
            ]
          }
        });

        map.showTileBoundaries = true;
      });
    });
  }
};
</script>

<style>
#map {
  width: 100%;
  height: 100vh;
}
</style>
