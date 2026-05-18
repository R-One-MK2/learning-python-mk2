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
import { submitSetup, SubmitSetupInput } from "@/lib/api";

const SetupForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Call the API function
      const response = await submitSetup({ name, description });
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
      <FieldGroup>
        <FieldSet>
          <FieldLabel htmlFor="setup-name">Name</FieldLabel>
          <FieldDescription>Name of the evaluation run</FieldDescription>
          <Field>
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
        {message && <p className="text-sm">{message}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default SetupForm;
