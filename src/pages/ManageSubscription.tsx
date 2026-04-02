"use client";

import { CreateSubscriptionModal } from "@/components/dashboardcomponents/subscription/CreateSubscriptionModal";
import { ManageButton } from "@/components/shared/ManageButton";
import { useSubscriptionStore } from "@/stores/use-subscription-store";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Check, SquareArrowOutUpRight, SquareArrowOutDownLeftIcon, SquarePen } from "lucide-react";

const ManageSubscription = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  const { plans, fetchPlans, deletePlan } = useSubscriptionStore();

  const handleDeletePlan = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this subscription plan?")) {
      await deletePlan(id);
      await fetchPlans();
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-lg font-bold mb-4">Subscription</h1>

      <ManageButton
        label="Add New Sub Plan"
        onClick={() => setIsCreateModalOpen(true)}
      />

      <CreateSubscriptionModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPlan(null);
        }}
        editingPlan={editingPlan}
      />

      {/* Plans */}
      <div className="space-y-4 mt-6">
        {plans.map((plan) => {
          const isExpanded = expandedId === plan.id;

          return (
            <div
              key={plan.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              {/* Header */}
              <div className="flex justify-between items-start p-5">
                <div className="flex gap-5">
                  <div>

                    <h2 className="text-sm font-semibold">
                      {plan.subscription_title}
                    </h2>
                    <p className="text-lg flex items-center font-bold mt-1">
                      ₦ {plan.price.toLocaleString()} <span className="text-gray-500">/</span> <p className="text-sm font-semibold text-gray-500">{plan?.date_option == "Months" ? "Monthly" : plan?.date_option}</p>
                    </p> </div>

                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                    {formatDistanceToNow(new Date(plan.created_at), { addSuffix: true })}
                  </span>

                  <button
                    onClick={() => {
                      setEditingPlan(plan);
                      setIsCreateModalOpen(true);
                    }}
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    <SquarePen size={20} />
                  </button>

                  <button onClick={() => handleDeletePlan(plan.id)} className="p-2 rounded-md hover:bg-gray-100 text-red-500">
                    <Trash2 size={20} />
                  </button>

                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : plan.id)
                    }
                    className="p-2 text-gray-600 rounded-md hover:bg-gray-100"
                  >
                    {isExpanded ? <SquareArrowOutDownLeftIcon size={20} /> : <SquareArrowOutUpRight size={20} />}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (

                <div className="px-5 pb-5 space-y-3 text-sm text-gray-600">
                  {
                    plan.features.map((feature, index) => (
                      <Feature key={index} label={feature} />
                    ))
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageSubscription;

const Feature = ({
  label,
}: {
  label: string;
}) => {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="flex items-center gap-2 bg-gray-100 rounded-md p-2 text-gray-500">
        <Check size={16} className="text-green-700" />
      </span>
    </div>
  );
};