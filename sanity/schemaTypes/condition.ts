export const condition = {
  name: "condition",
  title: "Condition",
  type: "string",
  options: {
    list: [
      { title: "New", value: "New" },
      { title: "Like New", value: "Like New" },
      { title: "Good", value: "Good" },
      { title: "Fair", value: "Fair" },
      { title: "Poor", value: "Poor" },
      { title: "Other", value: "Other" },
    ],
  },
  validation: (Rule: any) => Rule.required(),
};
