import { useAuth } from "@/hooks/useAuth";
import { useIdleTimeout } from "@/hooks/useIdleTimeout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Renders nothing while the user is active; shows a warning modal at 28 min.
 * If the user does not respond by 30 min, signs them out automatically.
 */
export function IdleTimeoutGuard() {
  const { user } = useAuth();
  const enabled = Boolean(user);
  const { showWarning, stayLoggedIn, performLogout } = useIdleTimeout({ enabled });

  if (!enabled) return null;

  return (
    <AlertDialog open={showWarning} onOpenChange={(open) => { if (!open) stayLoggedIn(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Seguís ahí?</AlertDialogTitle>
          <AlertDialogDescription>
            Por tu seguridad, vamos a cerrar tu sesión en 2 minutos por inactividad.
            Si seguís trabajando, presioná "Sigo aquí".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={performLogout}>Cerrar sesión</AlertDialogCancel>
          <AlertDialogAction onClick={stayLoggedIn}>Sigo aquí</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
