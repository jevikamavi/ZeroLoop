import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { recyclingItems } from '../data/mockData.js';
import { IconChat, IconSend, IconClose, IconRecycle } from './icons.jsx';

// if ai isn't working

const STOPWORDS = ['and', 'the', 'for', 'from', 'with', 'your', 'my', 'the', 'is', 'are', 'this', 'that', 'these', 'those', 'a', 'an', 'in', 'on', 'at', 'to', 'of','and'];

function findRecyclingMatch(message) {
  const msg = message.toLowerCase();
  for (const item of recyclingItems) {
    const words = item.name
      .toLowerCase()
      .replace(/[(){}@*#]/g, '')
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !STOPWORDS.includes(w));
    const matched = words.some((w) => new RegExp(`\\b${w}\\b`).test(msg));
    if (matched) return item;
  }
  return null;
}

const GREETING = {
  role: 'bot',
  text: "Hi, I'm the ZeroLoop assistant. Ask me anything about recycling or ideas."
};

export default function ChatWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const match = findRecyclingMatch(text);
    if (match) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: `${match.name} goes in ${match.category}. ${match.note}`,
          action: { label: 'Open Recycling Guide', to: '/guide' }
        }
      ]);
      return;
    }

    setLoading(true);
    const history = messages.slice(-6).map((m) => ({ role: m.role, text: m.text }));
    const result = await api.askAssistant(text, history);
    setLoading(false);
    setMessages((prev) => [
      ...prev,
      { role: 'bot', text: result?.reply || "Sorry, I couldn't reach the assistant just now. You can try the Recycling Guide for your questions." }
    ]);
  };

  const goToGuide = () => {
    setOpen(false);
    navigate('/guide');
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} aria-label="Open sorting assistant">
        {open ? <IconClose className="ic" /> : <IconChat className="ic" />}
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/logo.png" alt="ZeroLoop logo" className="brand-mark" />

              <span>ZeroLoop Assistant</span>
            </div>
            <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => setOpen(false)} aria-label="Close">
              <IconClose className="ic-sm" />
            </button>
          </div>

          <div className="chat-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div className={'chat-bubble ' + m.role} key={i}>
                {m.text}
                {m.action && (
                  <button className="chat-action-btn" onClick={goToGuide}>
                    {m.action.label} →
                  </button>
                )}
              </div>
            ))}
            {loading && <div className="chat-bubble bot chat-typing">Thinking…</div>}
          </div>

          <form className="chat-input-row" onSubmit={send}>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about anything!”"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chat-send-btn" aria-label="Send">
              <IconSend className="ic-sm" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
