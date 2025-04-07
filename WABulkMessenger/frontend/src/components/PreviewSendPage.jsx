import React, { useEffect, useState, useCallback } from "react";
import { Send, Search } from "lucide-react";
import axios from "axios";

const PreviewSendPage = ({
  contacts,
  finalMessages,
  location,
  attachments,
  setActiveStep,
}) => {
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSend = async () => {
    setSending(true);
    setProgress(0);
    const newStatuses = {};

    for (let index = 0; index < contacts.length; index++) {
      const contact = contacts[index];
      const msg = finalMessages.find((m) => m.number === contact.number);
      const attachment = attachments ? attachments[index] : null;

      const formData = new FormData();
      formData.append("contact", contact.number);
      formData.append("message", msg ? msg.message : "Default message");
      if (attachment) formData.append("attachment", attachment);
      formData.append("location", location);

      try {
        const response = await axios.post(
          "http://localhost:5000/send",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        const result = response.data.results?.[0];
        newStatuses[contact.number] = result.success ? "sent" : "failed";
      } catch (error) {
        newStatuses[contact.id] = "failed";
      }

      setProgress(((index + 1) / contacts.length) * 100);

      if (index < contacts.length - 1) {
        const randomDelay =
          Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000;
        await sleep(randomDelay);
      }
    }

    setSending(false);
    setShowSuccessModal(true);
  };
  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Preview & Send Messages
        </h1>
        <p className="text-gray-600">
          Review your messages before sending them.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-medium">
              {contacts.length} contacts selected
            </span>
            <span className="mx-2">•</span>
            <span className="text-sm text-gray-500">
              All messages look good
            </span>
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search contacts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Message Preview
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts
                .filter((contact) =>
                  contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="font-medium text-gray-600">
                            {contact.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contact.number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {finalMessages.find((m) => m.number === contact.number)
                          ?.message || "Default message"}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-gray-50">
          {!sending ? (
            <div className="flex justify-between items-center">
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                Back
              </button>
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <Send size={16} className="mr-2" />
                Send Messages
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Sending messages...</span>
                <span className="text-sm font-medium">
                  {progress.toFixed(0)}% complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-500 flex justify-between">
                <span>
                  Sent: {Math.floor((progress / 100) * contacts.length)} of{" "}
                  {contacts.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-green-700">
              Messages Sent Successfully!
            </h2>
            <p className="text-gray-700 mb-4">
              All messages have been processed. You may now choose to send more
              or close this window.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setProgress(0);
                  setActiveStep(0);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send More Messages
              </button>

              <button
                onClick={() => window.close()}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PreviewSendPage;
