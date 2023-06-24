import { CtxAsync } from "@vlcn.io/react";
import { useState } from "react";

export default function Register({ ctx }: { ctx: CtxAsync }) {
  const [name, setName] = useState<string>("");
  function onRegister() {
    return ctx.db.exec(
      /*sql*/ `INSERT OR IGNORE INTO "player" ("id", "name") VALUES (?, ?)`,
      [ctx.db.siteid, name]
    );
  }

  return (
    <div>
      <h1>Poke Pass!</h1>
      <p>
        Welcome{" "}
        <strong>
          <code>{ctx.db.siteid}</code>
        </strong>
        !
      </p>
      <p>Please pick a human friendly name!</p>
      <input
        type="text"
        placeholder="Anonymous Coward"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <button onClick={onRegister}>Submit</button>
    </div>
  );
}
