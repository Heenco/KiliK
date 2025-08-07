export const useMapSources = (map) => {
  const addMapSources = () => {
    // Address source
    map.addSource('address', {
      type: 'vector',
      tiles: ['http://localhost:8080/Address/{z}/{x}/{y}']
    })

    // Lot boundary source
    map.addSource('lot', {
      type: 'vector',
      tiles: ['http://localhost:8080/Lot_boundary/{z}/{x}/{y}']
    })

    // Flood source
    map.addSource('flood', {
      type: 'vector',
      tiles: ['http://172.105.163.185:8081/Flood/{z}/{x}/{y}']
    })

    // Landslide source
    map.addSource('landslide', {
      type: 'vector',
      tiles: ['http://172.105.184.178:3001/Landslide/{z}/{x}/{y}']
    })

    // Noise corridors source
    map.addSource('noise', {
      type: 'vector',
      tiles: ['http://172.105.184.178:3001/Noise_corridors/{z}/{x}/{y}']
    })
    
    // Electricity transmission lines source
    map.addSource('electricity', {
      type: 'vector',
      tiles: ['http://localhost:3001/Electricity_Transmission_Lines/{z}/{x}/{y}']
    })
    
    // Railway stations source
    map.addSource('railway-stations', {
      type: 'vector',
      tiles: ['http://localhost:3001/Railway_Stations/{z}/{x}/{y}']
    })
    
    // Railway lines source
    map.addSource('railway-lines', {
      type: 'vector',
      tiles: ['http://localhost:3001/Railway_Lines/{z}/{x}/{y}']
    })
    
    // SEIFA 2021 source
    map.addSource('seifa', {
      type: 'vector',
      tiles: ['http://localhost:3001/SEIFA_2021_SAL_2021/{z}/{x}/{y}']
    })

    // OSM points source
    map.addSource('osm-points', {
      type: 'vector',
      tiles: ['http://localhost:8080/planet_osm_point/{z}/{x}/{y}']
    })
    
    // Overture places source - Using the correct URL from tile JSON
    map.addSource('overture-places', {
      type: 'vector',
      tiles: ['http://localhost:8080/place/{z}/{x}/{y}']
    })

    // Clicked point source
    map.addSource('clicked-point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    // Isochrone source
    console.log('Adding isochrone source to the map');
    map.addSource('isochrone', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
  }

  return {
    addMapSources
  }
}