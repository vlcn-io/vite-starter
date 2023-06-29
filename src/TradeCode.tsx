import { useLayoutEffect, useRef, useState } from "react";
// @ts-ignore
import QRCode from "qrcode";

export default function TradeCode({ poke }: { poke: string }) {
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLCanvasElement | null>(null);
  useLayoutEffect(() => {
    QRCode.toCanvas(
      ref.current,
      "https://" + window.location.hostname + "/receive?poke=" + poke,
      function (error: any) {
        if (error) {
          setError(error);
        } else {
          setError(null);
        }
      }
    );
  }, []);
  return (
    <div style={{ marginTop: 40 }}>
      {error ? error : null}
      <canvas ref={ref} style={{ zoom: 1.2 }} />
    </div>
  );
}
