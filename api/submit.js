import { put } from '@vercel/blob';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    // Add timestamp
    data.submitted_at = new Date().toISOString();

    // Create unique filename
    const timestamp = Date.now();
    const safeName = (data.name || 'anonymous').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `submissions/${timestamp}_${safeName}.json`;

    // Store in Vercel Blob
    const blob = await put(filename, JSON.stringify(data, null, 2), {
      contentType: 'application/json',
      access: 'public'
    });

    return res.status(200).json({ success: true, url: blob.url });
  } catch (error) {
    console.error('Submission error:', error);
    return res.status(500).json({ error: 'Failed to save submission' });
  }
}
