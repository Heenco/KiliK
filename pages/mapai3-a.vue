<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
</template>

<script>
import { onMounted } from 'vue';
import maplibregl from 'maplibre-gl';
import { PMTiles, Protocol } from 'pmtiles';

export default {
  name: 'MapAI7',
  setup() {
    onMounted(() => {
      const protocol = new Protocol();
      maplibregl.addProtocol('pmtiles', protocol.tile);

      const PMTILES_URL = '/LandZoning.pmtiles';
      const pmtileInstance = new PMTiles(PMTILES_URL);

      protocol.add(pmtileInstance);

      pmtileInstance.getMetadata().then((metadata) => {
        console.log('Metadata:', metadata);
        const vectorLayers = metadata.vector_layers;
        console.log('Vector Layers:', vectorLayers);
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
                id: 'landzoning',
                source: 'example_source',
                'source-layer': 'landzoning',
                filter: ['==', ['geometry-type'], 'Polygon'],
                type: 'fill',
                paint: {
                  'fill-color': '#a6cee3',
                  'fill-opacity': 0.6
                }
              }
            ] // Add layers dynamically based on vectorLayers
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
