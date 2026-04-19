import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert litigation paralegal and legal summarizer. Generate a comprehensive, attorney-ready deposition summary from the provided transcript:

Format your summary as:

**DEPOSITION SUMMARY**
- Date/Context: (from transcript if available)
- Witness: (name if provided)
- Case: (if context provided)

**KEY ISSUES COVERED**
- Numbered list of major topics covered

**FACTUAL BACKGROUND**
- Chronological narrative of relevant facts established

**MATERIAL TESTIMONY**
For each key point:
- Question: (what was asked)
- Answer: (witness response, summarized)
- Significance: (why this matters for the case)

**INCONSISTENCIES & CONTRADICTIONS**
- Discrepancies between this testimony and other evidence/documents

**ADMISSIONS FAVORABLE TO [PLAINTIFF/DEFENDANT]**
- Specific favorable admissions from the witness

**IMPEACHMENT MATERIAL**
- Prior inconsistent statements, contradictions with discovery responses

**EXPERT WITNESS CREDENTIALS** (if applicable)
- Qualifications noted during testimony

**RECOMMENDED DEPOSITION AREAS NOT COVERED**
- Topics that should be explored in follow-up deposition

Be thorough, accurate, and use professional legal language.`,
        },
        {
          role: "user",
          content: `Generate a deposition summary from:\n\n${prompt}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2500,
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "No response from model" }, { status: 500 });
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}
