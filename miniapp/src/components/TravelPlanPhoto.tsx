import {FC} from "react";

import { TravelPlanPhoto } from "@/models/types.ts";

type TravelPlanPhotoProps = {
    photo : TravelPlanPhoto;
}

export const TravelPlanPhotoComp : FC<TravelPlanPhotoProps> = ({ photo }: { photo: TravelPlanPhoto }) => {
    return <img src={photo.url} alt="Travel plan photo" />;
}
