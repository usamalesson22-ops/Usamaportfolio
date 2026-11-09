/**
 * Usama AI Assistant - Client Script
 * Built for young creators, students & brand builders (Ages 10–30)
 * Works standalone with built-in intelligent NLP engine,
 * and automatically integrates with Gemini API if window.CHAT_API is set in chat-config.js.
 */

(function () {
  "use strict";

  // Prevent multiple initializations
  if (window.__USAMA_AI_INIT__) return;
  window.__USAMA_AI_INIT__ = true;

  // Sound Synth via Web Audio API (Zero external audio files needed)
  var audioCtx = null;
  var soundEnabled = localStorage.getItem("usama_ai_sound") !== "false";

  function playTone(type) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      var now = audioCtx.currentTime;
      if (type === "send") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === "receive") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (e) {
      // Audio not permitted without interaction
    }
  }

  // Predefined Knowledge Base specifically for 10-30 year old audience
  var KNOWLEDGE = [
    {
      keywords: ["hi", "hello", "hey", "yo", "wassup", "what's up", "assalam", "aoa", "salam", "morning", "afternoon", "evening"],
      response: "Hey there! 👋 Welcome! I’m **Usama AI**, your design and creative copilot.<br><br>Whether you need a <strong>mouth-watering cafe menu</strong>, <strong>viral TikTok & Reels edits</strong>, <strong>scroll-stopping graphics</strong>, or a <strong>sleek modern website</strong> — I'm here to help you bring your ideas to life! 🚀✨<br><br>What cool project are you thinking about?",
      buttons: [
        { text: "🍔 Restaurant & Cafe Menus", query: "Tell me about menu card designs" },
        { text: "🔥 Reels & TikTok Video Edits", query: "How do you edit Reels and TikToks?" },
        { text: "💻 Modern Websites", query: "Can you build my website?" },
        { text: "💬 Chat directly on WhatsApp", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20I%20saw%20your%20website%20and%20want%20to%20discuss%20a%20project!" }
      ]
    },
    {
      keywords: ["age", "audience", "target", "10", "20", "30", "young", "student", "teen", "teenager", "boy", "girl", "who is this for"],
      response: "This studio is built especially for **young creators, students, and ambitious brand builders aged 10 to 30**! 🎯<br><br>Here’s how we help:<ul><li>🎮 <strong>Young Creators & Gamers (10–18):</strong> Sick YouTube thumbnails, streaming overlays, gaming banners, aesthetic profile art, and event posters!</li><li>✨ <strong>Aesthetic Brands & Content Creators (18–25):</strong> High-converting Instagram carousels, beauty/lifestyle branding, and viral vertical video edits!</li><li>🍔 <strong>Cafe & Restaurant Founders (20–30):</strong> Delicious menu cards, burger/pizza promotion posters, digital menu displays, and modern websites that turn hungry scrollers into regulars!</li></ul>Got a creative vision? Let's make it real!",
      buttons: [
        { text: "📲 Talk to Usama on WhatsApp", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20I%20have%20an%20exciting%20project%20in%20mind!" },
        { text: "👀 View Services", url: "services.html" }
      ]
    },
    {
      keywords: ["menu", "restaurant", "cafe", "food", "burger", "pizza", "coffee", "boba", "tea", "bakery", "takeaway", "fast food", "dining", "menu card"],
      response: "🍔 <strong>Delicious food deserves scroll-stopping design!</strong><br><br>Muhammad Usama specializes in high-impact restaurant & cafe branding:<ul><li>📋 <strong>Menu Cards & Boards:</strong> Clean, mouth-watering typography and strategic layout that guides customers to order your high-profit dishes.</li><li>📸 <strong>Food Promo Posts & Flyers:</strong> High-definition burger, pizza, drink, and combo deal posters that make people hungry at first glance.</li><li>📱 <strong>Digital Menus & Table Tents:</strong> Ready for print, QR codes, or LED screens in your restaurant!</li></ul>",
      buttons: [
        { text: "💬 WhatsApp Usama for a Menu Quote", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20I%20need%20a%20menu%20card%20or%20food%20promo%20designed." },
        { text: "👀 Explore Menu Services", url: "services.html#menus" }
      ]
    },
    {
      keywords: ["video", "reel", "reels", "tiktok", "shorts", "youtube", "edit", "editor", "cut", "capcut", "captions", "audio", "music"],
      response: "🎬 <strong>Stop the scroll with viral video editing!</strong><br><br>We edit high-energy 9:16 vertical videos for <strong>Instagram Reels, TikTok, and YouTube Shorts</strong>:<ul><li>⚡ <strong>Pacing & Jump Cuts:</strong> No dead air, high retention cuts that keep viewers watching.</li><li>📝 <strong>Kinetic Typography:</strong> Bold animated captions with emojis and highlight colors.</li><li>🎵 <strong>Sound Design:</strong> Trending background beats, sound effects (whooshes, pops, impacts).</li><li>📈 <strong>Promo & Brand Videos:</strong> Also editing longer product stories and documentary-style videos!</li></ul>",
      buttons: [
        { text: "🔥 Send Clips on WhatsApp", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20I%20have%20some%20video%20clips%20I%20want%20edited%20into%20a%20Reel/TikTok." },
        { text: "👀 See Video Options", url: "services.html#videos" }
      ]
    },
    {
      keywords: ["graphic", "design", "poster", "flyer", "social media", "instagram", "post", "banner", "thumbnail", "logo", "branding", "card", "business card", "brochure"],
      response: "🎨 <strong>Custom Graphic Design that stands out in the feed:</strong><br><br>Every post is custom made to match your brand's unique colors and vibe:<ul><li>📱 <strong>Social Media Posts & Templates:</strong> Clean Instagram grids, promo announcements, story templates, and carousel slides.</li><li>🖼️ <strong>Posters & Flyers:</strong> Sized perfectly for printing or digital sharing on WhatsApp & Facebook.</li><li>✨ <strong>Brand Kits & Logos:</strong> Consistent typography, color palettes, and business cards for a truly professional look.</li></ul>",
      buttons: [
        { text: "💬 Start a Design Project", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20I%20need%20social%20media%20posts%20or%20graphic%20design%20done." },
        { text: "👀 View Design Services", url: "services.html#designs" }
      ]
    },
    {
      keywords: ["website", "web", "site", "landing page", "developer", "portfolio", "code", "responsive", "mobile"],
      response: "💻 <strong>Sleek, Fast & Mobile-Friendly Websites!</strong><br><br>Need an online home for your business, cafe, or personal brand? Usama builds custom modern websites with:<ul><li>📱 <strong>100% Mobile Optimized:</strong> Looks gorgeous on iPhone, Android, and tablets.</li><li>⚡ <strong>Blazing Fast:</strong> Zero lag, smooth interactive animations, and dark/light aesthetics.</li><li>📲 <strong>Built-in Conversion:</strong> WhatsApp message buttons, interactive menus, and contact forms so visitors become clients right away.</li></ul>",
      buttons: [
        { text: "💬 Discuss Your Website Idea", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20I%20need%20a%20website%20designed%20and%20developed." },
        { text: "👀 See Website Services", url: "services.html#websites" }
      ]
    },
    {
      keywords: ["price", "cost", "pricing", "rate", "quote", "how much", "budget", "cheap", "affordable", "discount", "offer"],
      response: "💰 <strong>Fair, Transparent & Project-Based Pricing!</strong><br><br>Prices depend on what you need so you <strong>never pay for fluff</strong>! Tell Usama what you want made, and he'll give you a clear, fixed price upfront before starting.<br><br>🎓 <em>Special creator & student-friendly budget packages available for young founders and teens!</em><br><br>Want an instant estimate? Tap below and message Usama directly:",
      buttons: [
        { text: "⚡ Get Instant WhatsApp Price", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20can%20you%20give%20me%20a%20quick%20quote%20for%20a%20project%3F" },
        { text: "✉️ Send an Email Instead", url: "mailto:usamaservices4@gmail.com?subject=Project%20Price%20Enquiry" }
      ]
    },
    {
      keywords: ["how long", "time", "turnaround", "fast", "urgent", "delivery", "deadline", "quick", "when"],
      response: "⏱️ <strong>Fast Turnaround Times:</strong><ul><li>⚡ <strong>Social Media Posts & Flyers:</strong> Usually drafted within <strong>24 to 48 hours</strong>!</li><li>🎬 <strong>Short Videos & Reels:</strong> Delivered within <strong>1 to 3 days</strong> with music, captions, and cuts.</li><li>📋 <strong>Complete Menus & Brand Kits:</strong> <strong>2 to 4 days</strong> with full revision rounds.</li><li>💻 <strong>Websites:</strong> <strong>5 to 10 days</strong> depending on number of pages.</li></ul>Need something urgently for tomorrow's launch? Rush delivery is available on request!",
      buttons: [
        { text: "🚀 Request Rush Delivery on WhatsApp", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20I%20have%20an%20urgent%20project%20with%20a%20tight%20deadline." }
      ]
    },
    {
      keywords: ["revision", "change", "feedback", "draft", "what if i don't like it", "satisfaction", "guarantee"],
      response: "🎯 <strong>Your feedback shapes the result!</strong><br><br>Here is how it works: You see the first draft, tell Usama what you love and what you want changed, and he refines it together with you until you are 100% thrilled.<br><br>Final files are provided in print-ready and web-ready formats (high-res PNG, JPG, PDF, or MP4).",
      buttons: [
        { text: "💬 Talk to Usama", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20I%27d%20like%20to%20know%20more%20about%20working%20together." }
      ]
    },
    {
      keywords: ["contact", "hire", "whatsapp", "phone", "number", "email", "reach", "message", "call", "instagram", "tiktok"],
      response: "📞 <strong>Get in touch directly with Muhammad Usama:</strong><br><br><ul><li>💬 <strong>WhatsApp:</strong> <a href='https://wa.me/923373359602' target='_blank' style='color:#25D366;font-weight:700;'>+92 337 3359602</a> (fastest response)</li><li>✉️ <strong>Email:</strong> <a href='mailto:usamaservices4@gmail.com' style='color:#FFA592;'>usamaservices4@gmail.com</a></li><li>📸 <strong>Instagram:</strong> <a href='https://www.instagram.com/usam_agraphics/' target='_blank' style='color:#FF4D2E;'>@usam_agraphics</a></li><li>🎵 <strong>TikTok:</strong> <a href='https://www.tiktok.com/@usamagraphicx4' target='_blank' style='color:#FF4D2E;'>@usamagraphicx4</a></li><li>💼 <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/usama-graphics-601497447/' target='_blank' style='color:#0A66C2;'>Connect on LinkedIn</a></li><li>💼 <strong>Upwork:</strong> <a href='https://www.upwork.com/freelancers/~01fdb7501955a15e95' target='_blank' style='color:#14A800;'>Hire on Upwork</a></li></ul>",
      buttons: [
        { text: "💬 Open WhatsApp Chat Now", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20I%20want%20to%20discuss%20a%20project%20from%20your%20website." },
        { text: "✉️ Send Direct Email", url: "mailto:usamaservices4@gmail.com?subject=Project%20Inquiry" }
      ]
    },
    {
      keywords: ["who is usama", "about", "experience", "bio", "skills", "who are you"],
      response: "👋 <strong>Meet Muhammad Usama:</strong><br><br>Usama is a 3-in-1 creative powerhouse based in Pakistan with <strong>2+ years of professional experience</strong> and over <strong>150+ successful projects completed</strong>.<br><br>He blends <strong>Graphic Design, Video Editing, and Web Development</strong> so all your brand assets look harmonious, fresh, and unified across every screen!",
      buttons: [
        { text: "✨ See Featured Work", url: "index.html#work" },
        { text: "📲 Message Usama", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20let%27s%20work%20together!" }
      ]
    }
  ];

  // Helper to match user text against knowledge base
  function matchKnowledge(text) {
    var lower = text.toLowerCase().trim();
    var bestMatch = null;
    var highestScore = 0;

    for (var i = 0; i < KNOWLEDGE.length; i++) {
      var item = KNOWLEDGE[i];
      var score = 0;
      for (var j = 0; j < item.keywords.length; j++) {
        var kw = item.keywords[j];
        if (lower === kw) {
          score += 15;
        } else if (lower.indexOf(kw) !== -1) {
          score += kw.length > 3 ? 5 : 2;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (highestScore >= 2) {
      return bestMatch;
    }

    // Default friendly fallback for 10-30 year old audience
    return {
      response: "That sounds awesome! 🚀 Whether you're planning a <strong>fresh brand aesthetic, a cafe menu, viral TikTok/Reels edits, or a new website</strong>, Usama can make it look incredible.<br><br>Would you like to check out specific service details, or chat directly with Usama on WhatsApp?",
      buttons: [
        { text: "🍔 Menus & Restaurant Posts", query: "Tell me about menu cards" },
        { text: "🎬 Video & Reel Editing", query: "Tell me about video editing" },
        { text: "💻 Websites & Portfolios", query: "Tell me about website design" },
        { text: "💬 Message Usama on WhatsApp", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20I%20have%20a%20question%20about%20your%20services!" }
      ]
    };
  }

  // Build UI Elements
  function createChatUI() {
    // 1. Floating Launcher
    var launcher = document.createElement("button");
    launcher.id = "ai-chat-launcher";
    launcher.setAttribute("type", "button");
    launcher.setAttribute("aria-label", "Open Usama AI Chatbot");
    launcher.innerHTML =
      '<div class="ai-launcher-avatar" aria-hidden="true">✨</div>' +
      '<div class="ai-launcher-text">' +
        '<span class="ai-launcher-title">Usama AI</span>' +
        '<span class="ai-launcher-subtitle">Ask anything ✨</span>' +
      '</div>';
    document.body.appendChild(launcher);

    // 2. Main Chat Window
    var win = document.createElement("aside");
    win.id = "ai-chat-window";
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", "Usama AI Assistant");
    var hasGemini = Boolean((window.GEMINI_API_KEY && window.GEMINI_API_KEY.trim()) || (window.CHAT_API && window.CHAT_API.trim()));
    var statusText = hasGemini ? "Gemini AI Active • Online" : "Active • Ready to help";

    win.setAttribute("aria-hidden", "true");
    win.innerHTML =
      '<header class="ai-chat-header">' +
        '<div class="ai-header-profile">' +
          '<div class="ai-header-avatar" aria-hidden="true">✨' +
            '<span class="ai-status-dot"></span>' +
          '</div>' +
          '<div class="ai-header-info">' +
            '<h3>Usama AI ✨</h3>' +
            '<p id="ai-status-text"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--ai-green);"></span> ' + statusText + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="ai-header-actions">' +
          '<button type="button" class="ai-header-btn" id="ai-btn-sound" title="Toggle sound" aria-label="Toggle sound">' +
            (soundEnabled ? '🔊' : '🔇') +
          '</button>' +
          '<button type="button" class="ai-header-btn" id="ai-btn-clear" title="Clear chat" aria-label="Clear chat">' +
            '🗑️' +
          '</button>' +
          '<button type="button" class="ai-header-btn" id="ai-btn-close" title="Close chat" aria-label="Close chat">' +
            '&times;' +
          '</button>' +
        '</div>' +
      '</header>' +

      '<div class="ai-audience-tag">' +
        '<span>🚀 Built for Gen Z, Creators & Young Brands (10–30 yrs)</span>' +
      '</div>' +

      '<div class="ai-chat-messages" id="ai-chat-messages" role="log" aria-live="polite"></div>' +

      '<div class="ai-chat-chips-wrap" id="ai-chat-chips">' +
        '<button type="button" class="ai-chip" data-q="Tell me about cafe and restaurant menu designs">🍔 Menu Cards</button>' +
        '<button type="button" class="ai-chip" data-q="How do you edit viral Reels and TikToks?">🔥 Viral Reels</button>' +
        '<button type="button" class="ai-chip" data-q="Tell me about custom modern websites">💻 Sleek Websites</button>' +
        '<button type="button" class="ai-chip" data-q="What graphic designs and social posts do you make?">🎨 Social Posts</button>' +
        '<button type="button" class="ai-chip" data-q="How much does a project cost and are there student discounts?">💰 Pricing & Deals</button>' +
        '<button type="button" class="ai-chip" data-q="How fast is turnaround time?">⚡ Fast Delivery</button>' +
        '<button type="button" class="ai-chip" data-q="How can I contact Usama on WhatsApp?">📲 WhatsApp Info</button>' +
      '</div>' +

      '<footer class="ai-chat-footer">' +
        '<form class="ai-chat-form" id="ai-chat-form">' +
          '<input type="text" class="ai-chat-input" id="ai-chat-input" placeholder="Ask about designs, reels, menus, web..." autocomplete="off">' +
          '<button type="submit" class="ai-chat-send" id="ai-chat-send" aria-label="Send message" disabled>' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
              '<line x1="22" y1="2" x2="11" y2="13"></line>' +
              '<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>' +
            '</svg>' +
          '</button>' +
        '</form>' +
      '</footer>';

    document.body.appendChild(win);

    return {
      launcher: launcher,
      window: win,
      messages: document.getElementById("ai-chat-messages"),
      form: document.getElementById("ai-chat-form"),
      input: document.getElementById("ai-chat-input"),
      sendBtn: document.getElementById("ai-chat-send"),
      closeBtn: document.getElementById("ai-btn-close"),
      soundBtn: document.getElementById("ai-btn-sound"),
      clearBtn: document.getElementById("ai-btn-clear"),
      chipsWrap: document.getElementById("ai-chat-chips")
    };
  }

  // Format Time (e.g. 11:42 AM)
  function getCurrentTime() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    m = m < 10 ? '0' + m : m;
    return h + ':' + m + ' ' + ampm;
  }

  // Render Bot Message
  function appendBotMessage(container, contentHtml, buttons, timeStr) {
    var time = timeStr || getCurrentTime();
    var msgDiv = document.createElement("div");
    msgDiv.className = "ai-msg bot";

    var btnHtml = "";
    if (buttons && buttons.length) {
      btnHtml += '<div class="ai-action-buttons">';
      for (var i = 0; i < buttons.length; i++) {
        var b = buttons[i];
        if (b.url) {
          var cls = b.url.indexOf("wa.me") !== -1 ? "wa-btn" : (b.primary ? "primary-btn" : "ghost-btn");
          btnHtml += '<a href="' + b.url + '" class="ai-action-btn ' + cls + '" target="_blank" rel="noopener">' + b.text + '</a>';
        } else if (b.query) {
          btnHtml += '<button type="button" class="ai-action-btn ghost-btn ai-reply-btn" data-query="' + b.query.replace(/"/g, '&quot;') + '">' + b.text + '</button>';
        }
      }
      btnHtml += '</div>';
    }

    msgDiv.innerHTML =
      '<div class="ai-msg-avatar" aria-hidden="true">✨</div>' +
      '<div class="ai-msg-body">' +
        '<div class="ai-bubble">' + contentHtml + btnHtml + '</div>' +
        '<span class="ai-msg-time">' + time + '</span>' +
      '</div>';

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    playTone("receive");
  }

  // Render User Message
  function appendUserMessage(container, text, timeStr) {
    var time = timeStr || getCurrentTime();
    var msgDiv = document.createElement("div");
    msgDiv.className = "ai-msg user";

    var safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    msgDiv.innerHTML =
      '<div class="ai-msg-body">' +
        '<div class="ai-bubble">' + safeText + '</div>' +
        '<span class="ai-msg-time">' + time + '</span>' +
      '</div>';

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    playTone("send");
  }

  // Show Typing Indicator
  function showTyping(container) {
    var tDiv = document.createElement("div");
    tDiv.id = "ai-typing-temp";
    tDiv.className = "ai-msg bot";
    tDiv.innerHTML =
      '<div class="ai-msg-avatar" aria-hidden="true">✨</div>' +
      '<div class="ai-typing-indicator">' +
        '<div class="ai-dot"></div>' +
        '<div class="ai-dot"></div>' +
        '<div class="ai-dot"></div>' +
      '</div>';
    container.appendChild(tDiv);
    container.scrollTop = container.scrollHeight;
    return tDiv;
  }

  function removeTyping(container) {
    var t = document.getElementById("ai-typing-temp");
    if (t) t.remove();
  }

  // Storage Handlers
  function saveHistory(messages) {
    try {
      sessionStorage.setItem("usama_ai_history", JSON.stringify(messages));
    } catch (e) {}
  }

  function loadHistory() {
    try {
      var d = sessionStorage.getItem("usama_ai_history");
      return d ? JSON.parse(d) : null;
    } catch (e) {
      return null;
    }
  }

  // Markdown & line break formatter for AI replies
  function formatReplyMarkdown(str) {
    if (!str) return "";
    var s = String(str);
    s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    s = s.replace(/^###?\s+(.+)$/gm, function (_, m) { return "<strong>" + m + "</strong>"; });
    s = s.replace(/\*\*(.+?)\*\*/g, function (_, m) { return "<strong>" + m + "</strong>"; });
    s = s.replace(/\*([^*\n]+)\*/g, function (_, m) { return "<em>" + m + "</em>"; });
    s = s.replace(/^[\*\-]\s+(.+)$/gm, function (_, m) { return "<li>" + m + "</li>"; });
    s = s.replace(/^\d+\.\s+(.+)$/gm, function (_, m) { return "<li>" + m + "</li>"; });
    s = s.replace(/((?:<li>.+?<\/li>\s*)+)/gs, function (m) {
      return "<ul>" + m.replace(/\n/g, "") + "</ul>";
    });
    s = s.replace(/\n\n+/g, "<br><br>");
    s = s.replace(/\n/g, "<br>");
    return s;
  }

  // Call optional external Gemini API Worker or direct API key
  async function callExternalApi(userText, history) {
    var apiUrl = window.CHAT_API;

    // 1. Cloudflare Worker proxy (Best for public GitHub)
    if (apiUrl && typeof apiUrl === "string" && apiUrl.trim() !== "") {
      try {
        var controller = new AbortController();
        var timeout = setTimeout(function () { controller.abort(); }, 12000);

        var resp = await fetch(apiUrl.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userText,
            history: history || []
          }),
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (resp.ok) {
          var data = await resp.json();
          if (data && (data.reply || data.response || data.text)) {
            var reply = data.reply || data.response || data.text;
            return {
              response: formatReplyMarkdown(reply),
              buttons: [
                { text: "💬 Chat on WhatsApp", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20I%20saw%20your%20website%20and%20want%20to%20discuss%20a%20project!" },
                { text: "👀 View Services", url: "services.html" }
              ]
            };
          }
        } else {
          console.warn("Usama AI: Cloudflare Worker returned status " + resp.status);
        }
      } catch (err) {
        console.warn("Usama AI: Cloudflare Worker call failed, falling back to direct key or local engine.", err);
      }
    }

    // 2. Direct Gemini API call for local testing (via chat-key.js, protected by .gitignore)
    var localKey = window.GEMINI_API_KEY;
    if (localKey && typeof localKey === "string" && localKey.trim() !== "") {
      // Build clean conversation turns (Gemini requires alternating user/model turns starting with 'user')
      var contents = [];
      var priorTurns = Array.isArray(history) ? history.slice(0, -1) : [];
      var recent = priorTurns.slice(-6);
      for (var i = 0; i < recent.length; i++) {
        var item = recent[i];
        if (item.sender === "user" && item.text) {
          contents.push({ role: "user", parts: [{ text: item.text }] });
        } else if (item.sender === "bot" && item.text) {
          var plain = item.text.replace(/<[^>]*>?/gm, " ").trim();
          if (plain && contents.length > 0 && contents[contents.length - 1].role !== "model") {
            contents.push({ role: "model", parts: [{ text: plain }] });
          }
        }
      }
      contents.push({ role: "user", parts: [{ text: userText }] });

      var systemPrompt =
        "You are Usama AI, the smart creative copilot for Muhammad Usama, a professional graphic designer, video editor, and web developer with 2+ years of experience and 150+ completed projects.\n" +
        "Target Audience: Youth, students, creators, brands, and cafe/restaurant founders (ages 10 to 30).\n" +
        "Personality: Modern, friendly, polite, energetic, creative.\n" +
        "CRITICAL LANGUAGE RULE: Always reply in the exact language the user used! If the user writes in Roman Urdu or Urdu (e.g., 'kya hal he', 'prices batao', 'video editing kitne me karoge', 'menu card banwana hai'), reply enthusiastically in friendly, natural Roman Urdu. If they write in English, reply in English.\n" +
        "Key Services:\n" +
        "- Restaurant & Cafe Branding: Menu cards (single, bi-fold, tri-fold, digital booklets), burger/pizza food promotion posters, table tents, LED screens.\n" +
        "- Viral Video Editing: Instagram Reels, TikTok, YouTube Shorts (fast pacing, jump cuts, kinetic captions, sound design, color grading).\n" +
        "- Graphic Design: Social media posts, carousels, logos, branding packages, posters.\n" +
        "- Sleek Modern Websites: Mobile-friendly, high performance, interactive animations, portfolio & business landing pages.\n" +
        "Pricing & Revisions: Affordable and creator/student-friendly pricing. Unlimited revisions until 100% satisfied.\n" +
        "Contact info: WhatsApp: +92 337 3359602, Email: usamaservices4@gmail.com, Instagram: @usam_agraphics, TikTok: @usamagraphicx4, LinkedIn: https://www.linkedin.com/in/usama-graphics-601497447/.\n" +
        "Keep responses punchy, concise, formatted with emojis, bold text, and bullet points.";

      // Candidate models: gemini-3.5-flash is stable and instant, with fallbacks
      var candidateModels = [
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemini-3.8-flash"
      ];

      for (var m = 0; m < candidateModels.length; m++) {
        var modelName = candidateModels[m];
        try {
          var controller2 = new AbortController();
          var timeout2 = setTimeout(function () { controller2.abort(); }, 12000);

          var directUrl = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + encodeURIComponent(localKey.trim());

          var directResp = await fetch(directUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: systemPrompt }]
              },
              contents: contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600
              }
            }),
            signal: controller2.signal
          });
          clearTimeout(timeout2);

          if (directResp.ok) {
            var directData = await directResp.json();
            var rawReply = directData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawReply) {
              console.log("Usama AI: Successfully generated response using " + modelName);
              return {
                response: formatReplyMarkdown(rawReply),
                buttons: [
                  { text: "💬 Chat on WhatsApp", url: "https://wa.me/923373359602?text=Hi%20Usama%2C%20I%20want%20to%20discuss%20a%20project!" },
                  { text: "👀 View Services", url: "services.html" }
                ]
              };
            }
          } else {
            var errText = "";
            try { errText = await directResp.text(); } catch (e) {}
            console.warn("Usama AI: Model " + modelName + " returned status " + directResp.status + ": " + errText + ". Trying fallback model...");
          }
        } catch (err2) {
          console.warn("Usama AI: Call to " + modelName + " failed: " + err2.message + ". Trying fallback model...");
        }
      }
    }

    return null;
  }

  // Initial Setup on DOM ready
  function init() {
    var ui = createChatUI();
    var chatHistory = loadHistory() || [];

    // Show initial greeting if new session
    if (chatHistory.length === 0) {
      var welcome = {
        sender: "bot",
        text: "Hey! 👋 Welcome to <strong>Usama's Creative Studio</strong>!<br><br>I'm <strong>Usama AI</strong>, built for creators, foodies & young brand builders (10–30 yrs).<br><br>Whether you need a <strong>mouth-watering cafe menu</strong>, <strong>scroll-stopping TikTok/Reels edits</strong>, or a <strong>sleek website</strong> — I'm ready to help you level up! 🚀<br><br>What would you like to explore?",
        buttons: [
          { text: "🍔 Restaurant & Cafe Menus", query: "Tell me about cafe and restaurant menu designs" },
          { text: "🔥 Viral Reels & TikToks", query: "How do you edit viral Reels and TikToks?" },
          { text: "💻 Modern Websites", query: "Tell me about custom modern websites" },
          { text: "💰 Pricing & Deals", query: "How much does a project cost and are there student discounts?" }
        ],
        time: getCurrentTime()
      };
      chatHistory.push(welcome);
      saveHistory(chatHistory);
    }

    // Render stored history
    for (var i = 0; i < chatHistory.length; i++) {
      var item = chatHistory[i];
      if (item.sender === "user") {
        appendUserMessage(ui.messages, item.text, item.time);
      } else {
        appendBotMessage(ui.messages, item.text, item.buttons, item.time);
      }
    }

    // Toggle Chat Window
    function openChat() {
      ui.window.classList.add("is-open");
      ui.window.setAttribute("aria-hidden", "false");
      setTimeout(function () {
        ui.input.focus();
        ui.messages.scrollTop = ui.messages.scrollHeight;
      }, 200);
    }

    function closeChat() {
      ui.window.classList.remove("is-open");
      ui.window.setAttribute("aria-hidden", "true");
    }

    ui.launcher.addEventListener("click", function () {
      if (ui.window.classList.contains("is-open")) {
        closeChat();
      } else {
        openChat();
      }
    });

    ui.closeBtn.addEventListener("click", closeChat);

    // ESC key closes chat
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && ui.window.classList.contains("is-open")) {
        closeChat();
      }
    });

    // Sound Toggle
    ui.soundBtn.addEventListener("click", function () {
      soundEnabled = !soundEnabled;
      localStorage.setItem("usama_ai_sound", soundEnabled ? "true" : "false");
      ui.soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
      if (soundEnabled) playTone("receive");
    });

    // Clear Chat
    ui.clearBtn.addEventListener("click", function () {
      if (confirm("Reset chat conversation?")) {
        sessionStorage.removeItem("usama_ai_history");
        ui.messages.innerHTML = "";
        chatHistory = [];
        var resetWelcome = {
          sender: "bot",
          text: "Chat refreshed! ✨ What can I help you create today?",
          buttons: [
            { text: "🍔 Menu Designs", query: "Tell me about menu cards" },
            { text: "🎬 Video Edits", query: "Tell me about video editing" },
            { text: "💻 Websites", query: "Tell me about website design" },
            { text: "💬 WhatsApp Usama", url: "https://wa.me/923373359602" }
          ],
          time: getCurrentTime()
        };
        chatHistory.push(resetWelcome);
        saveHistory(chatHistory);
        appendBotMessage(ui.messages, resetWelcome.text, resetWelcome.buttons, resetWelcome.time);
      }
    });

    // Enable/Disable Send button based on input
    ui.input.addEventListener("input", function () {
      ui.sendBtn.disabled = ui.input.value.trim() === "";
    });

    // Handle User Submission
    async function handleUserSubmit(text) {
      var query = text.trim();
      if (!query) return;

      ui.input.value = "";
      ui.sendBtn.disabled = true;

      // Add to UI & history
      var userTime = getCurrentTime();
      appendUserMessage(ui.messages, query, userTime);
      chatHistory.push({ sender: "user", text: query, time: userTime });
      saveHistory(chatHistory);

      // Show typing indicator
      showTyping(ui.messages);

      // Try external API first (if set in chat-config.js)
      var result = await callExternalApi(query, chatHistory);

      // If no external API, compute using rich built-in NLP engine
      if (!result) {
        result = matchKnowledge(query);
      }

      // Realistic typing delay (350ms - 800ms)
      var delay = Math.min(Math.max(query.length * 15, 400), 850);
      setTimeout(function () {
        removeTyping(ui.messages);
        var botTime = getCurrentTime();
        appendBotMessage(ui.messages, result.response, result.buttons, botTime);

        chatHistory.push({
          sender: "bot",
          text: result.response,
          buttons: result.buttons,
          time: botTime
        });
        saveHistory(chatHistory);
      }, delay);
    }

    ui.form.addEventListener("submit", function (e) {
      e.preventDefault();
      handleUserSubmit(ui.input.value);
    });

    // Quick chip clicks
    ui.chipsWrap.addEventListener("click", function (e) {
      var chip = e.target.closest(".ai-chip");
      if (chip && chip.dataset.q) {
        handleUserSubmit(chip.dataset.q);
      }
    });

    // Reply buttons inside bot bubbles
    ui.messages.addEventListener("click", function (e) {
      var btn = e.target.closest(".ai-reply-btn");
      if (btn && btn.dataset.query) {
        handleUserSubmit(btn.dataset.query);
      }
    });
  }

  // Load when document is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
