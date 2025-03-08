import { FC } from "react";
import "./ParticipantCard.css"; 

type ParticipantCardProps = {
  name: string; 
  photoUrl: string;
};

export const ParticipantCard: FC<ParticipantCardProps> = ({ name, photoUrl }) => {
    return (
      <div className="participant-card-wrapper">
        <div className="participant-card">
          <div className="participant-photo">
            <img src={photoUrl} alt={name} />
          </div>
          <div className="participant-name">{name}</div>
        </div>
      </div>
    );
};