import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi! I'm the engineersTech assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    // Simple keyword-based responses for now
    setTimeout(() => {
      let response = "For specific inquiries, please contact us at info@engineerstechbd.com or call +880 1234-567890.";
      
      if (userMessage.toLowerCase().includes("service")) {
        response = "We offer Enterprise Solutions (HRM, CRM, ERP), Custom Development, Security & Finance solutions, and AI Integration. Would you like to know more?";
      } else if (userMessage.toLowerCase().includes("contact") || userMessage.toLowerCase().includes("email")) {
        response = "You can reach us at: Email: info@engineerstechbd.com, Phone: +880 1234-567890. We're happy to help!";
      } else if (userMessage.toLowerCase().includes("price") || userMessage.toLowerCase().includes("cost")) {
        response = "Our pricing varies based on project requirements. Please contact our sales team at info@engineerstechbd.com for a detailed quote.";
      }
      
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-primary shadow-primary flex items-center justify-center transition-all hover:scale-110 ${isOpen ? "hidden" : ""}`}
      >
        <MessageCircle size={24} className="text-primary-foreground" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">e</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">engineersTech</h3>
                <p className="text-xs text-primary">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-br-md" 
                    : "bg-secondary text-foreground rounded-bl-md"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary px-4 py-2 rounded-2xl rounded-bl-md">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="bg-secondary border-border"
              />
              <Button onClick={handleSend} size="icon" variant="gradient" disabled={loading}>
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
