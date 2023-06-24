import { CtxAsync } from "@vlcn.io/react";
import PokeCard from "./PokeCard";
import Rank from "./Rank";
import UniqueTrades from "./UniqueTrades";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Leaderboard from "./Leaderboard";
import Trades from "./Trades";

export default function PokeDash({
  ctx,
  currentPokemon,
}: {
  ctx: CtxAsync;
  currentPokemon: string;
}) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Root ctx={ctx} currentPokemon={currentPokemon} />}
        />
        <Route path="/leaderboard" element={<Leaderboard ctx={ctx} />} />
        <Route path="/trades" element={<Trades ctx={ctx} />} />
      </Routes>
    </BrowserRouter>
  );
}

function Root({
  ctx,
  currentPokemon,
}: {
  ctx: CtxAsync;
  currentPokemon: string;
}) {
  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <UniqueTrades ctx={ctx} />
        <button style={{ flexGrow: 1 }}>Help ME!</button>
        <Rank ctx={ctx} />
      </header>
      <main>
        <PokeCard currentPokemon={currentPokemon} />
      </main>
    </div>
  );
}
