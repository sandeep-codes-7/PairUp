import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// Helper function for avatar colors
const colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];
function getAvatarColor(messageSender: string) {
  let hash = 0;
  for (let i = 0; i < messageSender.length; i++) {
    hash = 31 * hash + messageSender.charCodeAt(i);
  }
  return colors[Math.abs(hash % colors.length)];
}

export default function Preferences() {
  // --- FORM & UI STATES ---
  const [formData, setFormData] = useState({
    nickname: "",
    gender: "male",
    interests: "", // Kept as string for the text input
  });
  const [setupStatus, setSetupStatus] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [chatTitle, setChatTitle] = useState("Chatting with stranger");

  // --- CHAT STATES & REFS ---
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  
  const ws = useRef<WebSocket | null>(null);
  const currentRoomId = useRef<string | null>(null);
  const myUsername = useRef<string>("Anonymous");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup WebSocket on component unmount
  useEffect(() => {
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    myUsername.current = formData.nickname.trim() || "Anonymous";
    const interestsList = formData.interests
      .split(',')
      .map(i => i.trim())
      .filter(i => i !== "");

    setSetupStatus("Registering your profile...");

    try {
      const response = await fetch('http://localhost:8080/api/chat/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: myUsername.current, 
          gender: formData.gender, 
          interests: interestsList 
        })
      });

      const data = await response.json();
      setSetupStatus("Waiting for a match...");
      connectWebSocket(data.userId);

    } catch (error) {
      setSetupStatus("Failed to connect to server.");
    }
  };

  const connectWebSocket = (userId: string) => {
    // const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    // const wsUrl = protocol + window.location.host + "/ws/" + userId;
    const wsUrl = `ws://localhost:8080/ws/${userId}`;    
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessageReceived(message);
    };

    ws.current.onerror = () => {
      setSetupStatus('Could not connect to WebSocket server. Refresh to try again!');
    };
  };

  const onMessageReceived = (message: any) => {
    if (message.type === 'MATCHED') {
      currentRoomId.current = message.roomId;
      setChatTitle("Chatting with " + message.partnerName);
      setIsChatting(true); // Switches UI from Setup to Chat

      // Tell the server we are joining the room
      ws.current?.send(JSON.stringify({
        sender: myUsername.current,
        type: 'JOIN',
        roomId: message.roomId
      }));
      return;
    }

    // Handle normal chat, join, and leave events
    setMessages((prev) => [...prev, message]);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = chatInput.trim();
    
    if (messageContent && ws.current && currentRoomId.current) {
      const chatMessage = {
        sender: myUsername.current,
        content: messageContent,
        type: 'CHAT',
        roomId: currentRoomId.current
      };
      ws.current.send(JSON.stringify(chatMessage));
      setChatInput(""); // Clear input
    }
  };

  return (
    <>
      {/* conditionally render setup page or chat page based on `isChatting` */}
      {!isChatting ? (
        <div id="setup-page" className="setup-screen flex justify-center items-center h-full">
          <form
            onSubmit={handleSetupSubmit}
            className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-[3rem] w-[40rem] p-10 flex flex-col gap-8 shadow-[0px_0px_20px_5px_rgba(168,85,247,0)] shadow-purple-400"
          >
            <h2 className="text-purple-500 text-2xl font-bold tracking-tight">
              Set your data
            </h2>

            <div className="flex flex-col gap-6">
              <div>
                <label className="text-purple-200 text-sm uppercase tracking-widest mb-3 block opacity-70">
                  Gender
                </label>
                <div className="flex gap-6 justify-center items-center">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                      className="w-5 h-5 accent-purple-500 bg-transparent border-white/20"
                    />
                    <span className="text-white group-hover:text-purple-300 transition-colors">
                      Male
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                      className="w-5 h-5 accent-purple-500 bg-transparent border-white/20"
                    />
                    <span className="text-white group-hover:text-purple-300 transition-colors">
                      Female
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-purple-200 text-sm uppercase tracking-widest opacity-70">
                  Nickname
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="e.g. Sandy"
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-purple-200 text-sm uppercase tracking-widest opacity-70">
                  Interests
                </label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="e.g. Gaming, Music, Coding..."
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/20"
            >
              Ready to enter
            </button>
            {/* Show status like "Waiting for a match..." */}
            {setupStatus && (
              <p id="setup-status" className="text-center text-purple-300 mt-2">
                {setupStatus}
              </p>
            )}
          </form>
        </div>
      ) : (
        <div id="chat-page" className="w-full h-full flex justify-center items-center p-4">
          
          {/* Main Chat Container - Wide, Tall, and Flexible */}
          <div className="w-full max-w-5xl h-[85vh] flex flex-col bg-black/80 backdrop-blur-xl border border-white/10 rounded-[1rem] shadow-[0px_0px_30px_5px_rgba(168,85,247,0.1)] p-2">
            
            {/* Header - Fixed Top */}
            <div className="chat-header shrink-0 border-b border-white/10 pb-4">
              <a href="/chat" className="text-purple-400 hover:text-purple-300 mb-2 inline-block transition-colors text-sm">
                &larr; Go back
              </a>
              <h2 id="chat-title" className="text-white font-bold text-2xl tracking-tight">{chatTitle}</h2>
            </div>
            
            {/* Messages Area - Scrollable, Flex-1 pushes input to bottom */}
            <ul id="messageArea" className="flex-1 overflow-y-auto p-4 bg-white/5 rounded-xl mt-4 mb-4 pr-2 no-scrollbar">
              {messages.map((msg, index) => {
                // Event messages (Join/Leave)
                if (msg.type === 'JOIN' || msg.type === 'LEAVE') {
                  const eventText = msg.type === 'JOIN' ? 'joined!' : 'left! Refresh to find a new match.';
                  return (
                    <li key={index} className="event-message flex justify-center my-4">
                      <span className="bg-white/10 px-4 py-1 rounded-full text-gray-400 text-xs">
                        {msg.content || `${msg.sender} ${eventText}`}
                      </span>
                    </li>
                  );
                }

                // Normal Chat messages
                return (
                  <li key={index} className="chat-message flex items-end gap-3 my-5">
                    <i 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-lg shadow-lg"
                      style={{ backgroundColor: getAvatarColor(msg.sender) }}
                    >
                      {msg.sender[0]}
                    </i>
                    {/* max-w-[80%] prevents the bubble from stretching all the way across */}
                    <div className="bg-white/10 rounded-2xl p-4 text-white shadow-sm ">
                      <span className="text-xs text-purple-300 font-semibold block mb-1">{msg.sender}</span>
                      {/* break-words and whitespace-pre-wrap FIX the text overflow issue */}
                      <p className="break-words whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                        {msg.content}
                      </p>
                    </div>
                  </li>
                );
              })}
              {/* Invisible div to scroll into view */}
              <div ref={messagesEndRef} />
            </ul>

            {/* Input Form - Fixed Bottom */}
            <form id="messageForm" name="messageForm" onSubmit={handleChatSubmit} className="shrink-0 mt-auto">
              <div className="flex gap-3">
                <input
                  type="text"
                  id="message"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  autoComplete="off"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-white/20"
                />
                <button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 rounded-xl transition-all shadow-lg shadow-purple-500/20 active:scale-95"
                >
                  Send
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}
    </>
  );
}