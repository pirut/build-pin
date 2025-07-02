import React from 'react';
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { type Id } from "../../../convex/_generated/dataModel";

interface PinProps {
  pinId: Id<"pins">;
  number: number;
  onClick: (pinId: Id<"pins">) => void;
}

const Pin: React.FC<PinProps> = ({ pinId, number, onClick }) => {
  const pin = useQuery(api.projects.getPin, { pinId });
  const status = useQuery(api.projects.listStatuses, pin?.status ? { type: "pin" } : "skip");

  const pinStatus = status?.find(s => s._id === pin?.status);

  return (
    <Button
      onClick={() => onClick(pinId)}
      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold cursor-pointer p-0"
      style={{ backgroundColor: pinStatus?.color ?? 'gray' }}
    >
      {number}
    </Button>
  );
};

export default Pin;
