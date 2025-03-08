import { FC } from "react";
import "./ParticipantCard.css";
import {Icon24Cancel} from "@telegram-apps/telegram-ui/dist/icons/24/cancel";

type ParticipantCardProps = {
  name: string;
  photoUrl: string;
  onDelete?: () => void;
};

export const ParticipantCard: FC<ParticipantCardProps> = ({ name, photoUrl, onDelete }) => {
    return (
      <div className="participant-card-wrapper">
        <div className="participant-card">
          <div className="participant-photo">
            <img src={photoUrl} alt={name} />
          </div>
          <div className="participant-name">{name}</div>
            {onDelete ? <Icon24Cancel onClick={onDelete}/> : <></> }
        </div>
      </div>
    );
};