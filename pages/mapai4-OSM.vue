<template>
  <div class="fixed inset-0 overflow-hidden">
    <div id="map" class="w-full h-full"></div>

    <!-- Layer Control Panel -->
    <div class="absolute top-20 right-4 bg-white rounded-lg shadow-lg p-6 pl-8 min-w-100 max-w-96 z-10 max-h-[80vh] flex flex-col">
      <h3 class="font-semibold text-base mb-4 flex-shrink-0">Layer List</h3>
      
      <div class="overflow-y-auto flex-1 pr-4">
        <Accordion type="multiple" class="w-full" :default-value="['section-0', 'section-1', 'section-2', 'section-3', 'section-4', 'section-5']">
        <AccordionItem 
          v-for="(section, index) in layerSections" 
          :key="section.name" 
          :value="`section-${index}`"
          class="border-b border-gray-100 last:border-b-0"
        >
          <AccordionTrigger class="py-3 pl-8 text-sm font-semibold text-gray-800 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
            <span class="pr-16">{{ section.name }}</span>
          </AccordionTrigger>
          <AccordionContent class="pb-3 pt-1">
            <div>
              <div v-for="subsection in section.subsections" :key="subsection.name" class="mb-2">
                <label class="flex items-center cursor-pointer py-4 pl-0 pr-3 rounded-lg hover:bg-gray-50 transition-colors group border-b border-white last:border-b-0">
                  <div class="w-10"></div>
                  <Switch 
                    v-model="subsection.visible"
                    @update:modelValue="toggleLayer(subsection.layerId)"
                    class="mr-5 ml-4"
                  />
                  <div 
                    class="w-6 h-4 rounded-full mr-5 border border-gray-300 shadow-sm"
                    :style="{ backgroundColor: getLayerColor(subsection.layerId) }"
                  ></div>
                  <span class="text-sm text-gray-700 group-hover:text-gray-900 font-medium pl-18 pr-8 py-6">{{ subsection.name }}</span>
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Switch } from '~/components/ui/switch';

let map = null;

// Layer visibility state with OSM categories
const layerSections = reactive([
  {
    name: 'All Places',
    subsections: [
      { name: 'All POIs', layerId: 'all-pois', visible: false, count: 0 },
    ],
  },
  {
    name: 'Essential Daily Needs',
    subsections: [
      { name: 'Healthcare', layerId: 'healthcare', visible: false, count: 0 },
      { name: 'Pharmacies', layerId: 'pharmacy', visible: false, count: 0 },
      { name: 'Supermarkets', layerId: 'supermarket', visible: true, count: 0 },
      { name: 'Convenience Stores', layerId: 'convenience', visible: false, count: 0 },
      { name: 'Banks & ATMs', layerId: 'banking', visible: false, count: 0 },
    ],
  },
  {
    name: 'Food & Dining',
    subsections: [
      { name: 'Restaurants', layerId: 'restaurant', visible: false, count: 0 },
      { name: 'Cafes', layerId: 'cafe', visible: false, count: 0 },
      { name: 'Fast Food', layerId: 'fast_food', visible: false, count: 0 },
      { name: 'Bars & Pubs', layerId: 'bar', visible: false, count: 0 },
    ],
  },
  {
    name: 'Shopping',
    subsections: [
      { name: 'Retail Shops', layerId: 'shop', visible: false, count: 0 },
      { name: 'Shopping Centers', layerId: 'mall', visible: false, count: 0 },
      { name: 'Clothing', layerId: 'clothes', visible: false, count: 0 },
    ],
  },
  {
    name: 'Transportation',
    subsections: [
      { name: 'Bus Stops', layerId: 'bus_stop', visible: false, count: 0 },
      { name: 'Train Stations', layerId: 'railway_station', visible: false, count: 0 },
      { name: 'Fuel Stations', layerId: 'fuel', visible: false, count: 0 },
      { name: 'Parking', layerId: 'parking', visible: false, count: 0 },
    ],
  },
  {
    name: 'Recreation & Leisure',
    subsections: [
      { name: 'Parks', layerId: 'park', visible: false, count: 0 },
      { name: 'Sports & Fitness', layerId: 'sports', visible: false, count: 0 },
      { name: 'Entertainment', layerId: 'entertainment', visible: false, count: 0 },
      { name: 'Tourism', layerId: 'tourism', visible: false, count: 0 },
    ],
  },
  {
    name: 'Community & Services',
    subsections: [
      { name: 'Schools', layerId: 'school', visible: false, count: 0 },
      { name: 'Libraries', layerId: 'library', visible: false, count: 0 },
      { name: 'Government', layerId: 'government', visible: false, count: 0 },
      { name: 'Religious', layerId: 'place_of_worship', visible: false, count: 0 },
    ],
  },
]);

