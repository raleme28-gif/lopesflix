import { Movie } from "@/types"
import { StarRating } from "../StarRating";
import "./index.scss";
import { useState } from "react";
import { Modal } from "../Modal";
import { MovieDetails } from "../MovieDetails";

export interface Props {
    movie: Movie
    id: number
    onClick?: () => void
}

export const MovieCard = (props: Props) => {
    const movie = props.movie;
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <li className="movie-card" onClick={props.onClick}>
            <div className="movie-poster">
                <img
                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                    alt={movie.title}
                />
            </div>
            <div className="movie-infos">
                <p className="title">
                    {movie.title}
                </p>
                {movie.vote_average > 0 &&
                    <StarRating rating={movie.vote_average / 2} />
                }
                <div className="hidden-content">
                    {movie.overview &&
                        <p className="description">
                            {movie.overview.length > 100
                                ? `${movie.overview.substring(0, 100)}...`
                                : movie.overview}
                        </p>
                    }
                    <button className="btn-default" onClick={()=> setIsModalOpen(true)}>
                        Ver mais
                    </button>

                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Detalhes do Filme"
                >
                <MovieDetails movieId={props.id} />
            </Modal>
        </li>
    )
}