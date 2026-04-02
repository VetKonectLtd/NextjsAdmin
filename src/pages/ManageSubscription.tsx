"use client";

import { CreateSubscriptionModal } from "@/components/dashboardcomponents/subscription/CreateSubscriptionModal";
import { ManageButton } from "@/components/shared/ManageButton";
import { useSubscriptionStore } from "@/stores/use-subscription-store";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Trash2,
  Check,
  SquareArrowOutUpRight,
  SquareArrowOutDownLeftIcon,
  SquarePen,
  Power,
} from "lucide-react";

const ManageSubscription = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [deactivatedPlanIds, setDeactivatedPlanIds] = useState<number[]>([]);

  const { plans, fetchPlans, deletePlan, deactivatePlan } = useSubscriptionStore();

  const handleDeletePlan = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this subscription plan?")) {
      await deletePlan(id);
      await fetchPlans();
    }
  };

  const handleDeactivatePlan = async (id: number) => {
    if (deactivatedPlanIds.includes(id)) return;

    if (window.confirm("Are you sure you want to deactivate this subscription plan?")) {
      await deactivatePlan(id);
      setDeactivatedPlanIds((prev) => [...prev, id]);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-base font-bold sm:text-lg">Subscription</h1>

          <div className="w-full sm:w-auto">
            <ManageButton
              label="Add New Sub Plan"
              onClick={() => setIsCreateModalOpen(true)}
            />
          </div>
        </div>

        <CreateSubscriptionModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingPlan(null);
          }}
          editingPlan={editingPlan}
        />

        <div className="mt-6 space-y-4">
          {plans.map((plan) => {
            const isExpanded = expandedId === plan.id;
            const isDeactivated = deactivatedPlanIds.includes(plan.id);

            return (
              <div
                key={plan.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold break-words sm:text-base">
                      {plan.subscription_title}
                    </h2>

                    <p className="mt-1 flex flex-wrap items-center gap-1 text-base font-bold sm:text-lg">
                      <span>₦ {Number(plan.price).toLocaleString()}</span>
                      <span className="text-gray-500">/</span>
                      <span className="text-sm font-semibold text-gray-500">
                        {plan?.date_option === "Months" ? "Monthly" : plan?.date_option}
                      </span>
                    </p>

                    {isDeactivated && (
                      <span className="mt-2 inline-block rounded-full bg-red-100 px-2 py-1 text-xs text-red-600">
                        Deactivated
                      </span>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:w-auto lg:justify-end">
                    <span className="w-fit rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                      {formatDistanceToNow(new Date(plan.created_at), { addSuffix: true })}
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingPlan(plan);
                          setIsCreateModalOpen(true);
                        }}
                        className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                        title="Edit plan"
                      >
                        <SquarePen size={20} />
                      </button>

                      <button
                        onClick={() => handleDeactivatePlan(plan.id)}
                        disabled={isDeactivated}
                        className={`rounded-md p-2 ${
                          isDeactivated
                            ? "cursor-not-allowed text-gray-300"
                            : "text-orange-500 hover:bg-orange-50"
                        }`}
                        title={isDeactivated ? "Plan already deactivated" : "Deactivate plan"}
                      >
                        <Power size={20} />
                      </button>

                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="rounded-md p-2 text-red-500 hover:bg-gray-100"
                        title="Delete plan"
                      >
                        <Trash2 size={20} />
                      </button>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : plan.id)}
                        className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                        title={isExpanded ? "Collapse details" : "Expand details"}
                      >
                        {isExpanded ? (
                          <SquareArrowOutDownLeftIcon size={20} />
                        ) : (
                          <SquareArrowOutUpRight size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                    <div className="space-y-3 text-sm text-gray-600">
                      {(plan.features || []).map((feature: string, index: number) => (
                        <Feature key={index} label={feature} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManageSubscription;

const Feature = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2">
      <span className="min-w-0 flex-1 break-words font-medium text-gray-700">
        {label}
      </span>
      <span className="flex shrink-0 items-center gap-2 rounded-md bg-gray-100 p-2 text-gray-500">
        <Check size={16} className="text-green-700" />
      </span>
    </div>
  );
};