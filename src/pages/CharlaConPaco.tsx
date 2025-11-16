import React, { useEffect, useRef, useState } from 'react';

type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
};

const CharlaConPaco: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Bot responde con el mismo texto (eco) tras un pequeño retardo
    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, sender: 'bot', text };
      setMessages((prev) => [...prev, botMsg]);
    }, 250);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
  <div className="w-full max-w-3xl bg-white rounded-lg shadow-md overflow-hidden text-black" style={{ color: 'black' }}>
        <div className="px-6 py-5 border-b">
          <h1 className="text-2xl font-semibold">Charla con paco</h1>
        </div>

        <div className="h-[60vh] md:h-[70vh] flex flex-col">
          {/* Area de mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-sm text-gray-500 mt-8">Empieza la conversación escribiendo abajo...</div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg text-sm leading-relaxed ${
                      m.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none border'
                    }`}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                aria-label="Escribe un mensaje"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    sendMessage();
                  }
                }}
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Escribe algo..."
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={!input.trim()}>
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CharlaConPaco;
