"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { submitSetup, SubmitSetupInput } from "@/lib/api";

interface SetupProps {
  name: string;
  description: string;
  loading: boolean;
  message: string;
  setName: (value: string) => void;
  setDescription: (value: string) => void;
}

const Setup = ({
  name,
  description,
  loading,
  message,
  setName,
  setDescription,
}: SetupProps) => {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Setup</h1>
      <FieldGroup>
        <FieldSet>
          <FieldDescription>
            Identify and Tag this evaluation run
          </FieldDescription>
          <Field>
            <FieldLabel htmlFor="setup-name">
              Name of the evalution run
            </FieldLabel>
            <Input
              id="setup-name"
              placeholder="G4 Stress Test For SN A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
        </FieldSet>

        {/* Description */}
        <Field>
          <FieldLabel htmlFor="setup-description">Description</FieldLabel>
          <Textarea
            id="setup-description"
            placeholder="Sample test for Dim A"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <FieldDescription>A summary of the test run</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  );
};

interface EndpointSelectionProps {
  modelVersion: string;
  apiToken: string;
  testingEndpointUrl: string;
  setModelVersion: (value: string) => void;
  setApiToken: (value: string) => void;
  setTestingEndpointUrl: (value: string) => void;
}

// Model versions available
const MODEL_VERSIONS = [
  "OpenAI GPT-4o",
  "OpenAI GPT-4",
  "OpenAI GPT-3.5-turbo",
  "Anthropic Claude-3",
  "Google Gemini",
  "Meta Llama-2",
];

const EndpointSelection = ({
  modelVersion,
  apiToken,
  testingEndpointUrl,
  setApiToken,
  setModelVersion,
  setTestingEndpointUrl,
}: EndpointSelectionProps) => {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Setup</h1>
      <FieldGroup>
        <FieldSet>
          <FieldDescription>
            Configure the model and access credentials to test against.
          </FieldDescription>
          <FieldLabel>Endpoint Selection</FieldLabel>

          {/* Model Version Dropdown */}
          <Field>
            <FieldLabel htmlFor="model-version">Model Version</FieldLabel>
            <Select value={modelVersion} onValueChange={setModelVersion}>
              <SelectTrigger id="model-version">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_VERSIONS.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              Select the model from the dropdown.
            </FieldDescription>
          </Field>

          {/* API Token */}
          <Field>
            <FieldLabel htmlFor="api-token">API Token</FieldLabel>
            <Input
              id="api-token"
              type="password"
              placeholder="••••••••••••••••"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              required
            />
            <FieldDescription>
              API token or access token for authentication.
            </FieldDescription>
          </Field>

          {/* Testing Endpoint URL */}
          <Field>
            <FieldLabel htmlFor="testing-url">Testing Endpoint URL</FieldLabel>
            <Input
              id="testing-url"
              type="url"
              placeholder="https://api.example.com"
              value={testingEndpointUrl}
              onChange={(e) => setTestingEndpointUrl(e.target.value)}
              required
            />
            <FieldDescription>The endpoint to be tested.</FieldDescription>
          </Field>
        </FieldSet>
      </FieldGroup>
    </div>
  );
};

const SetupForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modelVersion, setModelVersion] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [testingEndpointUrl, setTestingEndpointUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Call the API function
      const response = await submitSetup({
        name,
        description,
        modelVersion,
        apiToken,
        testingEndpointUrl,
      });
      console.log("Response:", response);

      setMessage("✅ Success!");
      setName("");
    } catch (error) {
      setMessage(
        "❌ Error: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-1/2 space-y-6">
      <Setup
        name={name}
        description={description}
        message={message}
        loading={loading}
        setDescription={setDescription}
        setName={setName}
      />

      <EndpointSelection
        modelVersion={modelVersion}
        setModelVersion={setModelVersion}
        apiToken={apiToken}
        setApiToken={setApiToken}
        testingEndpointUrl={testingEndpointUrl}
        setTestingEndpointUrl={setTestingEndpointUrl}
      />

      {message && <p className="text-sm">{message}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

export default SetupForm;
