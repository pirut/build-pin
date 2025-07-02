import React from 'react';
import { Button } from "@/components/ui/button";

interface PinProps {
  pinId: string;
  number: number;
  onClick: (pinId: string) => void;
}

const Pin: React.FC<PinProps> = ({ pinId, number, onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer p-0"
    >
      {number}
    </Button>
  );
};

export default Pin;
