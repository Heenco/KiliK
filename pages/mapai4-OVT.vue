<template>
  <div class="h-screen w-full relative">
    <div id="map" class="h-full w-full"></div>

    <!-- Layer Control Panel -->
    <div class="absolute top-20 right-4 bg-white rounded-lg shadow-lg p-4 min-w-80 max-w-96">
      <h3 class="font-semibold text-base mb-3">Layer List</h3>
      
      <Accordion type="multiple" class="w-full" :default-value="['section-0', 'section-1', 'section-2', 'section-3', 'section-4', 'section-5', 'section-6']">
        <AccordionItem 
          v-for="(section, index) in layerSections" 
          :key="section.name" 
          :value="`section-${index}`"
          class="border-b border-gray-200 last:border-b-0"
        >
          <AccordionTrigger class="py-2 px-0 text-sm font-bold text-gray-700 hover:text-gray-900">
            {{ section.name }}
          </AccordionTrigger>
          <AccordionContent class="pb-2">
            <div class="space-y-2">
              <div v-for="subsection in section.subsections" :key="subsection.name" class="ml-2">
                <label class="flex items-center cursor-pointer">
                  <Switch 
                    v-model="subsection.visible"
                    @update:modelValue="toggleLayer(subsection.layerId)"
                    class="mr-2"
                  />
                  <div 
                    class="w-3 h-3 rounded-full mr-2 border border-gray-300"
                    :style="{ backgroundColor: getLayerColor(subsection.layerId) }"
                  ></div>
                  <span class="text-sm">{{ subsection.name }}</span>
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Switch } from '~/components/ui/switch';

let map = null;

// Layer visibility state
const layerSections = reactive([
  {
    name: 'All Places',
    subsections: [
      { name: 'All Places', layerId: 'places', visible: false, count: 0 },
    ],
  },
  {
    name: 'Essential Daily Needs',
    subsections: [
      { name: 'Health & Personal Care', layerId: 'healthcare', visible: false, count: 0 },
      { name: 'Food & Groceries', layerId: 'groceries', visible: true, count: 0 },
      { name: 'Banking & Financial', layerId: 'banking', visible: false, count: 0 },
    ],
  },
  {
    name: 'Shopping',
    subsections: [
      { name: 'Retail Shops', layerId: 'retail', visible: false, count: 0 },
      { name: 'Pet Care & Services', layerId: 'petcare', visible: false, count: 0 },
    ],
  },
  {
    name: 'Lifestyle',
    subsections: [
      { name: 'Dining & Cafes', layerId: 'dining', visible: false, count: 0 },
      { name: 'Entertainment Venues', layerId: 'entertainment', visible: false, count: 0 },
    ],
  },
  {
    name: 'Recreation & Outdoors',
    subsections: [
      { name: 'Recreation & Sports', layerId: 'recreation', visible: false, count: 0 },
      { name: 'Walking & Cycling Trails', layerId: 'trails', visible: false, count: 0 },
    ],
  },
  {
    name: 'Mobility',
    subsections: [
      { name: 'Public Transportation', layerId: 'transportation', visible: false, count: 0 },
      { name: 'Vehicle Services', layerId: 'vehicles', visible: false, count: 0 },
    ],
  },
  {
    name: 'Community & Learning',
    subsections: [
      { name: 'Schools & Education', layerId: 'schools', visible: false, count: 0 },
      { name: 'Community Resources', layerId: 'community', visible: false, count: 0 },
    ],
  },
]);

