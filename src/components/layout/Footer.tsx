import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-card py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 PSI — Plataforma Sistemática Interactiva
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Creado y desarrollado por el Lic. Esp. German Nieves
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Para más información:{" "}
          <a
            href="https://www.psicodiagnostico-forense.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            www.psicodiagnostico-forense.com.ar
          </a>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          <Link to="/privacy-policy" className="text-primary hover:underline">
            Aviso Legal, Términos y Privacidad
          </Link>
        </p>
        <p className="text-xs text-muted-foreground mt-3 italic">
          Esta plataforma acompaña la práctica profesional, no la sustituye.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
