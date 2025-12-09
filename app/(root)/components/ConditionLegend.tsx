import React from "react";

const ConditionLegend = () => {
  return (
    <div className="w-[18rem] mx-2 bg-white text-black py-4 px-2 flex flex-col gap-3">
      <div className="flex items-center gap-1">
        <div className="bg-sky-500 w-3 h-3 flex items-center rounded-full"></div>
        <p className="text-xs">Never Used</p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-green-500 w-3 h-3 flex items-center rounded-full"></div>
        <p className="text-xs">Barely Used</p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-purple-600 w-3 h-3 flex items-center rounded-full"></div>
        <p className="text-xs">Minor Wear</p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-amber-500 w-3 h-3 flex items-center rounded-full"></div>
        <p className="text-xs">Moderate Wear</p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-red-500 w-3 h-3 flex items-center rounded-full"></div>
        <p className="text-xs">Major Wear</p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-gray-500 w-3 h-3 flex items-center rounded-full"></div>
        <p className="text-xs">Ask Lister</p>
      </div>
    </div>
  );
};

export default ConditionLegend;
