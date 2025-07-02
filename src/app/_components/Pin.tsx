import React from 'react';
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

interface PinProps {
  pinId: string;
  number: number;
  onClick: (pinId: string) => void;
}

const Pin: React.FC<PinProps> = ({ pinId, number, onClick }) => {
  const pin = useQuery(api.projects.getPin, { pinId });
  const status = useQuery(api.projects.getStatus, pin?.status ? { statusId: pin.status } : "skip");

  return (
    <Button
      onClick={() => onClick(pinId)}
      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold cursor-pointer p-0"
      style={{ backgroundColor: status?.color || 'gray' }}
    >
      {number}
    </Button>
  );
};

export default Pin;
