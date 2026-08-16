const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

const HF_MODEL =
  process.env.HUGGINGFACE_MODEL ||
  'google/gemma-2-2b-it';

const HF_URL =
  'https://router.huggingface.co/v1/chat/completions';

const SYSTEM_CONTEXT =
  'You are the assistant for a waste management and sustainability app. ' +
  'Answer briefly about waste sorting, recycling, composting and green services. ' +
  'If you are unsure, say "I am not sure about that, try to see the website or contact customer care." ' +
  'Do not answer about unrelated topics.';

const FALLBACK_REPLY =
  "Sorry, I couldn't reach the assistant right now. You can visit the site, or ask about a specific waste item in simpler terms.";


async function callHuggingFace(message, history = []) {

  const messages = [
    {
      role: 'system',
      content: SYSTEM_CONTEXT
    }
  ];

  // Add previous conversation
  if (Array.isArray(history)) {
    history.forEach((h) => {
      if (
        h &&
        (h.role === 'user' || h.role === 'assistant') &&
        h.text
      ) {
        messages.push({
          role: h.role,
          content: h.text
        });
      }
    });
  }

  // Current user message
  messages.push({
    role: 'user',
    content: message
  });

  const res = await fetch(HF_URL, {
    method: 'POST',

    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      model: HF_MODEL,
      messages,
      max_tokens: 150,
      temperature: 0.4
    })
  });

  if (!res.ok) {

    const errorText = await res.text();

    console.error(
      'Hugging Face error:',
      res.status,
      errorText
    );

    throw new Error(
      `Hugging Face API responded ${res.status}`
    );
  }

  const data = await res.json();

  const text =
    data?.choices?.[0]?.message?.content;

  if (!text) {
    console.error(
      'Unexpected Hugging Face response:',
      data
    );

    throw new Error(
      'Hugging Face API returned no text'
    );
  }

  return text.trim();
}


// POST /api/chat
// { message, history? }

exports.ask = async (req, res) => {

  const { message, history } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      message: 'message is required'
    });
  }

  if (!HF_API_KEY) {

    console.error(
      'HUGGINGFACE_API_KEY is missing'
    );

    return res.json({
      reply: FALLBACK_REPLY,
      usingFallback: true
    });
  }

  try {

    const reply =
      await callHuggingFace(
        message,
        history
      );

    res.json({
      reply,
      usingFallback: false
    });

  } catch (err) {
    console.error('========== HUGGING FACE API CHATBOT ERROR ============');
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);

    res.json({
      reply: FALLBACK_REPLY,
      usingFallback: true
    });
  }
};