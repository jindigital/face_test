export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const prompt = body.prompt;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API Key가 Vercel 환경변수에 설정되지 않았습니다.' });
    }

    // 베타(v1beta) 대신 가장 안정적인 정식 버전(v1) 주소를 사용하고, 모델은 gemini-1.5-flash를 지정합니다.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `사용자가 '${prompt}'(을)를 입력했습니다. 이 단어와 어울리는 얼굴 필터 컨셉을 3줄로 짧게 설명해줘.`
          }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API 호출 중 오류가 발생했습니다.');
    }

    const text = data.candidates[0].content.parts[0].text;
    res.status(200).json({ message: text });
    
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
