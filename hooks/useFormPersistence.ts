export const useFormPersistence = (formKey: string) => {
  const saveFormData = (data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(formKey, JSON.stringify(data));
    }
  };

  const loadFormData = () => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(formKey);

      return savedData ? JSON.parse(savedData) : null;
    }
  };

  const clearFormData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(formKey);
    }
  };

  return { saveFormData, loadFormData, clearFormData };
};
