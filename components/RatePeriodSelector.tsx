"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export type RatePeriod = "hour" | "day" | "week";

export interface RatePeriodSelectorProps {
  onChange?: (selectedPeriod: RatePeriod) => void;
  initialSelected?: RatePeriod;
}

export const RatePeriodSelector: React.FC<RatePeriodSelectorProps> = ({
  onChange,
  initialSelected,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<RatePeriod | undefined>(
    initialSelected
  );

  const handlePeriodChange = (period: RatePeriod) => {
    // Deselect if already selected, otherwise select the new period
    const newSelectedPeriod = selectedPeriod === period ? undefined : period;

    setSelectedPeriod(newSelectedPeriod);

    // Optional callback for parent component
    onChange?.(newSelectedPeriod as RatePeriod);
  };

  const periods: RatePeriod[] = ["hour", "day", "week"];

  return (
    <div className="items-center mb-[-0.7rem] flex space-x-2">
      <p>rate per:</p>

      {periods.map((period) => (
        <div key={period} className="flex items-center space-x-2">
          <Checkbox
            id={period}
            checked={selectedPeriod === period}
            onCheckedChange={() => handlePeriodChange(period)}
          />
          <label
            htmlFor={period}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </label>
        </div>
      ))}
    </div>
  );
};
