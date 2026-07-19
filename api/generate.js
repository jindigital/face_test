// api/generate.js
// Vercel Serverless Function
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = JSON.parse(req.body);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key not configured' });
  }

  // 여기에 Gemini API 호출 로직을 구현하세요
  res.status(200).json({ message: `Prompt received: ${prompt}. Backend integration required.` });
}
