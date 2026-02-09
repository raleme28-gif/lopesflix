export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    vote_average: number;
}


export interface MovieDetailsType {
    id: number;
    title: string;
    poster_path: string;
    imdb_id: string;
    overview: string;
    genres: { id: number; name: string }[];
    vote_average: number;
}