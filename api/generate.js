import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // POST 요청이 아닐 경우 튕겨냅니다.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vercel 환경에서는 req.body가 이미 객체로 변환되어 들어올 때가 많습니다.
    // 안전하게 처리하기 위해 문자열일 때만 JSON.parse를 실행하도록 수정합니다.
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const prompt = body.prompt;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API Key가 Vercel 환경변수에 설정되지 않았습니다.' });
    }

    // Gemini API 호출
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // 프롬프트 실행
    const result = await model.generateContent(`
      사용자가 '${prompt}'(을)를 입력했습니다. 이 단어와 어울리는 얼굴 필터 컨셉을 3줄로 짧게 설명해줘.
    `);

    // 정상적으로 처리되면 프론트엔드에 JSON 형태로 반환합니다.
    res.status(200).json({ message: result.response.text() });
    
  } catch (error) {
    // 서버 내부 오류 발생 시 내용을 콘솔에 찍고 프론트엔드로 전달합니다.
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
