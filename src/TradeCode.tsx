import { useLayoutEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { CtxAsync } from "@vlcn.io/react";
import nanoid from "./support/nanoid";

export default function TradeCode({
  ctx,
  poke,
  to,
}: {
  ctx: CtxAsync;
  poke: string;
  to?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLCanvasElement | null>(null);
  useLayoutEffect(() => {
    QRCode.toCanvas(
      ref.current,
      "https://" +
        window.location.hostname +
        "/receive?poke=" +
        poke +
        (to != null ? "&to=" + to : "&from=" + ctx.db.siteid) +
        "&nonce=" +
        nanoid(),
      function (error: any) {
        if (error) {
          setError(error);
        } else {
          setError(null);
        }
      }
    );
  }, [poke, ctx.db.siteid]);
  return (
    <div style={{ marginTop: 40 }}>
      {error ? error : null}
      <canvas ref={ref} style={{ zoom: 1.2 }} />
    </div>
  );
}
