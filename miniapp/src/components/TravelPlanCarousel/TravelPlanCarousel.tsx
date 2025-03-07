import { FC, useState } from "react";
import { TravelPlanCard } from "@/components/TravelPlanCard/TravelPlanCard";
import { TravelPlan } from "@/models/TravelPlan.ts";
import "./TravelPlanCarousel.css"; 

interface TravelPlansCarouselProps {
    travelPlans: TravelPlan[];
}

export const TravelPlansCarousel: FC<TravelPlansCarouselProps> = ({ travelPlans }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextPlan = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % travelPlans.length);
    };

    const prevPlan = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + travelPlans.length) % travelPlans.length);
    };

    return (
        <div className="carousel">
            <div className="cardsContainer">
                {travelPlans.map((plan, index) => (
                    <div
                        key={plan.id}
                        className={`cardWrapper ${index === currentIndex ? "active" : ""}`}
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        <TravelPlanCard travelPlan={plan} style="horizontal" />
                    </div>
                ))}
            </div>

            <div className="pagination">
                {travelPlans.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? "active" : ""}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
            <div className="navArea" onClick={prevPlan}></div>
            <div className="navArea right" onClick={nextPlan}></div>
        </div>
    );
};