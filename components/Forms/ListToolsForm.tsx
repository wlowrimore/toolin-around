"use client";

import React, { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useUpdatePath } from "@/hooks/useUpdatePath";
import { useTimeLimit } from "@/hooks/useTimeLimit";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { ToolSelectionForm } from "./ToolSelectionForm";
import { Checkbox } from "../ui/checkbox";
import { ToolConditionForm } from "./ToolConditionForm";
import { BookOpenCheck, CloudUpload } from "lucide-react";
import {
  createToolDetails,
  ListingWithAuthorRef,
  updateListing,
} from "@/lib/actions";
import {
  RatePeriodSelector,
  RatePeriod,
  RatePeriodSelectorProps,
} from "../RatePeriodSelector";
import CloudinaryUploader from "../CloudinaryUploader";

export type Author = {
  _id: string;
  name: string;
  image: string;
  email: string;
};

export type Listing = {
  _id: string;
  _createdAt: string;
  title: string;
  description: string;
  price: string;
  ratePeriod: string;
  image: string;
  category: string;
  condition: string;
  toolDetails: string;
  contact: string;
  author: Author;
};

export type ServiceWithAuthorRef = Omit<Listing, "author"> & {
  author: {
    _ref: string;
    email: string;
  };
};

interface ListingFormProps {
  initialData?: {
    _id: string;
    title: string;
    description: string;
    author: { _ref: string; email: string };
    category: string;
    condition: string;
    toolDetails: string;
    price: string;
    ratePeriod: string;
    image: string;
    contact: string;
    role: string;
  };
  authorEmail: string;
}

interface ListingFormData {
  title: string;
  description: string;
  category: string;
  condition: string;
  toolDetails: string;
  price: string;
  ratePeriod: string;
  image: string;
  contact: string;
  imageDeleteToken?: string;
}