const getLayerColor = (layerId) => {
  const colorMap = {
    'all-pois': '#808080',        // Gray for all POIs
    'healthcare': '#FF4444',      // Red for healthcare
    'pharmacy': '#FF6666',        // Light red for pharmacy
    'supermarket': '#4CAF50',     // Green for supermarket
    'convenience': '#66BB6A',     // Light green for convenience
    'banking': '#2196F3',         // Blue for banking
    'restaurant': '#E91E63',      // Pink for restaurant
    'cafe': '#F06292',            // Light pink for cafe
    'fast_food': '#AD1457',       // Dark pink for fast food
    'bar': '#8E24AA',             // Purple for bar
    'shop': '#9C27B0',            // Purple for shop
    'mall': '#BA68C8',            // Light purple for mall
    'clothes': '#AB47BC',         // Medium purple for clothes
    'bus_stop': '#607D8B',        // Blue-gray for bus stop
    'railway_station': '#455A64', // Dark blue-gray for railway
    'fuel': '#FF9800',            // Orange for fuel
    'parking': '#795548',         // Brown for parking
    'park': '#4CAF50',            // Green for park
    'sports': '#8BC34A',          // Light green for sports
    'entertainment': '#673AB7',   // Deep purple for entertainment
    'tourism': '#3F51B5',         // Indigo for tourism
    'school': '#FF9800',          // Orange for school
    'library': '#FFC107',         // Amber for library
    'government': '#009688',      // Teal for government
    'place_of_worship': '#CDDC39', // Lime for religious
  };
  return colorMap[layerId] || '#888888';
};

const toggleLayer = (layerId) => {
  const subsection = layerSections.flatMap(section => section.subsections).find(sub => sub.layerId === layerId);
  if (map && subsection) {
    const visibility = subsection.visible ? 'visible' : 'none';
    map.setLayoutProperty(layerId, 'visibility', visibility);
  }
};

