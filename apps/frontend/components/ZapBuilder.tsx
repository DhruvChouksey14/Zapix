"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Button from "./Button";
import ZapStep from "./ZapStep";
import Spinner from "./Spinner";
import Modal from "./Modal";
import type { SelectedAction, SelectedTrigger } from "./types";

const emptyAction: SelectedAction = {
  availableActionId: "",
  actionType: "",
  actionMetaData: {},
};

const ZapBuilder = ({ zapId }: { zapId?: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<SelectedTrigger>();
  const [selectedActions, setSelectedActions] = useState<SelectedAction[]>([emptyAction]);
  const [modalVisibleFor, setModalVisibleFor] = useState(0);

  const isEditing = Boolean(zapId);

  useEffect(() => {
    if (!zapId) return;

    const fetchZapDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/zaps/${zapId}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        const { zap } = data;

        setSelectedTrigger({
          availableTriggerId: zap.trigger.trigger.id,
          triggerType: zap.trigger.trigger.type,
        });
        setSelectedActions(
          zap.actions.map((a: any) => ({
            availableActionId: a.action.id,
            actionType: a.action.type,
          }))
        );
      } catch (error) {
        toast.error("Could not load this Zap.");
        router.push("/dashboard");
      }
    };

    fetchZapDetails();
  }, [zapId]);

  const handlePublish = async () => {
    if (!selectedTrigger) {
      toast.error("Pick a trigger before publishing.");
      return;
    }

    setLoading(true);

    const payload = {
      availableTriggerId: selectedTrigger.availableTriggerId,
      triggerMetaData: {},
      actions: selectedActions.map((action) => ({
        availableActionId: action.availableActionId,
        actionMetaData: action.actionMetaData,
      })),
    };

    try {
      const headers = { Authorization: localStorage.getItem("token") };

      if (isEditing) {
        await axios.put(`http://localhost:8000/api/zaps/${zapId}`, payload, { headers });
      } else {
        await axios.post("http://localhost:8000/api/zaps", payload, { headers });
      }

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Could not save this Zap.");
    }

    setTimeout(() => setLoading(false), 1000);
  };

  const handleSelection = (selectedItem: any) => {
    if (modalVisibleFor === 1) {
      setSelectedTrigger({
        availableTriggerId: selectedItem?.id,
        triggerType: selectedItem?.type,
        triggerMetaData: {},
      });
    } else if (modalVisibleFor > 1) {
      setSelectedActions((actions) =>
        actions.map((action, i) =>
          i + 2 === modalVisibleFor
            ? {
                actionType: selectedItem?.type,
                availableActionId: selectedItem?.id,
                actionMetaData: selectedItem?.metadata,
              }
            : action
        )
      );
    }

    setModalVisibleFor(0);
  };

  const handleStepClick = (index: number) => {
    setModalVisibleFor(index);
  };

  const handleActionDelete = (index: number) => {
    setSelectedActions(selectedActions.filter((_, i) => i + 2 !== index));
  };

  return (
    <>
      <div className="w-full fixed flex justify-end px-10 py-2 bg-black">
        <Button variant="primary" onClick={handlePublish}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
          <p className="mr-1">{isEditing ? "Save" : "Publish"}</p>
          {loading && <Spinner color="white" />}
        </Button>
      </div>

      <div className="mt-32 flex flex-col items-center gap-4">
        <ZapStep
          index={1}
          name={selectedTrigger ? selectedTrigger.triggerType : "Trigger"}
          onClick={() => handleStepClick(1)}
        />
        {selectedActions.map((action, index) => (
          <ZapStep
            key={index}
            index={index + 2}
            name={action.actionType || "Action"}
            onClick={() => handleStepClick(index + 2)}
            handleDelete={handleActionDelete}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setSelectedActions((actions) => [...actions, emptyAction])}
          className="bg-black hover:bg-gray-800 transition-colors p-2 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" className="size-6">
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {modalVisibleFor !== 0 && (
        <Modal isVisible={modalVisibleFor} setIsVisible={setModalVisibleFor} onClick={handleSelection} />
      )}
    </>
  );
};

export default ZapBuilder;