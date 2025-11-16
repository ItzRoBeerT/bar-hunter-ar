import { ArrowLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
};

const predefinedResponses = [
  "Hombre, ¿Te sabes la de la melena que tenía wifi? Con la tuya me llega señal hasta en el coche patrulla.",
  "Hombre,¿Te sabes el de Rapunzel versión barrio? Igualito que tú, pero con menos acondicionador.",
  "Hombre, ¿Te sabes la de Sansón? Pues tú igual, pero sin gimnasio y con más secador.",
  "Hombre, ¿Te sabes el del rockero que se perdió en su propio pelo? Mira, mira… que te veo candidato.",
  "Hombre, ¿Te sabes la de la peluquera que pidió refuerzos? Te ve a ti entrar y llama a Protección Civil.",
  "Hombre, ¿Te sabes el del tío que hacía sombra con la melena? Tú lo superas fácil, campeón.",
  "Hombre, ¿Te sabes la de la coleta que tenía GPS? Con la tuya ya están pensando en poner radares.",
  "Hombre, ¿Te sabes el del tipo que usaba su melena como paraguas? Tú con eso haces un festival entero.",
  "Hombre, ¿Te sabes la de la melena que tenía su propio código postal? Con la tuya ya están negociando.",
  "Hombre, ¿Te sabes el del que se peinaba con viento a favor? Tú necesitas un equipo de meteorólogos."
];

const CharlaConPaco: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getRandomResponse = (): string => {
    return predefinedResponses[
      Math.floor(Math.random() * predefinedResponses.length)
    ];
  };

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Bot responde con un mensaje aleatorio tras un retardo realista
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: getRandomResponse(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, Math.random() * 1500 + 500); // Entre 500ms y 2s
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header
        style={{
          background: "#d73719",
          borderBottom: "1px solid #b02b13",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          gap: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "none",
            padding: "8px",
            borderRadius: "8px",
            cursor: "pointer",
            color: "white",
            position: "absolute",
            left: "16px",
          }}
        >
          <ArrowLeft
            style={{ width: "24px", height: "24px", color: "white" }}
          />
        </button>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
            margin: 0,
          }}
        >
          Charla con paco 
        </h1>
      </header>
      
      <div className="p-4 pt-2">
        <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Chat info header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex items-center space-x-4">
              <img
                src="torrente.jpeg"
                alt="Paco"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="text-lg font-bold">Paco</h2>
                <p className="text-blue-100 text-sm">
                  Tu asistente personal para encontrar bares
                </p>
              </div>
              <div className="ml-auto">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-100">En línea</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[calc(100vh-200px)] flex flex-col">
            {/* Área de mensajes mejorada */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-end space-x-3 ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Avatar del bot */}
                  {m.sender === "bot" && (
                    <img
                      src="torrente.jpeg"
                      alt="Paco"
                      className="w-12 h-12 rounded-full"
                    />
                  )}

                  <div className="flex flex-col space-y-1 max-w-[80%]">
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        m.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div
                      className={`text-xs text-gray-400 px-2 ${
                        m.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {formatTime(m.timestamp)}
                    </div>
                  </div>

                  {/* Avatar del usuario */}
                  {m.sender === "user" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      👤
                    </div>
                  )}
                </div>
              ))}

              {/* Indicador de escritura */}
              {isTyping && (
                <div className="flex items-end space-x-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    P
                  </div>
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-200 px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input mejorado */}
            <form
              onSubmit={sendMessage}
              className="p-6 bg-white border-t border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    aria-label="Escribe un mensaje"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Pregunta sobre bares, ambiente, ubicación..."
                    disabled={isTyping}
                  />
                  {input && (
                    <button
                      type="button"
                      onClick={() => setInput("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  disabled={!input.trim() || isTyping}
                >
                  <span className="flex items-center space-x-2">
                    <span>Enviar</span>
                    <span>📤</span>
                  </span>
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "¿Bares cerca de mí?",
                  "¿Horarios?",
                  "Recomendaciones",
                  "¿Precios?",
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                    disabled={isTyping}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharlaConPaco;