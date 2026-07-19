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

    // 주소의 모델명을 gemini-1.5-flash 에서 가장 안정적인 gemini-pro 로 변경했습니다.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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

    // API 응답이 실패한 경우
    if (!response.ok) {
      throw new Error(data.error?.message || 'API 호출 중 오류가 발생했습니다.');
    }

    // 정상 응답에서 텍스트 결과만 추출하여 전달
    const text = data.candidates[0].content.parts[0].text;
    res.status(200).json({ message: text });
    
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