const getLayerColor = (layerId) => {
  const colorMap = {
    places: '#808080',          // Gray for all places
    healthcare: '#FF4444',      // Red for healthcare/medical
    groceries: '#4CAF50',       // Green for food/groceries
    banking: '#2196F3',         // Blue for banking/financial
    retail: '#9C27B0',          // Purple for retail/shopping
    petcare: '#FF9800',         // Orange for pet care
    dining: '#E91E63',          // Pink for dining/restaurants
    entertainment: '#673AB7',    // Deep purple for entertainment
    recreation: '#4CAF50',      // Green for recreation/sports
    trails: '#8BC34A',          // Light green for trails/parks
    transportation: '#607D8B',   // Blue-gray for transportation
    vehicles: '#424242',        // Dark gray for vehicle services
    schools: '#FF9800',         // Orange for schools/education
    community: '#795548',       // Brown for community resources
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
  // Add PMTiles protocol
  let protocol = new Protocol();
  maplibregl.addProtocol('pmtiles', protocol.tile);

  map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/positron',
    center: [153.0281, -27.4678],
    zoom: 12,
  });

  map.on('load', () => {
    // Add PMTiles sources and layers dynamically
    map.addSource('overture-places', {
      type: 'vector',
      url: 'pmtiles://https://overturemaps-tiles-us-west-2-beta.s3.amazonaws.com/2025-04-23/places.pmtiles',
    });

    layerSections.forEach(section => {
      section.subsections.forEach(subsection => {
        const layerConfig = {
          // All Places
          places: {
            color: '#808080'          // Gray for all places
          },
          // Essential Daily Needs
          healthcare: {
            filter: [
              'any',
              ['in', 'clinic', ['get', 'categories']],
              ['in', 'hospital', ['get', 'categories']],
              ['in', 'pharmacy', ['get', 'categories']],
              ['in', 'medical', ['get', 'categories']],
              ['in', 'dentist', ['get', 'categories']],
            ],
            color: '#FF4444'          // Red for healthcare/medical
          },
          groceries: {
            filter: [
              'any',
              ['in', 'grocery', ['get', 'categories']],
              ['in', 'supermarket', ['get', 'categories']],
              ['in', 'convenience', ['get', 'categories']],
              ['in', 'food', ['get', 'categories']],
            ],
            color: '#4CAF50'          // Green for food/groceries
          },
          banking: {
            filter: [
              'any',
              ['in', 'bank', ['get', 'categories']],
              ['in', 'atm', ['get', 'categories']],
              ['in', 'financial', ['get', 'categories']],
            ],
            color: '#2196F3'          // Blue for banking/financial
          },
          // Shopping
          retail: {
            filter: [
              'any',
              ['in', 'shop', ['get', 'categories']],
              ['in', 'retail', ['get', 'categories']],
              ['in', 'clothing', ['get', 'categories']],
              ['in', 'electronics', ['get', 'categories']],
            ],
            color: '#9C27B0'          // Purple for retail/shopping
          },
          petcare: {
            filter: [
              'any',
              ['in', 'pet', ['get', 'categories']],
              ['in', 'veterinary', ['get', 'categories']],
              ['in', 'animal', ['get', 'categories']],
            ],
            color: '#FF9800'          // Orange for pet care
          },
          // Lifestyle
          dining: {
            filter: [
              'any',
              ['in', 'restaurant', ['get', 'categories']],
              ['in', 'cafe', ['get', 'categories']],
              ['in', 'bar', ['get', 'categories']],
              ['in', 'fast_food', ['get', 'categories']],
            ],
            color: '#E91E63'          // Pink for dining/restaurants
          },
          entertainment: {
            filter: [
              'any',
              ['in', 'cinema', ['get', 'categories']],
              ['in', 'theater', ['get', 'categories']],
              ['in', 'entertainment', ['get', 'categories']],
              ['in', 'nightclub', ['get', 'categories']],
            ],
            color: '#673AB7'          // Deep purple for entertainment
          },
          // Recreation & Outdoors
          recreation: {
            filter: [
              'any',
              ['in', 'sports', ['get', 'categories']],
              ['in', 'gym', ['get', 'categories']],
              ['in', 'recreation', ['get', 'categories']],
              ['in', 'fitness', ['get', 'categories']],
            ],
            color: '#4CAF50'          // Green for recreation/sports
          },
          trails: {
            filter: [
              'any',
              ['in', 'trail', ['get', 'categories']],
              ['in', 'park', ['get', 'categories']],
              ['in', 'recreation', ['get', 'categories']],
            ],
            color: '#8BC34A'          // Light green for trails/parks
          },
          // Mobility
          transportation: {
            filter: [
              'any',
              ['in', 'bus_stop', ['get', 'categories']],
              ['in', 'bus_station', ['get', 'categories']],
              ['in', 'train_station', ['get', 'categories']],
              ['in', 'subway', ['get', 'categories']],
              ['in', 'transport', ['get', 'categories']],
            ],
            color: '#607D8B'          // Blue-gray for transportation
          },
          vehicles: {
            filter: [
              'any',
              ['in', 'fuel', ['get', 'categories']],
              ['in', 'car_repair', ['get', 'categories']],
              ['in', 'parking', ['get', 'categories']],
              ['in', 'automotive', ['get', 'categories']],
            ],
            color: '#424242'          // Dark gray for vehicle services
          },
          // Community & Learning
          schools: {
            filter: [
              'any',
              ['in', 'school', ['get', 'categories']],
              ['in', 'education', ['get', 'categories']],
              ['in', 'university', ['get', 'categories']],
              ['in', 'college', ['get', 'categories']],
            ],
            color: '#FF9800'          // Orange for schools/education
          },
          community: {
            filter: [
              'any',
              ['in', 'community', ['get', 'categories']],
              ['in', 'library', ['get', 'categories']],
              ['in', 'civic', ['get', 'categories']],
              ['in', 'government', ['get', 'categories']],
            ],
            color: '#795548'          // Brown for community resources
          },
        };

        const config = layerConfig[subsection.layerId] || {
          filter: ['any'],
          color: '#888888'
        };

        const layerDefinition = {
          id: subsection.layerId,
          type: 'circle',
          source: 'overture-places',
          'source-layer': 'place',
          layout: { visibility: subsection.visible ? 'visible' : 'none' },
          paint: {
            'circle-radius': 5,
            'circle-color': config.color,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.8,
          },
        };

        // Only add filter if it exists
        if (config.filter) {
          layerDefinition.filter = config.filter;
        }

        map.addLayer(layerDefinition);

        // Query features to update counts
        const features = map.querySourceFeatures('overture-places', {
          sourceLayer: 'place',
          ...(config.filter && { filter: config.filter }),
        });
        subsection.count = features.length;
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
          
          // Build popup content dynamically with all properties
          let content = '<div class="p-2 max-w-xs max-h-64 overflow-y-auto">';
          
          // Try different name properties that might exist
          let placeName = props.name || props.names || props.title || props.label || 'Unnamed Place';
          
          // If names is a JSON object, try to extract a name
          if (typeof placeName === 'string' && placeName.startsWith('{')) {
            try {
              const namesObj = JSON.parse(placeName);
              placeName = namesObj.primary || namesObj.common || namesObj.official || Object.values(namesObj)[0] || 'Unnamed Place';
            } catch (e) {
              // Keep original value if parsing fails
            }
          }
          
          // Show name prominently
          content += `<h4 class="font-bold text-sm mb-1 text-gray-800">${placeName}</h4>`;
          
          // Show category with layer color
          content += `<div class="mb-2">`;
          content += `<span class="font-semibold text-xs" style="color: ${getLayerColor(subsection.layerId)}">${subsection.name}</span>`;
          content += `</div>`;
          
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
</script>