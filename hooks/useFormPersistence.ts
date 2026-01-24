// export const useFormPersistence = (formKey: string) => {
//   const saveFormData = (data: any) => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem(formKey, JSON.stringify(data));
//     }
//   };

//   const loadFormData = () => {
//     if (typeof window !== "undefined") {
//       const savedData = localStorage.getItem(formKey);

//       return savedData ? JSON.parse(savedData) : null;
//     }
//   };

//   const clearFormData = () => {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem(formKey);
//     }
//   };

//   return { saveFormData, loadFormData, clearFormData };
// };

export function useFormPersistence(formKey: string) {
  const saveFormData = (data: any) => {
    if (typeof window !== "undefined") {
      // Exclude isFeaturedListing from persistence
      const { isFeaturedListing, ...dataToSave } = data;
      localStorage.setItem(formKey, JSON.stringify(dataToSave));
    }
  };

  const loadFormData = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(formKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Never persist isFeaturedListing
        return { ...parsed, isFeaturedListing: false };
      }
    }
    return null;
  };

  const clearFormData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(formKey);
    }
  };

  return { saveFormData, loadFormData, clearFormData };
}
