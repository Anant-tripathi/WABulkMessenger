import React, { useState, useEffect } from "react";
import CSVUploadPage from "./components/CSVUploadPage";
import PreviewSendPage from "./components/PreviewSendPage";
import MessageDraftingPage from "./components/MessageDraftingPage";

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState(
    "hi {{name}}, check out our new products!",
  );
  const [location, setLocation] = useState(
    "https://maps.app.goo.gl/1qjgknkqknwb4bvq6",
  );

  const [finalMessages, setFinalMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const steps = [
    { id: 0, title: "upload csv", icon: <upload size={20} /> },
    { id: 1, title: "draft message", icon: <messagesquare size={20} /> },
    { id: 2, title: "preview & send", icon: <send size={20} /> },
  ];

  useEffect(() => {
    console.log("final messages:", finalMessages);
    console.log("location:", location);
    console.log("attachments: ", attachments);
    console.log("contacts", contacts);
  }, [finalMessages, location]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 flex flex-col ${sidebarCollapsed ? "w-16" : "w-64"}`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h1
            className={`font-bold text-lg text-blue-600 transition-opacity ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
          >
            whatsapp bulk
          </h1>
          <button
            onclick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            {sidebarCollapsed ? (
              <chevronright size={20} />
            ) : (
              <chevronleft size={20} />
            )}
          </button>
        </div>

        <div className="flex-1 py-4">
          {steps.map((step) => (
            <button
              key={step.id}
              onclick={() => setActiveStep(step.id)}
              className={`w-full flex items-center p-3 mb-2 transition-all ${
                activeStep === step.id
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center">
                {step.icon}
              </div>
              <span
                className={`ml-3 transition-opacity ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
              >
                {step.title}
              </span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t">
          <div
            className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"}`}
          >
            <div
              className={`flex items-center transition-opacity ${sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"}`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                us
              </div>
              <span className="ml-2 text-sm font-medium">user</span>
            </div>
            <button className="p-1 rounded-full hover:bg-gray-100">
              <svg
                width="20"
                height="20"
                fill="none"
                strokewidth="1.5"
                stroke="currentcolor"
                viewbox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  strokelinecap="round"
                  strokelinejoin="round"
                ></path>
                <path
                  d="m15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  strokelinecap="round"
                  strokelinejoin="round"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 overflow-hidden">
        {activeStep === 0 && (
          <CSVUploadPage
            contacts={contacts}
            setContacts={setContacts}
            setActiveStep={setActiveStep}
          />
        )}
        {activeStep === 1 && (
          <MessageDraftingPage
            contacts={contacts}
            setActiveStep={setActiveStep}
            message={message}
            setMessage={setMessage}
            location={location}
            setLocation={setLocation}
            attachments={attachments}
            setAttachments={setAttachments}
            setFinalMessages={setFinalMessages}
          />
        )}
        {activeStep === 2 && (
          <PreviewSendPage
            contacts={contacts}
            finalMessages={finalMessages}
            location={location}
            attachments={attachments}
            setActiveStep={setActiveStep}
          />
        )}
      </div>
    </div>
  );
}
