// Pest detection edge function — uses Lovable AI Gemini vision with structured tool calling
// Returns top-3 predictions with confidence, severity, treatment and prevention.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const tool = {
  type: "function",
  function: {
    name: "report_pest_diagnosis",
    description:
      "Return the top 3 most likely pest, disease or deficiency diagnoses for the plant photo, ranked by confidence.",
    parameters: {
      type: "object",
      properties: {
        plant: {
          type: "string",
          description: "Best guess at the crop or plant species visible in the image (e.g. 'Tomato', 'Maize', 'Unknown').",
        },
        image_quality: {
          type: "string",
          enum: ["good", "acceptable", "poor"],
          description: "Quality of the photo for diagnosis.",
        },
        predictions: {
          type: "array",
          minItems: 1,
          maxItems: 3,
          items: {
            type: "object",
            properties: {
              pest: { type: "string", description: "Name of the pest, disease or condition." },
              confidence: { type: "number", description: "Confidence percentage 0–100." },
              severity: { type: "string", enum: ["low", "medium", "high"] },
              description: { type: "string", description: "1–2 sentence plain-language explanation." },
              treatment: {
                type: "array",
                items: { type: "string" },
                description: "3 concrete treatment steps.",
              },
              prevention: {
                type: "array",
                items: { type: "string" },
                description: "2–3 prevention tips.",
              },
            },
            required: ["pest", "confidence", "severity", "description", "treatment", "prevention"],
            additionalProperties: false,
          },
        },
      },
      required: ["plant", "image_quality", "predictions"],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const body = await req.json();
    const { imageBase64, mimeType, fileName, fileSize } = body ?? {};

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing imageBase64 in request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log(
      `[${requestId}] incoming detect-pest`,
      JSON.stringify({
        fileName: fileName ?? "(unknown)",
        fileSize: fileSize ?? null,
        mimeType: mimeType ?? "image/jpeg",
        base64Length: imageBase64.length,
        approxBytes: Math.round((imageBase64.length * 3) / 4),
      }),
    );

    const dataUrl = `data:${mimeType ?? "image/jpeg"};base64,${imageBase64}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an expert agricultural plant pathologist. Carefully look at the photo and identify the most likely pest, disease, nutrient deficiency or stress affecting the plant. Always return THREE distinct ranked possibilities with realistic, image-grounded confidence values that sum to roughly 100. Never repeat the same diagnosis. If the image is not a plant, say so honestly with low confidence.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Diagnose this plant photo. Request id: ${requestId}. Provide 3 ranked predictions.`,
              },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "report_pest_diagnosis" } },
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error(`[${requestId}] AI gateway error`, aiResp.status, errText);
      if (aiResp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ error: "AI gateway error", detail: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiResp.json();
    const toolCall = aiJson?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error(`[${requestId}] no tool call returned`, JSON.stringify(aiJson).slice(0, 500));
      return new Response(JSON.stringify({ error: "AI did not return a structured diagnosis." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    console.log(
      `[${requestId}] predictions`,
      JSON.stringify(parsed.predictions?.map((p: any) => ({ pest: p.pest, confidence: p.confidence }))),
    );
    console.log(`[${requestId}] completed in ${Date.now() - startedAt}ms`);

    return new Response(JSON.stringify({ requestId, ...parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(`[${requestId}] detect-pest error`, e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", requestId }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
