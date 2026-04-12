import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import ChatBubble from '../components/ChatBubble';
import SuggestedPrompts from '../components/chat/SuggestedPrompts';
import { sendChatMessage } from '../services/chatService';
import { buildFallbackChatReply, extractErrorMessage } from '../utils/helpers';
import { chatSuggestedPrompts } from '../utils/fallbackData';

function ChatAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-assistant',
      role: 'assistant',
      content: 'Hello. I am your AI healthcare assistant. Ask about your prescriptions, medicines, or follow-up notes.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const appendMessage = (role, content) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role,
        content,
      },
    ]);
  };

  const submitMessage = async (messageText) => {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    setError('');
    setInput('');
    appendMessage('user', trimmed);
    setIsSending(true);

    try {
      const response = await sendChatMessage(trimmed);
      const reply = response?.reply || buildFallbackChatReply(trimmed);
      appendMessage('assistant', reply);
    } catch (err) {
      const message = extractErrorMessage(err, 'Chat API unavailable. Generated fallback response.');
      setError(message);
      toast.error(message);
      appendMessage('assistant', buildFallbackChatReply(trimmed));
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitMessage(input);
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">AI Chat Assistant</h2>
        <p className="text-sm text-slate-600">
          Ask contextual questions based on your uploaded prescriptions and medication notes.
        </p>
      </div>

      <div className="rounded-card border border-slate-200 bg-white p-4 shadow-card">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Suggested Prompts</p>
        <SuggestedPrompts
          prompts={chatSuggestedPrompts}
          onSelect={(prompt) => {
            setInput(prompt);
            submitMessage(prompt);
          }}
          disabled={isSending}
        />
      </div>

      <div className="rounded-card border border-slate-200 bg-white shadow-card">
        <div className="h-[55vh] space-y-3 overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} role={message.role} content={message.content} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-slate-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="input-base"
              placeholder="Type your healthcare question..."
              disabled={isSending}
            />
            <button type="submit" className="btn-primary w-28" disabled={isSending || !input.trim()}>
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </form>
          {error ? <p className="mt-2 text-xs text-amber-700">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}

export default ChatAssistantPage;
