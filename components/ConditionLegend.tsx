import React from "react";

const ConditionLegend = () => {
  return (
    <div className="w-full bg-slate-600 text-white py-1 px-2 flex justify-between items-center">
      <div className="flex items-center gap-1">
        <div className="bg-sky-600 w-3 h-3 flex items-center"></div>
        <p className="text-xs">Never Used</p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-green-500 w-3 h-3 flex items-center"></div>
        <p className="text-xs">Barely Used</p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-purple-600 w-3 h-3 flex items-center"></div>
        <p className="text-xs">Minor Wear</p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-amber-500 w-3 h-3 flex items-center"></div>
        <p className="text-xs">Moderate Wear</p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-red-500 w-3 h-3 flex items-center"></div>
        <p className="text-xs">Major Wear</p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-gray-500 w-3 h-3 flex items-center"></div>
        <p className="text-xs">Ask Lister</p>
      </div>
    </div>
  );
};

export default ConditionLegend;
