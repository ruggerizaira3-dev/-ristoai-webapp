import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Bot, Calendar, MessageCircle, Utensils, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = trpc.analytics.getDashboardStats.useQuery();
  const { data: restaurant } = trpc.restaurant.get.useQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-muted-foreground">Caricamento...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Check if restaurant is set up
  if (!restaurant) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Benvenuto in RistoAI! 👋</CardTitle>
              <CardDescription>
                Per iniziare, configura il tuo ristorante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/setup">Configura Ristorante</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Benvenuto, {user?.name}! Ecco una panoramica del tuo ristorante.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Calendar className="h-5 w-5" />}
            title="Prenotazioni"
            value={stats?.bookings.total || 0}
            subtitle={`${stats?.bookings.pending || 0} in attesa`}
            trend="+12%"
            iconColor="text-blue-500"
            bgColor="bg-blue-500/10"
          />
          
          <StatCard
            icon={<MessageCircle className="h-5 w-5" />}
            title="Conversazioni"
            value={stats?.conversations.total || 0}
            subtitle={`${stats?.conversations.active || 0} attive`}
            trend="+8%"
            iconColor="text-green-500"
            bgColor="bg-green-500/10"
          />
          
          <StatCard
            icon={<Utensils className="h-5 w-5" />}
            title="Piatti nel Menu"
            value={stats?.menu.total || 0}
            subtitle={`${stats?.menu.available || 0} disponibili`}
            iconColor="text-orange-500"
            bgColor="bg-orange-500/10"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-4 text-xl font-bold">Azioni Rapide</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              icon={<Calendar className="h-6 w-6" />}
              title="Prenotazioni"
              description="Gestisci le prenotazioni"
              href="/bookings"
            />
            <QuickActionCard
              icon={<Utensils className="h-6 w-6" />}
              title="Menu"
              description="Modifica il tuo menu"
              href="/menu"
            />
            <QuickActionCard
              icon={<MessageCircle className="h-6 w-6" />}
              title="Conversazioni"
              description="Vedi le chat"
              href="/conversations"
            />
            <QuickActionCard
              icon={<Bot className="h-6 w-6" />}
              title="Prova Chatbot"
              description="Testa l'assistente"
              href="/demo"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Attività Recente</CardTitle>
            <CardDescription>
              Le ultime interazioni con i clienti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                icon={<Calendar className="h-4 w-4" />}
                title="Nuova prenotazione"
                description="Mario Rossi ha prenotato per 4 persone"
                time="2 ore fa"
              />
              <ActivityItem
                icon={<MessageCircle className="h-4 w-4" />}
                title="Nuova conversazione"
                description="Cliente ha chiesto informazioni sul menu"
                time="5 ore fa"
              />
              <ActivityItem
                icon={<Users className="h-4 w-4" />}
                title="Prenotazione confermata"
                description="Tavolo per 2 persone confermato"
                time="1 giorno fa"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  trend,
  iconColor,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle: string;
  trend?: string;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={`rounded-lg p-3 ${bgColor}`}>
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span>{trend} vs mese scorso</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105">
        <CardContent className="p-6">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <h3 className="mb-1 font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  );
}
