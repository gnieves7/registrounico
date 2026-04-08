import React from "react";
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="flex flex-col items-center text-center max-w-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">Algo salió mal</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Se produjo un error inesperado. Por favor, intentá recargar la página o volver al inicio.
            </p>
            {this.state.error && (
              <pre className="text-[10px] text-muted-foreground bg-muted rounded-lg p-3 mb-4 max-w-full overflow-auto text-left">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Recargar página
              </Button>
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = "/";
                }}
                className="gap-2"
              >
                <Home className="h-4 w-4" /> Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
