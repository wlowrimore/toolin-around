"use client";

import React, { useState, useEffect, useActionState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFeatured } from "@/contexts/FeaturedContext";
import { setFeaturedListing } from "@/app/actions/featuredListings";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useUpdatePath } from "@/hooks/useUpdatePath";
import { useTimeLimit } from "@/hooks/useTimeLimit";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { ToolSelectionForm } from "./ToolSelectionForm";
import { Checkbox } from "../ui/checkbox";
import { ToolConditionForm } from "./ToolConditionForm";
import { BookOpenCheck, CloudUpload, Gem, SquarePen, X } from "lucide-react";
import FeatureModal from "../feature-signup/FeatureModal";
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
import { LoadingSpinnerWhite } from "../LoadingAnimations";

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
  deleteToken: string;
  contact: string;
  author: Author;
};

export type ServiceWithAuthorRef = Omit<Listing, "author"> & {
  author: {
    _ref: string;
    email: string;
    isFeatured?: boolean;
    featuredSince?: string;
    featuredUntil?: string;
  };
};

interface ListingFormProps {
  initialData?: {
    _id: string;
    title: string;
    description: string;
    author: {
      _ref: string;
      email: string;
      isFeatured?: boolean;
      featuredSince?: string;
      featuredUntil?: string;
    };
    category: string;
    condition: string;
    toolDetails: string;
    deleteToken: string;
    price: string;
    ratePeriod: string;
    image: string;
    contact: string;
    role: string;
    isFeaturedListing?: boolean;
  };
  authorEmail: string;
}

interface ListingFormData {
  title: string;
  description: string;
  category: string;
  condition: string;
  toolDetails: string;
  deleteToken: string;
  price: string;
  ratePeriod: string;
  image: string;
  contact: string;
  imageDeleteToken?: string;
  isFeaturedListing?: boolean;
}

