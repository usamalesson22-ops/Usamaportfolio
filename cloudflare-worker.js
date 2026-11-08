/**
 * =============================================================================
 * CLOUDFLARE WORKER: SECURE GEMINI PROXY FOR USAMA AI
 * =============================================================================
 * This worker keeps your Gemini API key 100% hidden and secure!
 * You can push your entire website code to GitHub publicly with zero fear of leaks.
 *
 * HOW TO DEPLOY (FREE - Takes 2 minutes):
 * 1. Go to https://dash.cloudflare.com/ (sign up free if you don't have an account).
 * 2. Click "Workers & Pages" -> "Create application" -> "Create Worker".
 * 3. Name your worker (e.g. `usama-ai-chat`) and click "Deploy".
 * 4. Click "Edit code", delete the template code, paste THIS ENTIRE FILE, and click "Deploy".
 * 5. Go to your Worker Settings -> "Variables and Secrets" -> Add Secret:
 *    - Variable Name: GEMINI_API_KEY
 *    - Value: [Paste your Gemini API key here]
 *    - Click "Save and deploy".
 * 6. Copy your Worker URL (e.g. https://usama-ai-chat.your-name.workers.dev).
 * 7. Open `chat-config.js` in your website and paste the URL:
 *    window.CHAT_API = "https://usama-ai-chat.your-name.workers.dev";
 * =============================================================================
 */

const SYSTEM_INSTRUCTION = `
You are Usama AI, the creative design and video assistant for Muhammad Usama, a professional graphic designer, video editor, and web developer with 2+ years of experience and 150+ completed projects.

TARGET AUDIENCE:
Your primary audience is boys and girls aged 10 to 30 years old (students, young creators, gamers, YouTubers, TikTokers, aesthetic lifestyle brands, and cafe/restaurant founders).

TONE & PERSONALITY:
- Modern, upbeat, polite, energetic, and encouraging.
- Speak in clear, friendly English (or natural Urdu/Roman Urdu if the user writes in Urdu/Hindi).
- Use tasteful emojis (🚀, ✨, 🎨, 🎬, 🍔, 💻, 📲).
- Keep replies punchy, readable, and structured with short paragraphs or bullet points.

SERVICES OFFERED:
1. Restaurant & Cafe Branding: Menu cards, promotion posters, burger/pizza/coffee flyers, table tents, digital LED menus.
2. Short Video Editing: 9:16 vertical edits for Instagram Reels, TikTok, and YouTube Shorts with dynamic jump cuts, trending beats, and bold animated captions.
3. Graphic Design: Social media post templates, carousels, YouTube thumbnails, event posters, logos, business cards.
4. Website Design & Development: Blazing fast, mobile-friendly websites with smooth animations, dark aesthetics, and WhatsApp buttons.

CONTACT DETAILS:
- WhatsApp: +92 337 3359602 (Direct link: https://wa.me/923373359602)
- Email: usamaservices4@gmail.com
- Instagram: @usam_agraphics (https://www.instagram.com/usam_agraphics/)
- TikTok: @usamagraphics4 (https://www.tiktok.com/@usamagraphics4)
- LinkedIn: https://www.linkedin.com/in/usama-graphics-601497447/
- Upwork: Muhammad Usama

PRICING & REVISIONS:
- Transparent, project-based pricing.
- Special affordable creator and student packages for young founders and teens.
- Full revision rounds until the client is 100% happy with high-resolution ready-to-use files.
`;

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST method is allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({
        error: "GEMINI_API_KEY secret is not configured in Cloudflare Worker settings"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    try {
      const { message, history } = await request.json();
      if (!message || typeof message !== "string") {
        return new Response(JSON.stringify({ error: "Message is required" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      // Build conversation contents for Gemini API
      const contents = [];

      // Add conversation history (up to last 6 turns)
      if (Array.isArray(history)) {
        const recent = history.slice(-6);
        for (const item of recent) {
          if (item.sender === "user" && item.text) {
            contents.push({ role: "user", parts: [{ text: item.text }] });
          } else if (item.sender === "bot" && item.text) {
            // Strip any raw HTML tags for clean model context
            const plainText = item.text.replace(/<[^>]*>?/gm, " ").trim();
            if (plainText) {
              contents.push({ role: "model", parts: [{ text: plainText }] });
            }
          }
        }
      }

      // Add current message
      contents.push({ role: "user", parts: [{ text: message }] });

      // Call Google Gemini API (gemini-3.5-flash primary, with automatic fallbacks)
      const candidateModels = [
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemini-3.8-flash"
      ];

      let reply = null;
      let lastErrText = "";

      for (const modelName of candidateModels) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

          const geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
              },
              contents: contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600
              }
            })
          });

          if (geminiResponse.ok) {
            const geminiData = await geminiResponse.json();
            reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) break;
          } else {
            lastErrText = await geminiResponse.text();
            console.warn(`Gemini API Model ${modelName} returned ${geminiResponse.status}:`, lastErrText);
          }
        } catch (mErr) {
          console.warn(`Fetch error for model ${modelName}:`, mErr.message);
        }
      }

      if (!reply) {
        return new Response(JSON.stringify({
          error: "Gemini API request failed across candidate models",
          details: lastErrText
        }), {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err) {
      console.error("Worker error:", err);
      return new Response(JSON.stringify({ error: "Internal server error", message: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};
