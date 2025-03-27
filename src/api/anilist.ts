const API_URL = "https://graphql.anilist.co";

export async function fetchAnimeById(id: number) {
    const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
        }
        description(asHtml: false)
        season
        seasonYear
        genres
        episodes
        coverImage {
          extraLarge
          large
          medium
        }
        nextAiringEpisode {
          airingAt
        }
      }
    }
  `;
  const variables = { id };
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  return json.data.Media;
}

// Optionally, add additional functions such as a search function:
export async function searchAnime(search: string) {
  const query = `
    query ($search: String) {
      Page(perPage: 10) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
          coverImage {
            extraLarge
            large
            medium
          }
          description(asHtml: false)
          nextAiringEpisode {
            airingAt
          }
        }
      }
    }
  `;
  const variables = { search };
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  return json.data.Page.media;
}

