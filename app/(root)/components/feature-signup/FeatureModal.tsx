"use client";

import { useState } from "react";
import { useFeatured } from "@/contexts/FeaturedContext";
import { useSession } from "next-auth/react";
import { updateFeaturedStatus } from "@/app/actions/featuredStatus";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { LoadingSpinner } from "../LoadingAnimations";
import { Check, Gem, CreditCard, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = "card" | "paypal";
type Step = "details" | "payment" | "success";

const FeatureModal = ({ isOpen, onClose }: FeatureModalProps) => {
  const { data: session } = useSession();
  const { refreshStatus } = useFeatured();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>("details");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (session?.user?.email) {
      const result = await updateFeaturedStatus(session.user.email, true, {
        stripeCustomerId: "mock_cus>" + Date.now(),
        stripeSubscriptionId: "mock_sub>" + Date.now(),
      });

      if (result.success) {
        await refreshStatus();
        setIsLoading(false);
        setStep("success");
        toastSuccess("Payment successful!");
      }
    }
  };

  const toastSuccess = (message: string) => {
    toast({
      variant: "success",
      title: "Success",
      description: message,
    });
  };

  const toastError = (message: string) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
    });
  };

  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.length <= 5) {
      setExpiry(formatted);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, "");
    if (value.length <= 4) {
      setCvc(value);
    }
  };

  const handleClose = () => {
    setStep("details");
    setPaymentMethod("card");
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setName("");
    setZip("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {step === "details" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Gem className="w-6 h-6 text-sky-500" />
                Become a Featured Lister
              </DialogTitle>
              <DialogDescription>
                Stand out from the crowd and get more visibility
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
              <div className="border-2 border-sky-500 rounded-lg p-6 bg-gradient-to-br from-sky-50 to-white">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                    Monthly Subscription
                  </p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-900">
                      $9.99
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    What you get:
                  </h4>
                  {[
                    "Priority placement in search results",
                    "Featured badge on all your listings",
                    "Highlighted profile on homepage",
                    "Analytics dashboard for your listings",
                    "Early access to new features",
                    "Cancel anytime, no commitments",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep("payment")}
                className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-sky-700 transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Payment Details</DialogTitle>
              <DialogDescription>Choose your payment method</DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
              {/* Payment Method Selection */}
              <div className="flex gap-4">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-sky-500 bg-sky-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-semibold">Credit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "paypal"
                      ? "border-sky-500 bg-sky-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#003087">
                    <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 01-.794.679H7.72a.483.483 0 01-.477-.558L9.22 7.3a.96.96 0 01.948-.779h4.437c1.152 0 2.117.153 2.91.462 1.17.456 1.967 1.36 2.552 2.495z" />
                  </svg>
                  <span className="font-semibold">PayPal</span>
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === "card" && (
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                    <strong>Test Mode:</strong> Use 4242 4242 4242 4242
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={handleCvcChange}
                        placeholder="123"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP
                      </label>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="12345"
                        required
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>

                  <div className="pt-4 space-y-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>Pay $9.99/month</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      className="w-full py-2 text-gray-600 hover:text-gray-800"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}

              {/* PayPal Payment */}
              {paymentMethod === "paypal" && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                    <strong>Test Mode:</strong> Click to simulate PayPal payment
                  </div>

                  <div className="border-2 border-gray-300 rounded-lg p-8 text-center">
                    <div className="mb-4">
                      <svg
                        className="w-16 h-16 mx-auto"
                        viewBox="0 0 24 24"
                        fill="#003087"
                      >
                        <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 01-.794.679H7.72a.483.483 0 01-.477-.558L9.22 7.3a.96.96 0 01.948-.779h4.437c1.152 0 2.117.153 2.91.462 1.17.456 1.967 1.36 2.552 2.495z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-6">
                      You will be redirected to PayPal to complete your purchase
                    </p>
                    <button
                      onClick={handleSubmitPayment}
                      disabled={isLoading}
                      className="w-full bg-[#0070ba] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#005ea6] transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Processing..." : "Continue with PayPal"}
                    </button>
                  </div>

                  <button
                    onClick={() => setStep("details")}
                    className="w-full py-2 text-gray-600 hover:text-gray-800"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <div className="py-12 text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle2 className="w-16 h-16 text-green-600" />
                </div>
              </div>

              <DialogTitle className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Featured Listings!
              </DialogTitle>

              <DialogDescription className="text-lg text-gray-600 mb-8">
                Your subscription is now active. Your listings will now appear
                with priority placement and a featured badge.
              </DialogDescription>

              <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  What happens next?
                </h3>
                <ul className="text-left space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Your listings now have priority placement in search
                      results
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <span>Featured badge added to all your listings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <span>Access to analytics dashboard unlocked</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-sky-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeatureModal;
