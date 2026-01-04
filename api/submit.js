import { sql } from '@vercel/postgres';

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
    const {
      name,
      state,
      role,
      reports_per_year,
      frustrations,
      uses_ai,
      nasp_2026,
      wishlist
    } = req.body;

    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        state VARCHAR(100),
        role VARCHAR(100),
        reports_per_year INTEGER,
        frustrations TEXT[],
        uses_ai VARCHAR(10),
        nasp_2026 VARCHAR(10),
        wishlist TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Insert submission
    await sql`
      INSERT INTO submissions (name, state, role, reports_per_year, frustrations, uses_ai, nasp_2026, wishlist)
      VALUES (${name}, ${state}, ${role}, ${reports_per_year}, ${frustrations}, ${uses_ai}, ${nasp_2026}, ${wishlist})
    `;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Submission error:', error);
    return res.status(500).json({ error: 'Failed to save submission' });
  }
}
