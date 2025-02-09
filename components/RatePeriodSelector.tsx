"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export type RatePeriod = "hour" | "day" | "week";

export interface RatePeriodSelectorProps {
  onChange?: (selectedPeriod: RatePeriod | undefined) => void;
  initialSelected?: RatePeriod;
  value: string | undefined;
}

export const RatePeriodSelector: React.FC<RatePeriodSelectorProps> = ({
  onChange,
  initialSelected = "hour",
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<RatePeriod | undefined>(
    initialSelected
  );

  const handlePeriodChange = (period: RatePeriod) => {
    // Deselect if already selected, otherwise select the new period
    const newSelectedPeriod = selectedPeriod === period ? undefined : period;

    setSelectedPeriod(newSelectedPeriod);

    // Optional callback for parent component
    if (newSelectedPeriod !== undefined) {
      onChange?.(newSelectedPeriod as RatePeriod);
    }
  };

  const ratePeriods: RatePeriod[] = ["hour", "day", "week"];

  return (
    <div className="items-center mb-[-0.7rem] flex space-x-2">
      <p>rate per:</p>

      {ratePeriods.map((ratePeriod) => (
        <div key={ratePeriod} className="flex items-center space-x-2">
          <Checkbox
            id={ratePeriod}
            name={ratePeriod}
            checked={selectedPeriod === ratePeriod}
            onCheckedChange={() => handlePeriodChange(ratePeriod)}
          />
          <label
            htmlFor={ratePeriod}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {ratePeriod.charAt(0).toUpperCase() + ratePeriod.slice(1)}
          </label>
        </div>
      ))}
    </div>
  );
};
