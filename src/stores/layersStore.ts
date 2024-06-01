// src/stores/layersStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SubData } from '@/assets/output.js';

export const useLayersStore = defineStore('layersStore', () => {
  const activeLayer = ref<number>(0);
  const activeLayerIndex = ref<number>(-1);
  const map = ref<L.Map | null>(null);
  const markers = ref(L.markerClusterGroup());
  const heatmapLayer = ref<L.Layer | null>(null);
  const geoJsonLayer = ref<L.GeoJSON | null>(null);
  const eventCountByRegion = ref<any>({});

  function initializeMap(mapInstance: L.Map) {
    map.value = mapInstance;
  }

  function updateMarkers(displayedMasterClasses: any[], myIcon: L.Icon) {
    if (!map.value) return;

    markers.value.clearLayers();

    displayedMasterClasses.forEach((item, index) => {
      if (!item.coordinates || isNaN(item.coordinates.latitude) || isNaN(item.coordinates.longitude)) {
        return;
      }

      const marker = L.marker([item.coordinates.latitude, item.coordinates.longitude], { icon: myIcon })
        .on('mouseover', () => {
          if (!marker.getPopup()) {
            marker.bindPopup(`
            <div class="marker-popup">
              <div class="image-container">
                <img src="${item.image_url || '/default-image.jpg'}" class="card-image" id="popup-image-${index}">
              </div>
              <div class="card-content">
                <strong>${item.title}</strong><br>
                <div class="mc-footer">
                  <span>${item.location_name}</span>
                  <span>${new Date(item.start_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>`);
          }
          marker.openPopup();
        })
        .on('mouseout', () => {
          setTimeout(() => {
            if (!marker.isPopupOpen()) {
              marker.closePopup();
            }
          }, 300);
        });

      marker.on('popupopen', () => {
        const popup = document.getElementById(`popup-image-${index}`);
        if (popup) {
          popup.addEventListener('mouseover', () => {
            clearTimeout(marker._closeTimeout);
          });
          popup.addEventListener('mouseout', () => {
            marker._closeTimeout = setTimeout(() => {
              marker.closePopup();
            }, 300);
          });
        }
      });

      markers.value.addLayer(marker);
    });

    if (map.value && markers.value) {
      map.value.addLayer(markers.value);
    }
  }

  function updateHeatmap(displayedMasterClasses: any[]) {
    if (!map.value) return;

    if (heatmapLayer.value) {
      map.value.removeLayer(heatmapLayer.value);
    }

    const heatData = displayedMasterClasses.map(item => [
      item.coordinates.latitude,
      item.coordinates.longitude,
      300
    ]);

    heatmapLayer.value = L.heatLayer(heatData, { radius: 25 });

    if (map.value && heatmapLayer.value) {
      heatmapLayer.value.addTo(map.value);
    }
  }

  function aggregateEventCounts(displayedMasterClasses: any[]) {
    const counts = {};

    displayedMasterClasses.forEach(item => {
      const point = L.latLng(item.coordinates.latitude, item.coordinates.longitude);
      SubData.features.forEach(feature => {
        const polygon = L.geoJSON(feature).getLayers()[0];
        if (polygon.getBounds().contains(point)) {
          const region = feature.properties.name;
          if (!counts[region]) counts[region] = 0;
          counts[region]++;
        }
      });
    });

    eventCountByRegion.value = counts;
  }

  function updateChoropleth() {
    if (!map.value) return;

    if (geoJsonLayer.value) {
      map.value.removeLayer(geoJsonLayer.value);
    }

    function getColor(eventCount) {
      return eventCount > 100 ? '#800026' :
        eventCount > 50 ? '#BD0026' :
          eventCount > 20 ? '#E31A1C' :
            eventCount > 10 ? '#FC4E2A' :
              eventCount > 5 ? '#FD8D3C' :
                eventCount > 2 ? '#FEB24C' :
                  eventCount > 10 ? '#FED976' :
                    '#81817f';
    }

    function style(feature) {
      const eventCount = eventCountByRegion.value[feature.properties.name] || 0;
      return {
        fillColor: getColor(eventCount),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      };
    }

    function onEachFeature(feature, layer) {
      const eventCount = eventCountByRegion.value[feature.properties.name] || 0;
      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
          });
          layer.bindPopup(`Количество мероприятий: ${eventCount}`).openPopup();
        },
        mouseout: (e) => {
          if (geoJsonLayer.value) {
            geoJsonLayer.value.resetStyle(e.target);
            layer.closePopup();
          }
        }
      });
    }

    geoJsonLayer.value = L.geoJSON(SubData, {
      style,
      onEachFeature
    });

    if (map.value && geoJsonLayer.value) {
      geoJsonLayer.value.addTo(map.value);
    }
  }

  function toggleLayer(index: number, displayedMasterClasses: any[], myIcon: L.Icon) {
    activeLayerIndex.value = index;

    if (heatmapLayer.value) {
      if (map.value) map.value.removeLayer(heatmapLayer.value);
    }
    if (geoJsonLayer.value) {
      if (map.value) map.value.removeLayer(geoJsonLayer.value);
    }
    if (map.value && markers.value) {
      map.value.removeLayer(markers.value);
    }

    if (index === 1) {
      updateHeatmap(displayedMasterClasses);
    } else if (index === 2) {
      aggregateEventCounts(displayedMasterClasses);
      updateChoropleth();
    } else {
      updateMarkers(displayedMasterClasses, myIcon);
    }
  }

  return { activeLayer, activeLayerIndex, initializeMap, toggleLayer, updateMarkers, updateHeatmap, updateChoropleth };
});
