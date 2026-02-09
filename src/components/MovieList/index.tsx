'use client';

import { useEffect, useState } from "react";
import "./index.scss";
import axios from "axios";
import { MovieCard } from "../MovieCard";
import { Movie } from "@/types"


export const MovieList = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    

    useEffect(() => {
        getMovies();
    }, []);

    const getMovies = async () => {
        await axios({

            method: 'get',
            url: 'https://api.themoviedb.org/3/discover/movie',
            params: {
                api_key: 'cce6a42078045dcc6e9de37dd0a1a55f',
                language: 'pt-BR'
            }
        }).then(response => {
            setMovies(response.data.results);
        });

        setIsLoading(false);
    }

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spin-load"></div>
            </div>
        )
    }

    return (
        <ul className="movie-list">
            {movies.map((movie) => (
                <MovieCard
                    key={movie.id}
                    id={movie.id}
                    movie={movie}
                />
            ))}
        </ul>
    )
}