import React, { useEffect, useState } from "react";
import { ChevronRight, Smile, Paperclip, MapPin } from "lucide-react";

const MessageDraftingPage = ({
  contacts,
  setActiveStep,
  message,
  setMessage,
  location,
  setLocation,
  setFinalMessages,
  attachments,
  setAttachments,
}) => {
  useEffect(() => {
    setFinalMessages(
      contacts
        .filter((contact) => contact.valid) // Remove invalid contacts
        .map((contact) => ({
          id: contact.id,
          number: contact.number,
          message: message.replace("{{name}}", contact.name), // Replace name placeholder
        })),
    );
  }, [message, contacts]); // Added "contacts" to dependency array

  const [previewName, setPreviewName] = useState("John");

  const [locationUrl, setLocationUrl] = useState("");

  // Convert WhatsApp formatting to HTML for preview
  const formatWhatsAppText = (text) => {
    return text
      .replace(/\*(.*?)\*/g, "<b>$1</b>") // Bold
      .replace(/_(.*?)_/g, "<i>$1</i>") // Italic
      .replace(/~(.*?)~/g, "<s>$1</s>"); // Strikethrough
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (attachments.length + files.length > 5) {
      alert("You can upload a maximum of 5 files.");
      return;
    }
    setAttachments([...attachments, ...files]);
  };
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleLocationChange = (e) => {
    const loc = e.target.value;
    setLocation(loc);
    setLocationUrl(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`,
    );
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-scroll">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Draft Your Message</h1>
        <p className="text-gray-600">
          Create your WhatsApp message with personalization
        </p>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Message Editor */}
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-medium">Message Editor</h3>
            <p className="text-xs text-gray-500">
              Use name within two braces to personalize for each contact
            </p>
          </div>

          <div className="p-4 flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-48 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Type your message here..."
            />

            <div className="mt-4 flex border rounded-md">
              <div className="flex items-center space-x-2 p-2">
                <button className="p-1.5 rounded hover:bg-gray-100">
                  <Smile size={20} className="text-gray-500" />
                </button>
                <button className="p-1.5 rounded hover:bg-gray-100">
                  <Paperclip size={20} className="text-gray-500" />
                </button>
                <button className="p-1.5 rounded hover:bg-gray-100">
                  <MapPin size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="border-l p-2 flex items-center text-xs text-gray-500">
                <span>Use formatting: *bold*, _italic_, ~strikethrough~</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Attachments</h4>
              <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="fileUpload"
                  onChange={handleFileUpload}
                  accept="image/*, video/*, application/pdf"
                />
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer text-blue-600"
                >
                  Click to Upload Files
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Max 5 files, 16MB each
                </p>
              </div>
              {attachments.length > 0 && (
                <ul className="mt-4 border rounded-md p-3">
                  {attachments.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center text-sm border-b last:border-b-0 p-2"
                    >
                      {file.name}
                      <button
                        className="text-red-500 text-xs"
                        onClick={() => removeAttachment(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Location */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Location (Optional)</h4>
              <input
                type="text"
                value={location}
                onChange={() => handleLocationChange}
                placeholder="Enter a location"
                className="w-full p-2 border rounded-md text-sm"
              />
              {locationUrl && (
                <p className="mt-2 text-sm text-blue-600 underline cursor-pointer">
                  <a
                    href={locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Google Maps
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="w-96 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="font-medium">Live Preview</h3>
            <div className="flex items-center text-sm">
              <span className="mr-2">Preview as:</span>
              <input
                type="text"
                value={previewName}
                onChange={(e) => setPreviewName(e.target.value)}
                className="w-24 p-1 border rounded text-sm"
              />
            </div>
          </div>

          <div className="flex-1 bg-[#e5ddd5] overflow-y-auto p-4">
            <div className="flex justify-end mb-4">
              <div className="max-w-xs bg-[#d9fdd3] rounded-lg p-3 shadow-sm">
                <p
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: formatWhatsAppText(
                      message.replace("{{name}}", previewName),
                    ),
                  }}
                />
                <p className="text-right text-xs text-gray-500 mt-1">
                  10:23 AM ✓✓
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors mr-2">
          Back
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={() => setActiveStep(2)}
        >
          Continue <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};
export default MessageDraftingPage;
