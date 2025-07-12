import { useState, useEffect, useRef } from 'react';
import axios from '../api/ai'; 
import MovieCard from './MovieCard'; 

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Hi! Tell me your mood or the kind of movie you want to watch 🎬' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { type: 'user', text: trimmed };
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('/search', { prompt: trimmed });

      setMessages(prev => [
        ...prev,
        userMessage,
        { type: 'ai', text: data.message || 'Here are your recommendations:' },
        ...(data.movies || []).map(movie => ({ type: 'movie', movie }))
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { type: 'ai', text: '❌ Sorry, something went wrong. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col bg-gradient-to-r from-slate-700 to-zinc-900">
      <h2 className="text-2xl font-semibold mb-4 text-center bg-blue-700 text-blue-50 px-4 py-2 rounded shadow">🎥 Lyft AI</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto  mb-4 text-white rounded-lg shadow p-4 border border-gray-200">
        {messages.map((msg, idx) =>
          msg.type === 'movie' ? (
            <MovieCard key={idx} movie={msg.movie} />
          ) : (
            <div
              key={idx}
              className={`max-w-[75%] px-4 py-2 col-span-full rounded-xl ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white self-end ml-auto'
                  : 'bg-zinc-800 text-zinc-500 self-start mr-auto'
              }`}
            >
              {msg.text}
            </div>
          )
        )}
        {loading && (
          <div className="bg-zinc-800 text-zinc-50 px-4 py-2 rounded-xl self-start animate-pulse w-32">
            Typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2">
        <textarea
          rows={1}
          className="flex-1 resize-none rounded-md border border-blue-500 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
          placeholder="Describe a mood or genre..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
