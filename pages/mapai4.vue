<template>
  <div class="fixed inset-0 overflow-hidden">
    <div id="map" class="w-full h-full"></div>
    <!-- Search box (top-left) -->
    <div class="absolute top-20 left-8 z-20 w-96">
      <form @submit.prevent="searchAddress" class="bg-white rounded-md shadow-md px-4 py-3 flex items-center">
        <Input
          v-model="searchQuery"
          @input="fetchSuggestions"
          @keydown.down.prevent="moveSelection(1)"
          @keydown.up.prevent="moveSelection(-1)"
          @keydown.enter.prevent="selectSuggestion(selectedIndex)"
          type="text"
          placeholder="Search address..."
          class="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-base rounded-md"
          style="border-radius: 8px;"
          autocomplete="off"
        />
      </form>
      <div v-if="suggestions.length > 0" class="absolute left-0 mt-1 w-full z-30">
        <ul class="bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
          <li
            v-for="(suggestion, idx) in suggestions"
            :key="suggestion.id"
            @mousedown.prevent="selectSuggestion(idx)"
            :class="[
              'px-3 py-2 cursor-pointer text-sm transition',
              idx === selectedIndex ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-blue-50 text-gray-900'
            ]"
          >
            <span class="block truncate">{{ suggestion.place_name }}</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- Right-side panel/card -->
    <div class="absolute top-20 right-4 z-10">
      <Card class="w-96 shadow-lg rounded-lg bg-white">
      <CardHeader style="padding: 1.5rem 1.5rem 0.5rem 1.5rem;">
          <CardTitle class="text-lg font-semibold">Map Panel</CardTitle>
          <CardDescription class="text-sm text-gray-500">Select a tab for details.</CardDescription>
        </CardHeader>
        <CardContent style="padding: 1rem 1.5rem 1.5rem 1.5rem;">
          <Tabs default-value="access" class="w-full">
            <TabsList class="flex w-full mb-4">
              <TabsTrigger value="access" class="flex-1">Access</TabsTrigger>
              <TabsTrigger value="planning" class="flex-1">Planning</TabsTrigger>
              <TabsTrigger value="census" class="flex-1">Census</TabsTrigger>
              <TabsTrigger value="value" class="flex-1">Value</TabsTrigger>
            </TabsList>
            <TabsContent value="access">
              <!-- Layer List UI from mapai4-OSM.vue -->
              <div class="pr-4" style="max-height: 22rem; overflow-y: auto;">
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
                        <div v-for="subsection in section.subsections" :key="subsection.name">
                          <label class="flex items-center cursor-pointer py-2 px-2 rounded-md hover:bg-gray-50 transition-colors group gap-x-2">
                            <Switch 
                              v-model="subsection.visible"
                              @update:modelValue="toggleLayer(subsection.layerId)"
                              class="mr-2"
                            />
                            <div 
                              class="w-3 h-3 rounded-full mr-2 border border-gray-300 shadow-sm"
                              :style="{ backgroundColor: getLayerColor(subsection.layerId) }"
                            ></div>
                            <span class="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{{ subsection.name }}</span>
                          </label>
                          <div class="w-full h-2 bg-white my-2"></div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
            <TabsContent value="planning">
              <p class="text-gray-700">Planning information goes here.</p>
            </TabsContent>
            <TabsContent value="census">
              <p class="text-gray-700">Census information goes here.</p>
            </TabsContent>
            <TabsContent value="value">
              <p class="text-gray-700">Value information goes here.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Switch } from '~/components/ui/switch';

import { reactive } from 'vue';

// Layer visibility state with OSM categories
const searchQuery = ref("");
const suggestions = ref([]);
const selectedIndex = ref(-1);

const fetchSuggestions = async () => {
  const query = searchQuery.value.trim();
  if (!query) {
    suggestions.value = [];
    selectedIndex.value = -1;
    return;
  }
  const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    suggestions.value = data.features || [];
    selectedIndex.value = suggestions.value.length > 0 ? 0 : -1;
  } catch (err) {
    suggestions.value = [];
    selectedIndex.value = -1;
  }
};

const moveSelection = (delta) => {
  if (suggestions.value.length === 0) return;
  selectedIndex.value = Math.max(0, Math.min(suggestions.value.length - 1, selectedIndex.value + delta));
};

const selectSuggestion = (idx) => {
  if (suggestions.value.length === 0 || idx < 0 || idx >= suggestions.value.length) return;
  const feature = suggestions.value[idx];
  searchQuery.value = feature.place_name;
  suggestions.value = [];
  selectedIndex.value = -1;
  if (feature.center && map) {
    map.flyTo({ center: feature.center, zoom: 16 });
  }
};

const searchAddress = async () => {
  if (!searchQuery.value.trim()) return;
  if (suggestions.value.length > 0 && selectedIndex.value >= 0) {
    selectSuggestion(selectedIndex.value);
    return;
  }
  const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery.value)}.json?access_token=${MAPBOX_TOKEN}`;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      map.flyTo({ center: [lng, lat], zoom: 16 });
    } else {
      alert('Address not found.');
    }
  } catch (err) {
    alert('Error searching address.');
  }
};
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


const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA';
let map = null;

onMounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
  mapboxgl.accessToken = MAPBOX_TOKEN;
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [153.0281, -27.4678], // Brisbane coordinates
    zoom: 12,
  });

  map.on('load', () => {
    // Add OSM vector tile source
    map.addSource('osm-planetiler', {
      type: 'vector',
      tiles: ['https://dwuxtsziek7cf.cloudfront.net/planet/{z}/{x}/{y}.mvt'],
      minzoom: 0,
      maxzoom: 14
    });

    // Layer config
    const layerConfig = {
      'all-pois': {
        filter: null,
        color: '#808080'
      },
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

    layerSections.forEach(section => {
      section.subsections.forEach(subsection => {
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

        if (config.filter) {
          layerDefinition.filter = config.filter;
        }

        map.addLayer(layerDefinition);
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
:global(body), :global(html) {
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}
</style>
