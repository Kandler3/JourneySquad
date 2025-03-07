import { FC, useState } from "react";
import "./PhotoCarousel.css";

interface PhotoCarouselProps {
    photos: string[];
}

export const PhotoCarousel: FC<PhotoCarouselProps> = ({ photos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextPhoto = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    const prevPhoto = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    };

    return (
        <div className="carousel">
            <img src={photos[currentIndex]} alt="Travel" className="image" />

            <div className="pagination">
                {photos.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? "active" : ""}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>

            <div className="navArea" onClick={prevPhoto}></div>
            <div className="navArea right" onClick={nextPhoto}></div>
        </div>
    );
};
