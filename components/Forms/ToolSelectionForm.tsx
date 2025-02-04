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

export const ToolSelectionForm: React.FC<SelectFormProps> = ({
  value,
  onChange,
}) => {
  const toolsCategories = [
    "Common Tools",
    "Power Tools",
    "Electric Tools",
    "Carpentry Tools",
    "Gardening Tools",
    "Plumbing Tools",
    "Automotive Tools",
    "Safety Tools",
    "Other Tools",
  ];

  return (
    <div className="">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full text-[1rem] rounded-none border-2 border-slate-400 px-2 outline-none focus:outline-none">
          <SelectValue placeholder="Select Tool Type" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectGroup className="text-cyan-700 font-semibold">
            {toolsCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
