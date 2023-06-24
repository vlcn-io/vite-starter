import { CtxAsync } from "@vlcn.io/react";
import PokeCard from "./PokeCard";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Leaderboard from "./Leaderboard";
import Trades from "./Trades";
import Help from "./Help";
import Nav from "./Nav";

export default function PokeDash({
  ctx,
  currentPokemon,
}: {
  ctx: CtxAsync;
  currentPokemon: string;
}) {
  return (
    <BrowserRouter>
      <Nav ctx={ctx} />
      <Routes>
        <Route
          path="/"
          element={<PokeCard currentPokemon={currentPokemon} />}
        />
        <Route path="/leaderboard" element={<Leaderboard ctx={ctx} />} />
        <Route path="/trades" element={<Trades ctx={ctx} />} />
        <Route path="/help" element={<Help ctx={ctx} />} />
      </Routes>
    </BrowserRouter>
  );
}
