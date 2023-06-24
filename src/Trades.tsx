import { CtxAsync, useQuery } from "@vlcn.io/react";

export default function Trades({ ctx }: { ctx: CtxAsync }) {
  const trades = useQuery<{ seq: number; poke: string; direction: number }>(
    ctx,
    /*sql*/ `SELECT "seq", "poke", "direction" FROM "poke_log" WHERE "owner_id" = ? ORDER BY "seq" DESC`,
    [ctx.db.siteid]
  ).data;
  return (
    <div>
      <h1>My Trades</h1>
      <table>
        <thead>
          <tr>
            <td>Event</td>
            <td>Type</td>
            <td>Pokemon</td>
          </tr>
        </thead>
        <tbody>
          {trades.map((t) => {
            return (
              <tr key={t.seq}>
                <td>{t.seq || 0}</td>
                <td>{t.direction == 0 ? "Send" : "Receive"}</td>
                <td>
                  <img src={`/pokemon/${t.poke}.png`} width={100} />
                  <br />
                  {t.poke}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
