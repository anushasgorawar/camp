mapboxgl.accessToken = mapToken;

var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/outdoors-v11',
center: [82.848639,23.023819],
zoom: 3
});
 
map.on('load', function () {
	map.addSource('campgrounds', {
		type: 'geojson',
		data: campgrounds,
		cluster: true,
		clusterMaxZoom: 14,
		clusterRadius: 50 
	}); 

	map.addLayer({
		id: 'clusters',
		type: 'circle',
		source: 'campgrounds',
		filter: ['has', 'point_count'],
		paint: {
			'circle-color': [ 'step', ['get', 'point_count'],'#51bbd6', 100, '#f1f075', 750, '#f28cb1' ],
			'circle-radius': [ 'step', ['get', 'point_count'], 20, 100, 30, 750, 40 ]
		}
	});
 
	map.addLayer({
		id: 'cluster-count',
		type: 'symbol',
		source: 'campgrounds',
		filter: ['has', 'point_count'],
		layout: {
			'text-field': '{point_count_abbreviated}',
			'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
			'text-size': 12
		}
	});
 
	map.addLayer({
		id: 'unclustered-point',
		type: 'circle',
		source: 'campgrounds',
		filter: ['!', ['has', 'point_count']],
		paint: {
			'circle-color': '#11b4da',
			'circle-radius': 4,
			'circle-stroke-width': 1,
			'circle-stroke-color': '#fff'
		}
	});
 
	map.on('click', 'clusters', function (e) {
		var features = map.queryRenderedFeatures(e.point, {
			layers: ['clusters']
		});
		var clusterId = features[0].properties.cluster_id;
		map.getSource('campgrounds').getClusterExpansionZoom(
			clusterId,
			function (err, zoom) {
				if (err) return;
				map.easeTo({
				center: features[0].geometry.coordinates,
				zoom: zoom
			});
			}
		);
	});

	map.on('click', 'unclustered-point', function (e) {

        const { popUpMarkup } = e.features[0].properties;
		var coordinates = e.features[0].geometry.coordinates.slice();
		

		while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
			coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
		}
		
		new mapboxgl.Popup()
		.setLngLat(coordinates)
		.setHTML( popUpMarkup)
		.addTo(map);
	});
 
	map.on('mouseenter', 'clusters', function () {
		map.getCanvas().style.cursor = 'pointer';
	});
	map.on('mouseleave', 'clusters', function () {
		map.getCanvas().style.cursor = '';
	});
});