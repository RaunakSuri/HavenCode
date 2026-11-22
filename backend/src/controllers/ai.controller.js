import { GoogleGenAI } from '@google/genai';

const aiChat = async (req, res) => {
  try {
    const { prompt, problemTitle, problemDescription, userCode, language } =
      req.body;

    if (!prompt) {
      return res.status(400).send('Prompt is required');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `
You are an expert, encouraging, and friendly DSA Coding Mentor and LeetCode Tutor.
Your goal is to guide students to understand concepts, solve algorithmic problems, debug errors, and write efficient code.

Rules:
1. When asked for hints, provide progressive hints (start small, nudge their thinking towards the right data structure/approach without immediately handing them the entire solution).
2. If asked to debug their code, analyze their current code specifically, identify syntax or logical pitfalls, edge cases (e.g. empty inputs, duplicates, negative numbers, overflow), and explain WHY it is failing.
3. If asked to explain the problem, break it down clearly with a simple real-world analogy and trace an example.
4. If asked for time and space complexity, explain both the current code's complexity and the optimal theoretical complexity.
5. Format your output cleanly in GitHub-flavored Markdown. Use bolding, bullet points, and code spans/blocks where appropriate. Keep responses concise, clean, and easy to read in a side panel.
6. Avoid using raw LaTeX math symbols like $\\mathcal{O}(1)$ or $a$. Instead, write plain readable notation like O(1), O(N), or \`a\` so it renders cleanly and nicely.
7. Always format tables with proper newlines around rows so markdown tables render correctly.
`;

    const contextPrompt = `
CURRENT CONTEXT:
Problem Title: ${problemTitle || 'N/A'}
Problem Description:
${problemDescription || 'N/A'}

User's Programming Language: ${language || 'N/A'}
User's Current Code in Editor:
\`\`\`${language || ''}
${userCode || '// No code written yet'}
\`\`\`

USER QUESTION / REQUEST:
${prompt}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contextPrompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    // User-friendly message instead of raw server/API error dump
    res
      .status(503)
      .send(
        "AI Assistant is currently experiencing high demand or having trouble reaching the server. Please wait a moment and try again!"
      );
  }
};

export { aiChat };