const ListToolsForm = (
  { initialData }: ListingFormProps,

  // newSelectedPeriods: RatePeriod[]
) => {
  const { data: session } = useSession();
  const { saveFormData, loadFormData, clearFormData } =
    useFormPersistence("listingForm");
  const { toast } = useToast();
  const { isUpdatePath } = useUpdatePath();
  const { isFeatured } = useFeatured();
  const isAuthorFeatured = isFeatured;

  console.log("IS AUTHOR FEATURED IN FORM:", isAuthorFeatured);
  console.log("IS LISTING FEATURED:", isFeatured);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<ListingFormData>(() => {
    // If editing an existing listing, prioritize initial data
    if (initialData?._id) {
      console.log("=== LOADING INITIAL DATA ===");
      console.log("Initial Data:", initialData);
      console.log("isFeaturedListing from DB:", initialData.isFeaturedListing);

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
        deleteToken: initialData.deleteToken || "",
        contact: initialData.contact || "",
        isFeaturedListing: false,
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
        deleteToken: "",
        contact: "",
        isFeaturedListing: false,
      }
    );
  });

  const showSuccess = useTimeLimit(formData.image);

  const handleFeaturedToggle = (checked: boolean | "indeterminate") => {
    console.log("=== TOGGLE CLICKED ===");
    console.log("Checked value:", checked);
    console.log(
      "Current formData.isFeaturedListing:",
      formData.isFeaturedListing,
    );

    const newValue = checked === true;
    console.log("Setting to new value:", newValue);

    setFormData((prev) => ({
      ...prev,
      isFeaturedListing: newValue,
    }));
  };

  const handleClose = () => {
    setIsOpen(false);
  };

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    e: React.KeyboardEvent<HTMLTextAreaElement>,
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
      console.log("=== FORM SUBMIT ===");
      console.log("isFeaturedListing:", formData.isFeaturedListing);

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
          // initialData._id,
          initialData._id,
          {
            // ...formData,
            title: formDataSubmit.get("title") as string,
            description: formDataSubmit.get("description") as string,
            category: formData.category,
            condition: formData.condition,
            image: formData.image,
            contact: formDataSubmit.get("contact") as string,
            toolDetails: formDataSubmit.get("toolDetails") as string,
            deleteToken: formData.deleteToken,
            price: formData.price,
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
              deleteToken: string;
            }
          >,
          initialData.author.email,
        );

        if (isAuthorFeatured && formData.image) {
          const featuredResult = await setFeaturedListing(
            initialData._id,
            initialData.author.email,
            formData.isFeaturedListing || false,
          );

          console.log("Featured status update result:", featuredResult);
        }

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
          if (value !== undefined && key !== "isFeaturedListing") {
            submitFormData.append(key, String(value));
          }
        });

        const result = await createToolDetails(prevState, submitFormData);

        if (result.status === "SUCCESS" && result._id) {
          // Setting featured listing if applicable
          if (
            isAuthorFeatured &&
            formData.image &&
            formData.isFeaturedListing
          ) {
            if (session?.user?.email) {
              await setFeaturedListing(result._id, session.user.email, true);
            }
          }

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
            ? "Make any changes to your existing listing"
            : "Fill out the form below to create a new listing "}
        </h2>
      </header>

      <form action={formAction} className="">
        <input
          type="hidden"
          name="isFeaturedListing"
          value={formData.isFeaturedListing ? "true" : "false"}
        />
        <div className="grid grid-cols-2 mt-4 gap-8">
          <div className="flex flex-col gap-1 space-y-5">
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
              <input
                type="text"
                name="description"
                id="description"
                placeholder="Use keywords to help users find your listing separated by commas"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full h-[2.25rem] text-[1rem] border-2 border-slate-400 px-2 outline-none"
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
            <div className="flex flex-col gap-1 pb-8">
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
                  initialSelected={
                    (formData.ratePeriod as RatePeriod) || "hour"
                  }
                />
                {errors.price && (
                  <p className="text-red-600 text-small">{errors.price}</p>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col justify-center cursor-pointer bg-black border border-red-700 hover:bg-slate-800 px-4 py-[0.3rem] text-white transition-hover duration-200">
              <label
                htmlFor="image"
                className="cursor-pointer w-[10rem] text-xl flex flex-col justify-center items-center"
              ></label>
              <CloudinaryUploader
                onImageUrlChange={handleImageChange}
                currentImageUrl={formData.image}
                className=" bg-black border border-red-700 !max-w-fit hover:bg-black text-white font-semibold py-2 px-11 rounded-full transition:hover duration-300 cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1 pt-[0.3rem]">
              <label htmlFor="contact">Alternate Email</label>
              <input
                id="contact"
                type="email"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="Email address for contact"
                className="w-full h-[2.25rem] text-[1rem] border-2 border-slate-400 px-2 outline-none"
              />
              <p className="flex items-center text-sm text-slate-500 border-b border-slate-400 pb-[1.7rem]">
                {errors.contact ? (
                  <span className="text-red-600 text-small">
                    {errors.contact}
                  </span>
                ) : (
                  <span className="text-xs mt-1">
                    ** For security purposes, email will not be shared and will
                    only be visible in your profile **
                  </span>
                )}
              </p>
              {/* Image Preview and Featured Section */}
              <div className="flex">
                {formData.image && (
                  <div className="my-2 grid grid-cols-2">
                    {showSuccess !== void 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        Image uploaded successfully!
                      </p>
                    )}
                    <div className="flex gap-2 items-center max-w-[8.5rem] min-w-[8.5rem] w-[8.5rem] h-[8.5rem]">
                      <img
                        src={formData.image}
                        alt="Uploaded preview"
                        width={500}
                        height={500}
                        className="w-full h-full object-cover overflow-hidden md:max-w-xs shadow-sm -mt-[0.13rem] shadow-neutral-700"
                      />
                      {formData.isFeaturedListing && isAuthorFeatured && (
                        <div className="absolute left-[50.77%]">
                          <div className="flex justify-center items-center max-w-[8.5rem] min-w-[8.5rem] w-[8.5rem] bg-neutral-700/70">
                            <Gem className="size-5 text-sky-400" />
                            <h1 className="font-semibold text-white text-lg">
                              Featured
                            </h1>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-2">
                  {isAuthorFeatured ? (
                    <div className="flex flex-col space-y-2 border border-slate-400 px-11 items-center py-2 bg-slate-200">
                      <div className="flex justify-center items-center gap-2">
                        <Gem className="size-6 text-sky-400" />
                        <h3 className="font-semibold text-black text-xl text-center">
                          Welcome Featured Lister
                        </h3>
                      </div>

                      <p className="text-sm text-neutral-700 font-semibold text-center tracking-wide">
                        As a featured lister, you can mark this listing to
                        appear on our Featured page!
                      </p>

                      {formData.image ? (
                        <>
                          <div className="flex items-center gap-2 py-[0.45rem]">
                            <Checkbox
                              id="isFeaturedListing"
                              checked={formData.isFeaturedListing === true}
                              onCheckedChange={handleFeaturedToggle}
                            />
                            <label
                              htmlFor="isFeaturedListing"
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {formData.isFeaturedListing
                                ? "✓ This is your featured listing"
                                : "Make this my featured listing"}
                            </label>
                          </div>
                          {formData.isFeaturedListing ? (
                            <p className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">
                              ⭐ This listing will appear on the Featured page
                            </p>
                          ) : (
                            <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                              💡 Only one listing can be featured at a time
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-base text-green-700 font-semibold text-center">
                          Upload an image to enable the featured listing option
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      <h3 className="font-semibold text-slate-600 text-lg leading-tight">
                        Want to increase visibility? Become a Featured Lister!
                      </h3>
                      <p className="text-sm text-emerald-800 font-semibold">
                        It&apos;s fast, easy, and automatic upon sign up!
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="w-full text-xl bg-black border border-black hover:bg-slate-800 px-4 py-1.5 text-white transition-hover duration-200"
                      >
                        Become a Featured Lister
                      </button>
                    </div>
                  )}
                </div>
                <Gem className="size-24 mt-4 text-sky-400 mx-auto opacity-20" />
              </div>
            </div>
            {errors.image && (
              <p className="text-red-600 text-small">{errors.image}</p>
            )}
          </div>
        </div>
        <div className="mt-8">
          <button
            type="submit"
            disabled={isPending}
            className="w-full text-xl bg-black border border-red-700/90 hover:bg-slate-800 px-4 py-2 text-white transition-hover duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdatePath ? (
              <span className="flex items-end justify-center gap-2">
                {isPending ? (
                  <>
                    Updating...
                    <LoadingSpinnerWhite />
                  </>
                ) : (
                  <>
                    Update Listing <SquarePen className="h-6 w-6" />
                  </>
                )}
              </span>
            ) : (
              <span className="flex items-end justify-center gap-2">
                {isPending ? (
                  <>
                    Publishing...
                    <LoadingSpinnerWhite />
                  </>
                ) : (
                  <>
                    Publish Listing <BookOpenCheck className="h-6 w-6" />
                  </>
                )}
              </span>
            )}
          </button>
        </div>
      </form>
      {isOpen && <FeatureModal isOpen={isOpen} onClose={handleClose} />}
    </main>
  );
};

export default ListToolsForm;
