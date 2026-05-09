import { useFetch } from './useFetch'

type Pokemon = {
  name: string
}

type PokemonResponse = {
  results: Pokemon[]
}

const pokemonUrl = `https://pokeapi.co/api/v2/pokemon?${new URLSearchParams({
  limit: '10',
  offset: '0',
})}`

export function PokemonList() {
  const { data, isLoading, error } = useFetch<PokemonResponse>(pokemonUrl)
  const pokemons = data?.results ?? []

  return (
    <div className="demo-surface" data-testid="use-fetch-demo">
      <div className="demo-copy">
        <h3>Pokemon list</h3>
        <p>
          The hook is not implemented yet. Make this list load from the mocked
          network in the Playwright submission test.
        </p>
      </div>

      {isLoading ? <p role="status">Loading ...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {pokemons.length > 0 ? (
        <ol aria-label="Pokemon results">
          {pokemons.map((pokemon) => (
            <li key={pokemon.name}>{pokemon.name}</li>
          ))}
        </ol>
      ) : (
        <p className="empty-state">No Pokemon loaded yet.</p>
      )}
    </div>
  )
}
