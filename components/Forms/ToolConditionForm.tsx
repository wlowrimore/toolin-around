"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFormProps {
  value: string;
  onChange: (value: string) => void;
}

export function ToolConditionForm({ value, onChange }: SelectFormProps) {
  const toolConditionCategories = [
    "New",
    "Like New",
    "Good",
    "Fair",
    "Poor",
    "Other",
  ];

  return (
    <div className="">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full text-[1rem] rounded-none border-2 border-slate-400 px-2 outline-none focus:outline-none">
          <SelectValue placeholder="Select Tool Type" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectGroup className="text-cyan-700 font-semibold">
            {toolConditionCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
