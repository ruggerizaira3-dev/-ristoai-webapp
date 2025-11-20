import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Bot, Calendar, ChartBar, MessageCircle, Sparkles, Utensils } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10 rounded-lg" />
            <h1 className="text-2xl font-bold text-primary">{APP_TITLE}</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">Ciao, {user?.name}</span>
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>Accedi</a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <section className="bg-gradient-to-br from-background via-background to-accent/10 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Intelligenza Artificiale per il Tuo Ristorante</span>
            </div>
            
            <h2 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
              L'Agente Intelligente per il{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Marketing dei Ristoranti
              </span>
            </h2>
            
            <p className="mb-8 text-xl text-muted-foreground">
              Automatizza, fidelizza, conquista nuovi clienti. Con RistoAI ogni ristorante può avere un assistente marketing 24/7.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="w-full sm:w-auto">
                {isAuthenticated ? (
                  <Link href="/dashboard">Vai alla Dashboard</Link>
                ) : (
                  <a href={getLoginUrl()}>Inizia Gratis</a>
                )}
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/demo">Prova la Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-bold">Funzionalità Principali</h3>
            <p className="text-lg text-muted-foreground">
              Una suite completa di strumenti intelligenti per il tuo ristorante
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Bot className="h-8 w-8 text-primary" />}
              title="Chatbot Intelligente"
              description="Rispondi automaticamente ai clienti 24/7 con un assistente IA che conosce il tuo menu e gestisce le prenotazioni."
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-primary" />}
              title="Gestione Prenotazioni"
              description="Sistema automatico per raccogliere e organizzare le prenotazioni direttamente dal chatbot."
            />
            <FeatureCard
              icon={<Utensils className="h-8 w-8 text-primary" />}
              title="Menu Digitale"
              description="Gestisci il tuo menu online con descrizioni, prezzi e immagini. Aggiornamenti in tempo reale."
            />
            <FeatureCard
              icon={<MessageCircle className="h-8 w-8 text-primary" />}
              title="Conversazioni Salvate"
              description="Storico completo di tutte le conversazioni con i clienti per analisi e follow-up."
            />
            <FeatureCard
              icon={<ChartBar className="h-8 w-8 text-primary" />}
              title="Analytics Avanzate"
              description="Dashboard con metriche in tempo reale: prenotazioni, conversazioni, performance del menu."
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-primary" />}
              title="Marketing Automatico"
              description="Suggerimenti personalizzati e campagne automatiche basate sui dati dei clienti."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="mb-4 text-3xl font-bold">Perché Scegliere RistoAI?</h3>
            <p className="mb-12 text-lg text-muted-foreground">
              Risultati misurabili per il tuo ristorante
            </p>
            
            <div className="grid gap-8 md:grid-cols-3">
              <BenefitCard
                value="+40%"
                label="Tempo Risparmiato"
                description="nella gestione marketing"
              />
              <BenefitCard
                value="+25%"
                label="Prenotazioni"
                description="aumento online"
              />
              <BenefitCard
                value="+30%"
                label="Engagement"
                description="sui social media"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-12 text-center">
            <h3 className="mb-4 text-3xl font-bold">Pronto a Trasformare il Tuo Ristorante?</h3>
            <p className="mb-8 text-lg text-muted-foreground">
              Inizia oggi con RistoAI e porta il tuo marketing al livello successivo
            </p>
            <Button size="lg" asChild>
              {isAuthenticated ? (
                <Link href="/dashboard">Vai alla Dashboard</Link>
              ) : (
                <a href={getLoginUrl()}>Inizia Gratis</a>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 {APP_TITLE}. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg">
      <div className="mb-4">{icon}</div>
      <h4 className="mb-2 text-xl font-bold">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function BenefitCard({ value, label, description }: { value: string; label: string; description: string }) {
  return (
    <div className="rounded-lg bg-card p-6">
      <div className="mb-2 text-4xl font-bold text-primary">{value}</div>
      <div className="mb-1 text-lg font-semibold">{label}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
}
