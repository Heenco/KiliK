import { ref, nextTick } from 'vue';

export function useStreetView(latParam, lngParam, property) {
  const showStreetView360 = ref(false);
  const streetViewImgError = ref(false);

  function openStreetView360(initStreetView360) {
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
    const lat = latParam.value;
    const lng = lngParam.value;
    if (window.google && window.google.maps) {
      if (lat !== null && lng !== null) {
        const svService = new window.google.maps.StreetViewService();
        const location = { lat, lng };
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
            svDiv.innerHTML = '<div class="text-gray-400 text-center py-8">No Street View available for this location.</div>';
          }
        });
      } else {
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
  }

  return {
    showStreetView360,
    streetViewImgError,
    openStreetView360,
    closeStreetView360,
    initStreetView360
  };
}
