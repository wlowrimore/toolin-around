export const category = {
  name: "category",
  title: "Tools Category",
  type: "string",
  options: {
    list: [
      { title: "Common Tools", value: "Common Tools" },
      { title: "Power Tools", value: "Power Tools" },
      { title: "Electric Tools", value: "Electric Tools" },
      { title: "Carpentry Tools", value: "Carpentry Tools" },
      { title: "Gardening Tools", value: "Gardening Tools" },
      { title: "Plumbing Tools", value: "Plumbing Tools" },
      { title: "Measuring Tools", value: "Measuring Tools" },
      { title: "Safety Tools", value: "Safety Tools" },
      { title: "Other Tools", value: "Other Tools" },
    ],
  },
  validation: (Rule: any) => Rule.required(),
};
