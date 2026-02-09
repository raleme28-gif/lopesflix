import "./index.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { MovieDetailsType } from "@/types";
import { FaPlay } from "react-icons/fa";
import { StreamSelector } from "../StreamSelector";
import dynamic from 'next/dynamic';

interface MovieDetailsProps {
    movieId: number
}

export const MovieDetails = (props: MovieDetailsProps) => {
    const [details, setDetails] = useState<MovieDetailsType | null>(null);
    const [trailer, setTrailer] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [streams, setStreams] = useState<any[]>([]);
    const [selectedStream, setSelectedStream] = useState<any>(null);



    const MoviePlayer = dynamic(() => import('@/components/MoviePlayer').then(mod => mod.default), {
        ssr: false,
    });

    useEffect(() => {
        getMovieDetails();
        getMovieTrailer();
    }, []);

    const getMovieDetails = async () => {
        await axios({
            method: 'get',
            url: `https://api.themoviedb.org/3/movie/${props.movieId}`,
            params: {
                api_key: 'cce6a42078045dcc6e9de37dd0a1a55f',
                language: 'pt-BR',
            }
        }).then(response => {
            setDetails(response.data);
        });
    }

    const getMovieTrailer = async () => {
        await axios({
            method: 'get',
            url: `https://api.themoviedb.org/3/movie/${props.movieId}/videos`,
            params: {
                api_key: 'cce6a42078045dcc6e9de37dd0a1a55f',
            }
        }).then(response => {
            const trailers = response.data.results.filter((video: any) => video.type === 'Trailer' && video.site === 'YouTube');
            if (trailers.length > 0) {
                setTrailer(`https://www.youtube.com/embed/${trailers[0].key}`);
            }
        });
    }

    const getRealDebridStreams = async (imdbId: string, type = 'movie') => {
        try {
            const response = await fetch('/api/real-debrid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imdbId, type })
            });
            const data = await response.json();
            console.log(data);
            setStreams(data.streams || []);
        } catch (error) {
            console.error("Erro ao buscar streams:", error);
            return [];
        }
    };

    const onSelect = (stream: any) => {
        setSelectedStream(stream.url);
        console.log("Stream selecionada:", stream.url);
    }

    return (
        details && (
            <div className="movie-details">
                {trailer && (
                    <iframe
                        width="560"
                        height="315"
                        src={trailer}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                )}
                <h2 className="title">{details.title}</h2>
                <button
                    className="btn-default"
                    onClick={() => {
                        getRealDebridStreams(details.imdb_id)
                        setIsOpen(true);
                    }}>
                    <FaPlay />
                    Assistir
                </button>
                <p className="description">{details.overview}</p>
                <p className="genres">
                    {details.genres && details.genres.map((genre: any) => (
                        <span className="genre" key={genre.id}>{genre.name}</span>
                    ))}
                </p>
                <p>IMDB ID: {details.imdb_id}</p>
                {streams.length > 0 && (
                    <StreamSelector
                        isOpen={isOpen}
                        streams={streams}
                        setIsOpen={setIsOpen}
                        onSelect={onSelect}>
                    </StreamSelector>
                )}

                {selectedStream && (
                    <MoviePlayer url={selectedStream} />
                )}


            </div>
        )
    )
}