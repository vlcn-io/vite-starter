/**
 * Note: modifying the schema currently requires:
 * 1. Restarting the server
 * 2. Refreshing the browser
 *
 * Other than that, DB migrations are automatically handled.
 */
export default {
  namespace: "default",
  name: "main",
  active: true,
  content: /*sql*/ `
    CREATE TABLE IF NOT EXISTS poke_log (
      id PRIMARY KEY,
      seq INTEGER,
      tradeid TEXT,
      "owner_id" TEXT,
      "poke" TEXT,
      "direction" INTEGER
    );

    CREATE INDEX IF NOT EXISTS poke_log_owner ON poke_log ("owner_id");
    CREATE INDEX IF NOT EXISTS poke_log_trade ON poke_log ("tradeid");
    CREATE INDEX IF NOT EXISTS poke_poke ON poke_log ("poke");

    CREATE TABLE IF NOT EXISTS mission (
      "player_id" PRIMARY KEY,
      "poke" TEXT
    );

    CREATE TABLE IF NOT EXISTS player (
      "id" TEXT PRIMARY KEY,
      "name" TEXT
    );

    SELECT crsql_as_crr('poke_log');
    SELECT crsql_as_crr('mission');
    SELECT crsql_as_crr('player');
  `,
};

/**
 * Can find:
 * - leader board
 *    select max(seq) as score, owner, item from log group by owner order by score desc;
 * - user's log of pokemon transfers
 *    select poke from log where owner = ? order by seq asc;
 * - currently released pokemon
 *    select distinct poke from log;
 * - usernames to current pokemon
 *
 * Who traded with who... Generate a tradeid on every trade.
 * Grouping on tradeid and aggregating name would give the users in the trade.
 * select json_group_array(owner), json_grop_array(poke) from log group by tradeid;
 *
 *
 * "Eventually consistent leaderboard!"
 * Status of server (online or off)
 *
 * "Eventually consistent mission list!"
 *
 * How can I implement a server side `update_time` column on mission?
 * Create it an never write it from client..
 *
 * But if I am to write it from the server.. how can I hook in to do that?
 * Need a server schema for triggers or defined mutations I can have code
 * to process on the server...
 *
 * Need server authoritative data like `player` table that registers player names.
 * Mission assignments too...
 *
 * So "server mirrored tables" fo sho. Maybe with optimistsic client caching.
 * Maybe even columns like this?
 *
 *
 * Perm rules can impl server authoritative too
 *
 * REST endpoint to issue a sever write rather than issue on client then sync (for server authoritative stuff)
 *
 * All the flickers.. fml.
 * Vanilla fetch style where we pre-fetch the graph. Doable with
 * Drizzle relation queries.
 */
