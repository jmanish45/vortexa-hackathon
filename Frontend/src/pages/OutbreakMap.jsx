import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';
import './OutbreakMap.css';

// Cotton-specific diseases
const CLASS_NAMES = [
    'Cotton___Bacterial_blight',
    'Cotton___Verticillium_wilt',
    'Cotton___Fusarium_wilt',
    'Cotton___Alternaria_leaf_spot',
    'Cotton___Anthracnose',
    'Cotton___Healthy'
];

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function HeatLayer({ data }) {
    const map = useMap();
    useEffect(() => {
        // Remove existing heatmap
        map.eachLayer(layer => {
            if (layer instanceof L.HeatLayer) {
                map.removeLayer(layer);
            }
        });
        // Add heatmap if data exists
        if (data.length > 0) {
            const heatData = data.map(row => [row.lat, row.lon, row.severity]);
            L.heatLayer(heatData, { radius: 15, blur: 10 }).addTo(map);
        }
    }, [data, map]);
    return null;
}

function OutbreakMap() {
    const [outbreaks, setOutbreaks] = useState([]);
    const [formData, setFormData] = useState({
        place: 'Mumbai, Maharashtra',
        disease: CLASS_NAMES[0],
        severity: 0.5
    });
    const [error, setError] = useState('');

    // Fetch initial outbreak data
    useEffect(() => {
        fetch('http://127.0.0.1:8000/outbreak/data')
            .then(res => res.json())
            .then(data => setOutbreaks(data))
            .catch(err => console.error('Error fetching data:', err));
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const data = new FormData();
        data.append('place', formData.place);
        data.append('disease', formData.disease);
        data.append('severity', formData.severity);

        try {
            const res = await fetch('http://127.0.0.1:8000/outbreak/add', {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (result.success) {
                setOutbreaks(result.data);
                alert('Outbreak added successfully!');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error submitting form: ' + err.message);
        }
    };

    return (
        <div className="container">
            <h1>🌿 Cotton Disease Outbreak Visualization</h1>
            <p>
                Add a cotton disease outbreak to visualize on an interactive map of India.
                Markers are <span style={{ color: 'red' }}>red</span> for diseases and{' '}
                <span style={{ color: 'green' }}>green</span> for healthy plants.
            </p>
            <form onSubmit={handleSubmit} className="outbreak-form">
                <label htmlFor="place">Location:</label>
                <input
                    type="text"
                    id="place"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    required
                />
                <label htmlFor="disease">Disease:</label>
                <select id="disease" name="disease" value={formData.disease} onChange={handleInputChange}>
                    {CLASS_NAMES.map(disease => (
                        <option key={disease} value={disease}>
                            {disease.replace('', ' ').replace('', ' ')}
                        </option>
                    ))}
                </select>
                <label htmlFor="severity">Severity (0-1):</label>
                <input
                    type="number"
                    id="severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                    min="0"
                    max="1"
                    step="0.1"
                    required
                />
                <button type="submit">Add to Map</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '500px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <HeatLayer data={outbreaks} />
                {outbreaks.map((row, index) => (
                    <Marker
                        key={index}
                        position={[row.lat, row.lon]}
                        icon={L.divIcon({
                            className: marker-${row.class.toLowerCase().includes('healthy') ? 'green' : 'red'},
                            html: <div style="background-color:${row.class.toLowerCase().includes('healthy') ? 'green' : 'red'};width:10px;height:10px;border-radius:50%;border:2px solid white;"></div>,
                            iconSize: [12, 12],
                            iconAnchor: [6, 6]
                        })}
                    >
                        <Popup>
                            <b>{row.class.replace('', ' ').replace('', ' ')}</b><br />
                            Severity: {row.severity.toFixed(2)}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default OutbreakMap;