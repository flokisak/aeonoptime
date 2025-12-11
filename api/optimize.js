export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { coords, roundtrip } = req.body;

        if (!coords || !Array.isArray(coords)) {
            return res.status(400).json({ error: 'Invalid coords' });
        }

        const url = `https://router.project-osrm.org/trip/v1/driving/${coords.join(';')}?source=first&roundtrip=${roundtrip}&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            res.status(200).json(data);
        } else {
            res.status(response.status).json({ error: 'OSRM API error', details: data });
        }
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}