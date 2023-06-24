export default function PokeCard({
  currentPokemon,
}: {
  currentPokemon: string;
}) {
  return (
    <div>
      <img src={`/pokemon/${currentPokemon}.png`}></img>
      <h1 style={{ textTransform: "capitalize", marginTop: 0 }}>
        {currentPokemon}
      </h1>
      <p>(tap Pokemon to trade)</p>
    </div>
  );
}
