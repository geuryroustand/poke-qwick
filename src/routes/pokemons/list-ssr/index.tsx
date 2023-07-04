import { component$, useComputed$ } from "@builder.io/qwik";
import {
  Link,
  type DocumentHead,
  routeLoader$,
  useLocation,
} from "@builder.io/qwik-city";
import { getSmallPokemons } from "~/components/helpers/get-small-pokemons";
import PokemonImage from "~/components/shared/pokemons/pokemon-image";
import type { SmallPokemon } from "~/interfaces";
// import { type PokemonListResponse } from "~/interfaces";

// export const usePokemonList = routeLoader$<BasicPokemonInfo[]>(
//   async ({ query, redirect, pathname }) => {
//     const offset = Number(query.get("offset") || "0");

//     if (offset < 0 || isNaN(offset)) redirect(301, pathname);

//     const res = await fetch(
//       `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`
//     );

//     const data = (await res.json()) as PokemonListResponse;

//     return data.results;
//   }
// );

export const usePokemonList = routeLoader$<SmallPokemon[]>(
  async ({ query, redirect, pathname }) => {
    const offset = Number(query.get("offset") || "0");

    if (offset < 0 || isNaN(offset)) redirect(301, pathname);

    return await getSmallPokemons(offset);
  }
);

export default component$<number>(() => {
  const pokemons = usePokemonList();

  const location = useLocation();

  console.log(location.url.searchParams.get("offset"));

  const currentOffset = useComputed$(() => {
    // const offsetString = location.url.searchParams.get("offset");
    const offsetString = new URLSearchParams(location.url.search).get("offset");

    return Number(offsetString);
  });

  return (
    <>
      <div class="flex flex-col">
        <span class="my-5 text-5xl">Status</span>
        <span>Current page: {currentOffset}</span>
        <span> Is loading: {location.isNavigating ? "Yes" : "No"}</span>
      </div>

      <div class="mt-10">
        <Link
          href={`/pokemons/list-ssr/?offset=${currentOffset.value - 10}`}
          class="btn btn-primary mr-2"
        >
          Before
        </Link>
        <Link
          href={`/pokemons/list-ssr/?offset=${currentOffset.value + 10}`}
          class="btn btn-primary mr-2"
        >
          Next
        </Link>
      </div>

      <div class="grid grid-cols-6 mt-5">
        {pokemons.value.map(({ name, id }) => (
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
  title: "List SSR",
};