const ListToolsForm = (
  { initialData }: ListingFormProps
  // newSelectedPeriods: RatePeriod[]
) => {
  const { saveFormData, loadFormData, clearFormData } =
    useFormPersistence("listingForm");
  const { toast } = useToast();
  const { isUpdatePath } = useUpdatePath();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const [formData, setFormData] = useState<ListingFormData>(() => {
    // If editing an existing listing, prioritize initial data
    if (initialData?._id) {
      return {
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category || "",
        condition: initialData.condition || "",
        price: initialData.price ?? "",
        ratePeriod: initialData.ratePeriod ?? "",
        image: initialData.image || "",
        imageDeleteToken: "",
        toolDetails: initialData.toolDetails || "",
        contact: initialData.contact || "",
      } as ListingFormData;
    }

    const persistedData = loadFormData();
    return (
      persistedData || {
        title: "",
        description: "",
        category: "",
        condition: "",
        toolDetails: "",
        price: "",
        ratePeriod: "",
        image: "",
        imageDeleteToken: "",
        pitch: "",
        contact: "",
      }
    );
  });

  const showSuccess = useTimeLimit(formData.image);

  const handleSuccessfulSubmission = () => {
    clearFormData();
  };

  useEffect(() => {
    if (!initialData?._id) {
      saveFormData(formData);
    }
  }, [formData, initialData?._id]);

  const handleImageChange = (url: string, deleteToken?: string) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
      imageDeleteToken: deleteToken || "",
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleConditionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      condition: value,
    }));
  };

  const handleRatePeriodChange = (selectedPeriod?: RatePeriod) => {
    if (!selectedPeriod) return;

    setFormData((prev) => ({
      ...prev,
      ratePeriod: selectedPeriod,
    }));

    console.log("Updated ratePeriod:", selectedPeriod);
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      setFormData((prev) => {
        const currentValue = prev[textarea.name as keyof typeof prev] as string;
        const newValue =
          currentValue.slice(0, start) + "\n" + currentValue.slice(end);

        return {
          ...prev,
          [textarea.name]: newValue,
        };
      });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFormSubmit = async (prevState: any, formDataSubmit: FormData) => {
    try {
      if (!validateEmail(formData.contact)) {
        setErrors((prev) => ({
          ...prev,
          contact: "Please enter a valid email address",
        }));
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please enter a valid email address",
        });
        return {
          ...prevState,
          error: "Invalid email address",
          status: "ERROR",
        };
      }

      if (initialData?._id) {
        console.log("Taking Update Branch");

        const result = await updateListing(
          initialData._id,
          {
            ...formData,
            title: formDataSubmit.get("title") as string,
            description: formDataSubmit.get("description") as string,
            category: formData.category,
            condition: formData.condition,
            image: formData.image,
            contact: formDataSubmit.get("contact") as string,
            toolDetails: formDataSubmit.get("toolDetails") as string,
            price: formDataSubmit.get("price") as string,
            ratePeriod: formData.ratePeriod,
          } as Partial<
            Omit<ListingWithAuthorRef, "author"> & {
              contact: string;
              category: string;
              condition: string;
              image: string;
              toolDetails: string;
              price: string;
              ratePeriod: string;
            }
          >,
          initialData.author.email
        );
        console.log("FORM DATA PRICE:", formData.price);
        if (result) {
          handleSuccessfulSubmission();
          toast({
            variant: "success",
            title: "Success",
            description: "Listing updated successfully",
          });
          router.refresh();
          router.push(`/listing/${result._id}`);
          return {
            status: "SUCCESS",
            message: "Listing updated successfully",
          };
        } else {
          throw new Error("Failed to update listing");
        }
      } else {
        const submitFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined) {
            submitFormData.append(key, value);
          }
        });

        const result = await createToolDetails(prevState, submitFormData);

        if (result.status === "SUCCESS" && formData.image) {
          handleSuccessfulSubmission();
          toast({
            variant: "success",
            title: "Success",
            description: "Your listing has been successfully created",
          });
          router.push(`/listing/${result._id}`);
        }

        return result;
      }
    } catch (error) {
      console.log("Validation or submission error:", error);

      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please check the form fields and try again",
        });

        return {
          ...prevState,
          error: "Validation error occurred",
          status: "ERROR",
        };
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error has occurred",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [_, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <main className="w-full my-10 px-6">
      <header className="w-full border-b-[0.025rem] border-slate-300 py-2">
        <h1 className="text-slate-600 text-3xl font-semibold">
          {isUpdatePath ? "Update Your Listing" : "Create a New Listing"}
        </h1>
        <h2 className="text-xl text-slate-600">
          {isUpdatePath
            ? "Add any changes to your existing listing"
            : "Fill out the form below to create a new listing "}
        </h2>
      </header>

      <form action={formAction} className="grid grid-cols-2 mt-4 gap-8">
        <div className="space-y-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Listing Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Listing Title"
              required
              className="w-full h-[2.25rem] text-[1rem] border-2 border-slate-400 px-2 outline-none"
            />
            {errors.title && (
              <p className="text-red-600 text-small">{errors.title}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description">Listing Keywords</label>
            <textarea
              name="description"
              id="description"
              placeholder="Use keywords to help users find your listing separated by commas"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full text-[1rem] border-2 border-slate-400 px-2 outline-none"
            />
            {errors.description && (
              <p className="text-red-600 text-small">{errors.description}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="category">Tool Type</label>
            <ToolSelectionForm
              value={formData.category}
              onChange={handleCategoryChange}
            />
            {errors.category && (
              <p className="text-red-600 text-small">{errors.category}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="condition">Tool Condition</label>
            <ToolConditionForm
              value={formData.condition}
              onChange={handleConditionChange}
            />
            {errors.condition && (
              <p className="text-red-600 text-small">{errors.condition}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="toolDetails">Tool Details</label>
            <textarea
              id="toolDetails"
              name="toolDetails"
              value={formData.toolDetails}
              onChange={handleInputChange}
              rows={6}
              required
              placeholder="Brief description of your tools and lending terms"
              className="w-full text-[1rem] border-2 border-slate-400 px-2 outline-none"
            />
            {errors.toolDetails && (
              <p className="text-red-600 text-small">{errors.toolDetails}</p>
            )}
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-5">
          <div className="flex flex-col gap-1 pb-[1.8rem]">
            <label htmlFor="price">Rental Fee</label>
            <div className="flex items-center">
              <label htmlFor="price">$</label>
              <input
                id="price"
                name="price"
                type="text"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-1/4 pt-[0.59rem] text-center text-[1rem] border-b-2 border-slate-400 px-2 outline-none mr-6"
              />
              <RatePeriodSelector
                value={formData.ratePeriod}
                onChange={handleRatePeriodChange}
                initialSelected={(formData.ratePeriod as RatePeriod) || "hour"}
              />
              {errors.price && (
                <p className="text-red-600 text-small">{errors.price}</p>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col justify-center cursor-pointer bg-cyan-600 border border-cyan-700/90 hover:bg-cyan-700 px-4 py-[0.65rem] text-white">
            <label
              htmlFor="image"
              className="cursor-pointer w-[10rem] text-xl flex flex-col justify-center items-center"
            ></label>
            <CloudinaryUploader
              onImageUrlChange={handleImageChange}
              currentImageUrl={formData.image}
              className=" bg-cyan-600 border border-black !max-w-fit hover:bg-black text-white font-semibold py-2 px-11 rounded-full transition:hover duration-300 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1 pt-[0.05rem]">
            <label htmlFor="contact">Contact Email</label>
            <input
              id="contact"
              type="email"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="Email address for contact"
              className="w-full h-[2.25rem] text-[1rem] border-2 border-slate-400 px-2 outline-none"
            />
            <p className="flex items-center text-sm text-slate-500 border-b border-slate-400 pb-6">
              ** We will never share your personal information with anyone. **
            </p>
          </div>
          {formData.image && (
            <div className="mt-2 grid grid-cols-2">
              {showSuccess !== void 0 && (
                <p className="text-sm text-green-600 mt-2">
                  Image uploaded successfully!
                </p>
              )}
              <img
                src={formData.image}
                alt="Uploaded preview"
                width={500}
                height={500}
                className="w-32 h-32 overflow-hidden object-contain md:max-w-xs shadow-sm -mt-[0.13rem] shadow-neutral-700"
              />
            </div>
          )}
          {errors.image && (
            <p className="text-red-600 text-small">{errors.image}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full text-xl bg-cyan-600 border border-cyan-700/90 hover:bg-cyan-700 px-4 py-2 text-white"
        >
          <span className="flex items-end justify-center gap-2">
            Publish Listing <BookOpenCheck className="h-6 w-6" />
          </span>
        </button>
      </form>
      <div className="w-full gap-6 flex items-center mt-6"></div>
    </main>
  );
};

export default ListToolsForm;