onMounted(() => {
  // Cleanup any existing map to prevent duplicate layers
  if (map) {
    map.remove();
    map = null;
  }
  
  map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/positron',
    center: [153.0281, -27.4678], // Brisbane coordinates
    zoom: 12,
  });

  map.on('load', () => {
    console.log('Map loaded successfully');
    
    // Add OSM vector tile source
    map.addSource('osm-planetiler', {
      type: 'vector',
      tiles: ['https://dwuxtsziek7cf.cloudfront.net/planet/{z}/{x}/{y}.mvt'],
      minzoom: 0,
      maxzoom: 14
    });

    // Debug: Log all available properties from the first few features
    map.on('sourcedata', (e) => {
      if (e.sourceId === 'osm-planetiler' && e.isSourceLoaded) {
        const features = map.querySourceFeatures('osm-planetiler', {
          sourceLayer: 'poi'
        });
        if (features.length > 0) {
          console.log('Sample POI properties:', features.slice(0, 10).map(f => f.properties));
          
          // Show unique subclass values
          const subclasses = [...new Set(features.map(f => f.properties.subclass).filter(Boolean))];
          console.log('Available subclasses:', subclasses.sort());
        }
      }
    });

    // Create layers for each category
    layerSections.forEach(section => {
      section.subsections.forEach(subsection => {
        const layerConfig = {
          // All POIs
          'all-pois': {
            filter: null, // Show all POIs
            color: '#808080'
          },
          // Essential Daily Needs
          'healthcare': {
            filter: ['any',
              ['==', ['get', 'subclass'], 'hospital'],
              ['==', ['get', 'subclass'], 'clinic'],
              ['==', ['get', 'subclass'], 'doctors'],
              ['==', ['get', 'subclass'], 'dentist'],
              ['==', ['get', 'subclass'], 'pharmacy']
            ],
            color: '#FF4444'
          },
          'pharmacy': {
            filter: ['==', ['get', 'subclass'], 'pharmacy'],
            color: '#FF6666'
          },
          'supermarket': {
            filter: ['==', ['get', 'subclass'], 'supermarket'],
            color: '#4CAF50'
          },
          'convenience': {
            filter: ['==', ['get', 'subclass'], 'convenience'],
            color: '#66BB6A'
          },
          'banking': {
            filter: ['any',
              ['==', ['get', 'subclass'], 'bank'],
              ['==', ['get', 'subclass'], 'atm']
            ],
            color: '#2196F3'
          },
          // Food & Dining
          'restaurant': {
            filter: ['==', ['get', 'subclass'], 'restaurant'],
            color: '#E91E63'
          },
          'cafe': {
            filter: ['==', ['get', 'subclass'], 'cafe'],
            color: '#F06292'
          },
          'fast_food': {
            filter: ['==', ['get', 'subclass'], 'fast_food'],
            color: '#AD1457'
          },
          'bar': {
            filter: ['any',
              ['==', ['get', 'subclass'], 'bar'],
              ['==', ['get', 'subclass'], 'pub']
            ],
            color: '#8E24AA'
          },
          // Shopping
          'shop': {
            filter: ['any',
              ['==', ['get', 'subclass'], 'clothes'],
              ['==', ['get', 'subclass'], 'electronics'],
              ['==', ['get', 'subclass'], 'books'],
              ['==', ['get', 'subclass'], 'shoes']
            ],
            color: '#9C27B0'
          },
          'mall': {
            filter: ['==', ['get', 'subclass'], 'mall'],
            color: '#BA68C8'
          },
          'clothes': {
            filter: ['==', ['get', 'subclass'], 'clothes'],
            color: '#AB47BC'
          },
          // Transportation
          'bus_stop': {
            filter: ['==', ['get', 'subclass'], 'bus_stop'],
            color: '#607D8B'
          },
          'railway_station': {
            filter: ['any',
              ['==', ['get', 'subclass'], 'station'],
              ['==', ['get', 'subclass'], 'railway_station']
            ],
            color: '#455A64'
          },
          'fuel': {
            filter: ['==', ['get', 'subclass'], 'fuel'],
            color: '#FF9800'
          },
          'parking': {
            filter: ['==', ['get', 'subclass'], 'parking'],
            color: '#795548'
          },
          // Recreation & Leisure
          'park': {
            filter: ['any',
              ['==', ['get', 'subclass'], 'park'],
              ['==', ['get', 'subclass'], 'recreation_ground']
            ],
            color: '#4CAF50'
          },
          'sports': {
            filter: ['any',
              ['==', ['get', 'subclass'], 'sports_centre'],
              ['==', ['get', 'subclass'], 'fitness_centre'],
              ['==', ['get', 'subclass'], 'stadium']
            ],
            color: '#8BC34A'
          },
          'entertainment': {
            filter: ['any',
              ['==', ['get', 'subclass'], 'cinema'],
              ['==', ['get', 'subclass'], 'theatre'],
              ['==', ['get', 'subclass'], 'amusement_arcade']
            ],
            color: '#673AB7'
          },
          'tourism': {
            filter: ['any',
              ['==', ['get', 'subclass'], 'attraction'],
              ['==', ['get', 'subclass'], 'museum'],
              ['==', ['get', 'subclass'], 'gallery']
            ],
            color: '#3F51B5'
          },
          // Community & Services
          'school': {
            filter: ['==', ['get', 'subclass'], 'school'],
            color: '#FF9800'
          },
          'library': {
            filter: ['==', ['get', 'subclass'], 'library'],
            color: '#FFC107'
          },
          'government': {
            filter: ['any',
              ['==', ['get', 'subclass'], 'townhall'],
              ['==', ['get', 'subclass'], 'government']
            ],
            color: '#009688'
          },
          'place_of_worship': {
            filter: ['==', ['get', 'subclass'], 'place_of_worship'],
            color: '#CDDC39'
          },
        };

        const config = layerConfig[subsection.layerId] || {
          filter: null,
          color: '#888888'
        };

        const layerDefinition = {
          id: subsection.layerId,
          type: 'circle',
          source: 'osm-planetiler',
          'source-layer': 'poi',
          layout: { visibility: subsection.visible ? 'visible' : 'none' },
          paint: {
            'circle-radius': 5,
            'circle-color': config.color,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.8,
          },
        };

        // Add filter if it exists
        if (config.filter) {
          layerDefinition.filter = config.filter;
        }

        map.addLayer(layerDefinition);
      });
    });

    // Create popup for hover details
    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    // Add hover events for all layers
    layerSections.forEach(section => {
      section.subsections.forEach(subsection => {
        // Show popup on hover
        map.on('mouseenter', subsection.layerId, (e) => {
          map.getCanvas().style.cursor = 'pointer';
          
          const feature = e.features[0];
          const props = feature.properties;
          
          // Build popup content
          let content = '<div class="p-2 max-w-xs max-h-64 overflow-y-auto">';
          
          const name = props.name || 'Unnamed POI';
          content += `<h4 class="font-bold text-sm mb-1 text-gray-800">${name}</h4>`;
          
          // Show category with layer color
          content += `<div class="mb-2">`;
          content += `<span class="font-semibold text-xs" style="color: ${getLayerColor(subsection.layerId)}">${subsection.name}</span>`;
          content += `</div>`;
          
          // Show key OSM properties
          ['amenity', 'shop', 'leisure', 'tourism', 'highway', 'railway'].forEach(key => {
            if (props[key]) {
              content += `<div class="text-xs text-gray-600"><strong>${key}:</strong> ${props[key]}</div>`;
            }
          });
          
          content += '</div>';
          
          popup.setLngLat(e.lngLat).setHTML(content).addTo(map);
        });

        // Hide popup on mouse leave
        map.on('mouseleave', subsection.layerId, () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });
      });
    });
  });
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
/* Ensure no margins or padding interfere with full viewport coverage */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Override any global body/html margins */
:global(body), :global(html) {
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}
</style>
