import { X, Minus, Maximize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose?: () => void;
  onMaximize?: () => void;
}

export function TrafficLights({ onClose, onMaximize }: Props) {
  const navigate = useNavigate();
  const handleClose = () => {
    if (onClose) return onClose();
    navigate("/dashboard");
  };
  return (
    <div className="mac-traffic-group flex items-center gap-2">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={handleClose}
        className="mac-traffic mac-traffic-close"
      >
        <X strokeWidth={3} />
      </button>
      <button type="button" aria-label="Minimizar" className="mac-traffic mac-traffic-min" onClick={() => navigate(-1)}>
        <Minus strokeWidth={3} />
      </button>
      <button type="button" aria-label="Maximizar" className="mac-traffic mac-traffic-max" onClick={onMaximize}>
        <Maximize2 strokeWidth={3} />
      </button>
    </div>
  );
}