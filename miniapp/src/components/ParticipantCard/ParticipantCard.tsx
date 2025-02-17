import { FC } from "react";
import "./ParticipantCard.css"; // Подключаем стили

type ParticipantCardProps = {
  name: string; // Имя участника
  photoUrl: string; // Ссылка на фото участника
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