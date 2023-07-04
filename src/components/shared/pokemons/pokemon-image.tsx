import {
  component$,
  useComputed$,
  useSignal,
  useTask$,
} from "@builder.io/qwik";

interface Props {
  id: number | string;
  size?: number;
  backImage?: boolean;
  isVisible?: boolean;
}

const PokemonImage = component$(
  ({ id, size = 200, backImage = false, isVisible }: Props) => {
    const imageLoaded = useSignal(false);

    useTask$(({ track }) => {
      track(() => id);
      imageLoaded.value = false;
    });

    const imageURL = useComputed$(() => {
      return !backImage
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`;
    });

    return (
      <div
        style={{ with: `${size}px`, height: `${size}px` }}
        class="flex items-center justify-center"
      >
        {!imageLoaded.value && <span>Loading...</span>}

        <img
          class={[
            { hidden: !imageLoaded.value, "brightness-0": isVisible },
            "transition-all",
          ]}
          src={imageURL.value}
          alt="Pokenmon Sprite"
          width={96}
          height={96}
          style={{ with: `${size}px` }}
          onLoad$={() => (imageLoaded.value = true)}
        />
      </div>
    );
  }
);

export default PokemonImage;
