import { CtxAsync, useQuery } from "@vlcn.io/react";

export default function Leaderboard({ ctx }: { ctx: CtxAsync }) {
  const leaders = useQuery<{
    name: string;
    rank: number;
    trades: number;
    owner_id: string;
  }>(
    ctx,
    /*sql*/ `SELECT "name", owner_id, (ROW_NUMBER() OVER()) as rank, trades FROM 
    (SELECT count(DISTINCT poke) - 1 as trades, owner_id FROM poke_log GROUP BY owner_id ORDER BY trades DESC) JOIN player ON player.id = owner_id`
  ).data;
  return (
    <div>
      <h1>Eventually Consistent Leaderboard!</h1>
      <div>
        <table>
          <thead>
            <tr>
              <td>Rank</td>
              <td>Player</td>
              <td>Unique Trades</td>
            </tr>
          </thead>
          <tbody>
            {leaders.map((row) => {
              return (
                <tr key={row.owner_id}>
                  <td>{row.rank}</td>
                  <td>{row.name}</td>
                  <td>{row.trades}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
