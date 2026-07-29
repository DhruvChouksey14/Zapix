"use client";
import axios from "axios";
import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";
import FormInput from "./FormInput";
import Button from "./Button";

const BACKEND_URL = "http://localhost:8000";

interface AvailableItem {
  id: string;
  type: string;
  image: string;
}

const Modal = ({
  isVisible,
  setIsVisible,
  onClick,
}: {
  isVisible: number;
  setIsVisible: Dispatch<SetStateAction<number>>;
  onClick?: (selectedItem: any) => void;
}) => {
  const [availableItems, setAvailableItems] = useState<AvailableItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>();
  const [page, setPage] = useState(1);

  const isTriggerStep = isVisible === 1;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const endpoint = isTriggerStep ? "triggers" : "actions";
        const response = await axios.get(`http://localhost:8000/api/${endpoint}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setAvailableItems(isTriggerStep ? response?.data?.availableTriggers : response?.data?.availableActions);
      } catch (error) {
        toast.error("Could not load the available options.");
      }
    };

    fetchItems();

    return () => setAvailableItems([]);
  }, []);

  const handleSaveMetaData = (metaData: any) => {
    onClick && onClick({ ...selectedItem, metadata: metaData });
  };

  const handleItemSelect = (item: AvailableItem) => {
    setSelectedItem(item);
    if (isVisible > 1) {
      setPage((p) => p + 1);
    } else {
      onClick && onClick(item);
    }
  };

  return (
    <div className="absolute justify-center items-center bg-black/50 h-screen w-screen top-0 left-0 flex">
      <div className="bg-white w-[40rem] min-h-96 rounded-md shadow-lg p-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-300">
          <h3 className="font-semibold text-lg">
            {isTriggerStep ? "Select Trigger" : "Select Action"}
          </h3>
          <svg
            onClick={() => setIsVisible(0)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#000000"
            className="size-6 cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {page === 1 ? (
          <div className="flex flex-col gap-2 mt-4">
            {availableItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className="flex gap-2 items-center cursor-pointer transition-colors hover:bg-gray-100 rounded-md p-1"
              >
               <img
  className="h-6 w-6"
  alt={item.type}
  src={`${BACKEND_URL}${item.image}`}
/>
                <p>{item.type}</p>
              </div>
            ))}
          </div>
        ) : selectedItem?.type === "Email" ? (
          <EmailMetaData onSave={handleSaveMetaData} />
        ) : (
          <SolanaMetaData onSave={handleSaveMetaData} />
        )}
      </div>
    </div>
  );
};

const EmailMetaData = ({ onSave }: { onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({ to: "", subject: "", body: "" });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="my-4 flex flex-col gap-4">
      <FormInput label="To" name="to" onChange={handleChange} />
      <FormInput label="Subject" name="subject" onChange={handleChange} />
      <textarea
        className="text-black rounded border border-gray-400 p-2 bg-white"
        placeholder="Email content..."
        rows={8}
        name="body"
        onChange={handleChange}
      />
      <Button variant="dark" onClick={() => onSave(formData)}>
        Save
      </Button>
    </div>
  );
};

const SolanaMetaData = ({ onSave }: { onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({ address: "", amount: "" });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="my-4 flex flex-col gap-4">
      <FormInput label="Address" name="address" onChange={handleChange} />
      <FormInput label="Amount" name="amount" onChange={handleChange} />
      <Button variant="dark" onClick={() => onSave(formData)}>
        Save
      </Button>
    </div>
  );
};

export default Modal;