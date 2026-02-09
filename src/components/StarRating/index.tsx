import "./index.scss";
export interface Props {
    rating: number;
}
export const StarRating = (props: Props) => {
    const numStars = Math.round(props.rating * 100) / 100

    const fullStars = [];
    const emptyStars = [];

    for (let i = 0; i < 5; i++) {
        if (i < numStars) {
            fullStars.push(i);
        } else {
            emptyStars.push(i);
        }
    }
    return (
        <div className="star-rating">
            {fullStars.map(i => (
                <span key={i} className="full-star">★</span>
            ))}
            {emptyStars.map(i => (
                <span key={i} className="empty-star">☆</span>
            ))}
        </div>
    );
}