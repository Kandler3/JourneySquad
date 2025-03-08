import { FC } from "react";
import { ParticipantCard } from "@/components/ParticipantCard/ParticipantCard.tsx";
import { Participant } from "@/types/Participant";
import "./ParticipantList.css";

interface ParticipantListProps {
    participants: Participant[];
}

export const ParticipantList: FC<ParticipantListProps> = ({ participants }) => {
    return (
        <div className= "list">
            {participants.map((participant) => (
                <ParticipantCard
                    key={participant.id}
                    name={participant.name}
                    photoUrl={participant.photoUrl}
                />
            ))}
        </div>
    );
};