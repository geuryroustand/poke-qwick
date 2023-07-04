import {
  $,
  component$,
  useOnDocument,
  useStore,
  useTask$,
} from "@builder.io/qwik";

import type { DocumentHead } from "@builder.io/qwik-city";
import type { SmallPokemon } from "../../../interfaces/small-pokemon";
import { getSmallPokemons } from "~/components/helpers/get-small-pokemons";
import PokemonImage from "~/components/shared/pokemons/pokemon-image";

interface PokemonPageState {
  currentPage: number;
  pokemons: SmallPokemon[];
}

export default component$(() => {
  const pokemonState = useStore<PokemonPageState>({
    currentPage: 0,
    pokemons: [],
  });

  // run only on the client
  useTask$(async ({ track }) => {
    track(() => pokemonState.currentPage);

    const pokemons = await getSmallPokemons(pokemonState.currentPage * 10, 30);
    pokemonState.pokemons = [...pokemonState.pokemons, ...pokemons];
  });

  // useVisibleTask$(async ({ track }) => {
  //   track(() => pokemonState.currentPage);

  //   const pokemons = await getSmallPokemons(pokemonState.currentPage * 10);
  //   pokemonState.pokemons = pokemons;
  // });

  useOnDocument(
    "scroll",
    $((event) => {
      console.log("scroll", event);

      const maxScroll = document.body.scrollHeight;
      const currentScroll = window.scrollY + window.innerHeight;

      console.log("max", maxScroll);
      console.log("curr", currentScroll);

      if (currentScroll + 200 >= maxScroll) pokemonState.currentPage++;
    })
  );

  return (
    <>
      <div class="flex flex-col">
        <span class="my-5 text-5xl">Status</span>
        <span>Current page: {pokemonState.currentPage}</span>
        <span> Is loading: </span>
      </div>

      <div class="mt-10">
        {/* <button
          onClick$={() => pokemonState.currentPage--}
          class="btn btn-primary mr-2"
        >
          Before
        </button> */}
        <button
          onClick$={() => pokemonState.currentPage++}
          class="btn btn-primary mr-2"
        >
          Next
        </button>
      </div>

      <div class="grid sm:grid-cols-2  md:grid-cols-5 xl:grid-cols-7 mt-5">
        {pokemonState.pokemons.map(({ name, id }) => (
          <div key={id} class="m-5 flex flex-col justify-center items-center">
            <PokemonImage id={id} />
            <span class="capitalize">{name}</span>
          </div>
        ))}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "List Client",
};
