import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card py-8 mt-auto">
      <div className="mx-auto max-w-[1100px] px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Brand */}
          <div>
            <p className="text-sm font-bold text-foreground">.PSI.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Plataforma de Sistemas Interactivos
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Dinámica de la Salud Mental — Sistemas Integrados Especializados
            </p>
          </div>

          {/* Professional info */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">Profesional</p>
            <p className="text-xs text-muted-foreground">Lic. Esp. Germán Nieves</p>
            <p className="text-xs text-muted-foreground">Mat. N° 1889 — Colegio de Psicólogos de Santa Fe</p>
            <a
              href="https://www.psicodiagnostico-forense.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-1 inline-block"
            >
              www.psicodiagnostico-forense.com.ar
            </a>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">Enlaces</p>
            <div className="flex flex-col gap-1">
              <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Aviso Legal, Términos y Privacidad
              </Link>
              <Link to="/professional-profile" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Perfil Profesional
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {year} .PSI. — Plataforma de Sistemas Interactivos. Creado y desarrollado por el Lic. Esp. Germán Nieves.
          </p>
          <p className="text-[10px] text-muted-foreground mt-2 italic">
            Esta plataforma acompaña la práctica profesional, no la sustituye.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
