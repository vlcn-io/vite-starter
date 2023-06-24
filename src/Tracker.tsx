import { CtxAsync, useQuery } from "@vlcn.io/react";

export default function Help({ ctx }: { ctx: CtxAsync }) {
  const whoHasWhat = useQuery<{ name: string; poke: string }>(
    ctx,
    /*sql*/ `SELECT max(seq) as seq, "name", "poke" FROM poke_log JOIN "player" ON "player"."id" = "owner_id" GROUP BY "owner_id"`,
    []
  ).data;
  return (
    <div>
      <h1>Who (probably) has what?</h1>
      <table>
        <thead>
          <tr>
            <td>Player</td>
            <td>Pokemon</td>
          </tr>
        </thead>
        <tbody>
          {whoHasWhat.map((row) => {
            return (
              <tr key={row.name + row.poke}>
                <td>{row.name}</td>
                <td>
                  <div>
                    <img src={`/pokemon/${row.poke}.png`} width={150}></img>
                  </div>
                  {row.poke}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
