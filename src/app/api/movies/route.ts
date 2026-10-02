import { NextRequest, NextResponse } from "next/server";
import { MOCK_MOVIES } from "@/data/mockData";
import { Movie } from "@/types/content";

interface TmdbApiMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
}

const TMDB_GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "popular"; // popular, trending, search
  const query = searchParams.get("q") || "";

  const apiKey = process.env.TMDB_API_KEY;

  if (apiKey && apiKey !== "your_tmdb_api_key_here") {
    try {
      let tmdbUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
      if (type === "trending") {
        tmdbUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
      } else if (type === "search" && query) {
        tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
      }

      const response = await fetch(tmdbUrl, {
        next: { revalidate: 3600 }, // Cache 1 hr
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.results) && data.results.length > 0) {
          const movies: Movie[] = data.results.map((m: TmdbApiMovie) => ({
            id: m.id,
            title: m.title,
            overview: m.overview || "No overview available.",
            posterPath: m.poster_path
              ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
              : null,
            backdropPath: m.backdrop_path
              ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}`
              : null,
            rating: m.vote_average || 0,
            voteCount: m.vote_count || 0,
            releaseDate: m.release_date || "Unknown",
            genres: (m.genre_ids || [])
              .map((id: number) => TMDB_GENRE_MAP[id])
              .filter(Boolean),
            category: "entertainment",
          }));

          return NextResponse.json({
            movies,
            totalResults: data.total_results || movies.length,
            isFallback: false,
          });
        }
      }
    } catch {
      // Fallback gracefully on network error
    }
  }

  // Realistic mock fallback
  let filtered = [...MOCK_MOVIES];
  if (query) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(qLower) ||
        m.overview.toLowerCase().includes(qLower) ||
        m.genres.some((g) => g.toLowerCase().includes(qLower))
    );
  }

  return NextResponse.json({
    movies: filtered,
    totalResults: filtered.length,
    isFallback: true,
  });
}
