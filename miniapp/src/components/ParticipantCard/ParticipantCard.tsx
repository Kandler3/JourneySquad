import { FC } from "react";
import "./ParticipantCard.css";
import {Icon24Cancel} from "@telegram-apps/telegram-ui/dist/icons/24/cancel";
import {Text} from "@telegram-apps/telegram-ui"

type ParticipantCardProps = {
  name: string;
  photoUrl: string;
  onDelete?: () => void;
  badge?: string;
};

export const ParticipantCard: FC<ParticipantCardProps> = ({ name, photoUrl, onDelete, badge }) => {
    return (
      <div className="participant-card-wrapper">
        <div className="participant-card">
          <div className="participant-photo">
            <img src={photoUrl} alt={name} />
          </div>
            <Text>{name}</Text>
            {badge && <span className="participant-badge">{badge}</span>}
            {onDelete ? <Icon24Cancel onClick={onDelete}/> : <></> }
        </div>
      </div>
    );
};