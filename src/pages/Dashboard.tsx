import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Footer from "@/components/layout/Footer";
import { 
  Calendar, 
  Heart, 
  FileText, 
  MessageCircle, 
  User, 
  LogOut,
  Settings,
  Smile
} from "lucide-react";

const Dashboard = () => {
  const { user, profile, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>
    );
  }

  if (!user) return null;

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const patientMenuItems = [
    {
      title: "Mi Psicobiografía",
      description: "Completa tu historia personal",
      icon: User,
      href: "/psychobiography",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Registro Emocional",
      description: "¿Cómo te sientes hoy?",
      icon: Smile,
      href: "/emotional-record",
      color: "bg-accent text-accent-foreground",
    },
    {
      title: "Mis Sesiones",
      description: "Calendario y notas de sesiones",
      icon: Calendar,
      href: "/sessions",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      title: "Laura",
      description: "Tu acompañante terapéutica",
      icon: MessageCircle,
      href: "/laura",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Documentos",
      description: "Constancias e informes",
      icon: FileText,
      href: "/documents",
      color: "bg-accent text-accent-foreground",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-serif text-lg font-semibold text-foreground">
              Registro Clínico
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  Panel Admin
                </Link>
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-foreground md:block">
                {profile?.full_name || "Usuario"}
              </span>
            </div>
            
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="container mx-auto max-w-4xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              Hola, {profile?.full_name?.split(" ")[0] || "bienvenido"}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Este es tu espacio de reflexión y acompañamiento terapéutico
            </p>
          </div>

          {/* Quick Emotional Check */}
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-card to-accent/10">
            <CardContent className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
              <div className="text-center md:text-left">
                <h2 className="font-medium text-foreground">¿Cómo te sientes hoy?</h2>
                <p className="text-sm text-muted-foreground">
                  Registra tu estado emocional diario
                </p>
              </div>
              <Button asChild>
                <Link to="/emotional-record">
                  <Smile className="mr-2 h-4 w-4" />
                  Registrar mi estado
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Menu Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {patientMenuItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
                  <CardHeader className="pb-2">
                    <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          {/* Ethical Notice */}
          <div className="mt-8 rounded-lg bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground italic">
              Esta plataforma acompaña tu proceso terapéutico pero no sustituye la atención profesional.
              Ante cualquier urgencia, contacta directamente a tu terapeuta.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
