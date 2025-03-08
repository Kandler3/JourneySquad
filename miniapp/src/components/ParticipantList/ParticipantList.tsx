import React from "react";
import { ParticipantCard } from "@/components/ParticipantCard/ParticipantCard";
import { ContentSection } from "@/components/ContentSection/ContentSection";
import "./ParticipantList.css"; 

interface Participant {
    id: number;
    name: string;
    photoUrl: string;
}

interface ParticipantsListProps {
    participants: Participant[];
    onParticipantClick: (participantId: number) => void;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants, onParticipantClick }) => {
    return (
        <div className="headerContainer">
            <h2 className="participantsTitle">Участники</h2>
            <ContentSection>
                {participants.map((participant) => (
                    <div
                        key={participant.id}
                        onClick={() => onParticipantClick(participant.id)}
                        style={{ cursor: "pointer", width: "100%" }}
                    >
                        <ParticipantCard
                            name={participant.name}
                            photoUrl={participant.photoUrl}
                        />
                    </div>
                ))}
            </ContentSection>
        </div>
    );
};