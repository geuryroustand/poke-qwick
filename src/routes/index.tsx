import { $, component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, useNavigate } from "@builder.io/qwik-city";
import PokemonImage from "~/components/shared/pokemons/pokemon-image";

export default component$(() => {
  const nav = useNavigate();

  const pokemonId = useSignal<number>(1);
  const showBackImage = useSignal(false);
  const isVisible = useSignal(false);

  const changePokemonId = $((value: number) => {
    console.log("pokemonId", pokemonId.value);
    console.log("value", value);
    console.log("mas", pokemonId.value + value);
    if (pokemonId.value + value <= 0) return;

    pokemonId.value += value;
  });

  const goToPokemon = $(() => {
    nav(`/pokemon/${pokemonId.value}`);
  });

  return (
    <>
      <span class="text-2xl">Buscador simple</span>

      <span class="text-9xl">{pokemonId}</span>

      {/* <Link href={`/pokemon/${pokemonId.value}`}></Link> */}

      <div onClick$={goToPokemon}>
        <PokemonImage
          id={pokemonId.value}
          backImage={showBackImage.value}
          isVisible={isVisible.value}
        />
      </div>
      <div class="mt-2">
        <button
          onClick$={() => changePokemonId(-1)}
          class="btn btn-primary mr-2"
        >
          before
        </button>
        <button
          onClick$={() => changePokemonId(+1)}
          class="btn btn-primary mr-2"
        >
          next
        </button>
        <button
          onClick$={() => (showBackImage.value = !showBackImage.value)}
          class="btn btn-primary mr-2"
        >
          turn
        </button>

        <button
          onClick$={() => (isVisible.value = !isVisible.value)}
          class="btn btn-primary mr-2"
        >
          Reveal
        </button>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
