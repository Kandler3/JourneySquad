import {TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";
import {Image, Text} from "@telegram-apps/telegram-ui";
import {Icon24Cancel} from "@telegram-apps/telegram-ui/dist/icons/24/cancel";

import "./PhotoEditCard.css"

type PhotoEditCardProps = {
    photo: TravelPlanPhoto;
    onDeleteClick: (photo: TravelPlanPhoto) => void;
}

export const PhotoEditCard = ({photo, onDeleteClick}: PhotoEditCardProps) => {
    return (
        <div className="photo-edit-card">
            <Image src={photo.url}/>
            <Text>{photo.url.split('/')[-1]}</Text>
            <Icon24Cancel onClick={() => onDeleteClick(photo)} />
        </div>
    )
}