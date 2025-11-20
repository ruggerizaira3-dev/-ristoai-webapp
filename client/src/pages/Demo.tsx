import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Bot, Send, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

// Demo restaurant ID (hardcoded for demo purposes)
const DEMO_RESTAURANT_ID = 1;

export default function Demo() {
  const [sessionId] = useState(() => `demo-${Date.now()}-${Math.random().toString(36).substring(7)}`);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Ciao! 👋 Sono RistoAI, il tuo assistente virtuale. Posso aiutarti con informazioni sul menu, prenotazioni e domande sul ristorante. Come posso aiutarti oggi?"
    }
  ]);

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
    },
  });

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    // Send to backend
    sendMessageMutation.mutate({
      sessionId,
      message: userMessage,
      restaurantId: DEMO_RESTAURANT_ID,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10 rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-primary">{APP_TITLE}</h1>
              <p className="text-xs text-muted-foreground">Demo Interattiva</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/">Torna alla Home</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        <div className="mx-auto max-w-4xl">
          {/* Info Banner */}
          <div className="mb-6 rounded-lg border bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Bot className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-primary">Prova RistoAI in Azione</h3>
                <p className="text-sm text-muted-foreground">
                  Questa è una demo interattiva. Prova a chiedere informazioni sul menu, fare una prenotazione o porre domande sul ristorante.
                </p>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="rounded-lg border bg-card shadow-lg">
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b bg-muted/30 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">RistoAI Assistant</h3>
                <p className="text-xs text-muted-foreground">Sempre online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[500px] space-y-4 overflow-y-auto p-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Streamdown className="prose prose-sm max-w-none dark:prose-invert">
                        {msg.content}
                      </Streamdown>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {sendMessageMutation.isPending && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg bg-muted px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary delay-100" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t bg-muted/30 p-4">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Scrivi un messaggio..."
                  className="flex-1"
                  disabled={sendMessageMutation.isPending}
                />
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Premi Invio per inviare • Shift+Invio per andare a capo
              </p>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-muted-foreground">Prova a chiedere:</p>
            <div className="flex flex-wrap gap-2">
              <SuggestionChip
                text="Quali piatti avete?"
                onClick={() => setMessage("Quali piatti avete nel menu?")}
              />
              <SuggestionChip
                text="Vorrei prenotare un tavolo"
                onClick={() => setMessage("Vorrei prenotare un tavolo per 4 persone")}
              />
              <SuggestionChip
                text="Avete piatti vegetariani?"
                onClick={() => setMessage("Avete piatti vegetariani o vegani?")}
              />
              <SuggestionChip
                text="Quali sono gli orari?"
                onClick={() => setMessage("Quali sono gli orari di apertura?")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestionChip({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted"
    >
      {text}
    </button>
  );
}
