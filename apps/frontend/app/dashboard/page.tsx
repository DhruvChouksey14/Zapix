"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import MainSection from "../../components/MainSection";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import Tooltip from "../../components/Tooltip";
import { formatDateTimeToCustomString, getSessionDetails } from "../../public/helper";

interface Action {
  id: string;
  actionId: string;
  zapId: string;
  sortingOrder: number;
  metadata: Record<string, unknown> | null;
  action: { type: string; image: string };
}

interface Trigger {
  id: string;
  metadata: Record<string, unknown> | null;
  triggerId: string;
  zapId: string;
  trigger: { type: string; image: string };
}

interface Zap {
  id: string;
  name?: string;
  triggerId: string;
  actions: Action[];
  trigger: Trigger;
  createdDate: Date | string;
  isActive: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const session = getSessionDetails();

  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(-1);
  const [renameEnabled, setRenameEnabled] = useState(-1);
  const [data, setData] = useState<{ zaps: Zap[]; total: number }>({ zaps: [], total: 0 });

  // Redirect happens as an effect, not during render - calling hooks after an
  // early return breaks React's rules of hooks.
  useEffect(() => {
    if (!session.token) {
      router.push("/");
    }
  }, [session.token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/zaps", {
        headers: {
          Authorization: session.token,
          "Cache-Control": "no-cache",
        },
      });
      setData({ zaps: response?.data?.data?.zaps ?? [], total: response?.data?.data?.total ?? 0 });
    } catch (error) {
      toast.error("Couldn't fetch your zaps.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClick = () => router.push("/zap");

  const handleUrlCopy = async (url: string) => {
    try {
      await window.navigator.clipboard.writeText(url);
      toast.info("Copied to clipboard!");
    } catch (err) {
      toast.error("Unable to copy to clipboard");
    }
  };

  const handleRenameBlur = async (e: any, zap: Zap) => {
    if (e.target.value === zap.name) {
      setRenameEnabled(-1);
      return;
    }

    setLoading(true);
    try {
      await axios.patch(
        `http://localhost:8000/api/zaps/${zap.id}/rename`,
        { name: e.target.value },
        { headers: { Authorization: session.token } }
      );
      toast.success("Zap renamed successfully!");
      await fetchData();
    } catch (error) {
      toast.error("Could not rename the zap.");
      setLoading(false);
    }
    setRenameEnabled(-1);
  };

  const toggleZapExecution = async (e: any, zap: Zap) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/zaps/${zap.id}/enable`,
        { isActive: e.target.checked },
        { headers: { Authorization: session.token } }
      );
      fetchData();
    } catch (error) {
      toast.error(`Could not ${zap.isActive ? "disable" : "enable"} this zap.`);
    }
  };

  const handleZapDelete = async (zap: Zap) => {
    try {
      await axios.delete(`http://localhost:8000/api/zaps/${zap.id}`, {
        headers: { Authorization: session.token },
      });
      toast.success("Zap deleted successfully.");
      fetchData();
    } catch (error) {
      toast.error("Could not delete the zap.");
    }
  };

  return (
    <MainSection>
      <div className="flex flex-col py-4 px-20 gap-6">
        <div className="flex justify-between items-center">
          <h3 className="text-3xl font-semibold">My Zaps</h3>
          <Button variant="dark" onClick={handleCreateClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" className="size-6">
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="mx-2 my-1">Create</span>
          </Button>
        </div>

        {loading && data.total === 0 ? (
          <div className="flex justify-center py-10">
            <Spinner color="primary" />
          </div>
        ) : data.total === 0 ? (
          <p className="text-gray-600">You haven't created any zaps yet.</p>
        ) : (
          <table>
            <thead>
              <tr className="border-b border-gray-200">
                <th className="font-normal py-3 text-start w-40">Name</th>
                <th className="font-normal py-3 text-start w-40">Flow</th>
                <th className="font-normal py-3 text-start">Webhook URL</th>
                <th className="font-normal py-3 text-start">Created At</th>
                <th className="font-normal py-3 text-center w-20">Status</th>
                <th className="font-normal py-3 text-start"></th>
              </tr>
            </thead>
            <tbody>
              {data.zaps.map((zap, index) => {
                const url = `http://localhost:8000/hooks/${session.user?.id}/${zap.id}`;

                return (
                  <tr key={zap.id} className="border-b border-gray-200">
                    <td className="font-normal py-3 text-start">
                      {index === renameEnabled ? (
                        <input
                          defaultValue={zap.name}
                          autoFocus
                          onBlur={(e) => handleRenameBlur(e, zap)}
                          type="text"
                          className="rounded-md w-full max-w-32 px-2 py-1 border border-gray-300 bg-white"
                        />
                      ) : (
                        <Link
                          className="hover:underline underline-offset-2"
                          href={{ pathname: "/zap", query: { zapId: zap.id } }}
                        >
                          {zap.name}
                        </Link>
                      )}
                    </td>
                    <td className="font-normal py-3 text-start flex gap-1">
                      <Tooltip tooltipText={zap.trigger.trigger.type}>
                        <img className="w-10 border p-[3px] border-gray-500" src= {`http://localhost:8000${zap.trigger.trigger.image}`} />
                      </Tooltip>
                      {zap.actions.map((a) => (
                        <Tooltip key={a.id} tooltipText={a.action.type}>
                          <img className="w-10 p-[3px] border border-gray-500" src={`http://localhost:8000${a.action.image}`} />
                        </Tooltip>
                      ))}
                    </td>
                    <td className="font-normal py-3 text-start">
                      <div className="flex gap-4 items-center">
                        <span className="text-sm text-gray-600 truncate max-w-xs">{url}</span>
                        <svg
                          onClick={() => handleUrlCopy(url)}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          fill="none"
                          stroke="#ff4f00"
                          className="size-6 cursor-pointer shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                          />
                        </svg>
                      </div>
                    </td>
                    <td className="font-normal py-3 text-start">{formatDateTimeToCustomString(zap.createdDate)}</td>
                    <td className="font-normal py-3 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={zap.isActive}
                          onChange={(e) => toggleZapExecution(e, zap)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff4f00]" />
                      </label>
                    </td>
                    <td
                      onClick={() => setSelectedRow(selectedRow === index ? -1 : index)}
                      className="font-normal py-4 text-start w-5 cursor-pointer relative"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path
                          fillRule="evenodd"
                          d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {index === selectedRow && (
                        <div className="absolute bg-white px-3 py-2 flex flex-col gap-2 right-5 -top-1 border border-gray-300 rounded-md z-50">
                          <button
                            onClick={() => setRenameEnabled(index)}
                            className="hover:bg-orange-50 flex items-center gap-1 text-[#ff4f00] py-1 px-2 rounded-md text-left"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                            Rename
                          </button>
                          <button
                            onClick={() => handleZapDelete(zap)}
                            className="hover:bg-red-50 flex items-center gap-1 text-red-600 py-1 px-2 rounded-md text-left"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </MainSection>
  );
}