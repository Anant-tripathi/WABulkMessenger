import React, { useState, useCallback } from "react";
import { ChevronRight, Upload, X, CheckCircle } from "lucide-react";
import Papa from "papaparse";
const CSVUploadPage = ({ contacts, setContacts, setActiveStep }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processCSV(file);
  }, []);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processCSV(file);
  };

  const processCSV = useCallback(
    (file) => {
      Papa.parse(file, {
        complete: (result) => {
          const rawData = result.data;
          const parsedContacts = rawData
            .slice(1)
            .map((row, index) => ({
              id: index + 1,
              name: row[0]?.trim() || "",
              number: row[1]?.trim() || "",
              valid: validateNumber(row[1]),
            }))
            .filter((contact) => contact.name || contact.number);

          setContacts(parsedContacts);
          setFileUploaded(true);
        },
        skipEmptyLines: true,
      });
    },
    [setContacts],
  );

  const validateNumber = useCallback((number) => {
    return /^\+91\s?\d{10}$/.test(number);
  }, []);

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Upload CSV File</h1>
        <p className="text-gray-600">
          Upload your contact list with names and WhatsApp numbers
        </p>
      </div>
      {!fileUploaded ? (
        <div
          className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload size={28} className="text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-700">
              Drag & Drop your CSV file here
            </h3>
            <p className="mb-4 text-sm text-gray-500">or</p>
            <label className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors">
              Browse Files
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".csv"
              />
            </label>
            <p className="mt-4 text-xs text-gray-500">
              Your CSV should include columns for "name" and "number" (with
              country code)
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded">
                <CheckCircle size={16} className="text-green-600" />
              </div>
              <span className="ml-2 font-medium">
                contacts.csv uploaded successfully
              </span>
            </div>
            <button
              onClick={() => setFileUploaded(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4 flex-1 overflow-auto">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium">
                {contacts.length} contacts found •
                <span className="text-green-600">
                  {" "}
                  {contacts.filter((c) => c.valid).length} valid
                </span>{" "}
                •
                <span className="text-red-600">
                  {" "}
                  {contacts.filter((c) => !c.valid).length} invalid
                </span>
              </span>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      WhatsApp Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className={contact.valid ? "" : "bg-red-50"}
                    >
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {contact.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {contact.name || "Missing name"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {contact.number}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {contact.valid ? (
                          <span className="px-2 inline-flex text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                            Valid
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                            Invalid format
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t bg-gray-50 flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              onClick={() => setActiveStep(1)}
            >
              Continue <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CSVUploadPage;
