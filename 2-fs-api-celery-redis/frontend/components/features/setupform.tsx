"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Lock, Settings, Plug, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitSetup } from "@/lib/api";

const TEST_RATIOS = [
  { value: "small", label: "Small", count: "50 samples" },
  { value: "medium", label: "Medium", count: "250 samples" },
  { value: "large", label: "Large", count: "1,000 samples" },
];

const JUDGES = [
  {
    id: "laaj",
    label: "LaaJ",
    meta: "Dimension A · native evaluation service",
  },
  {
    id: "moonshot",
    label: "Moonshot",
    meta: "IMDA · red-team & adversarial",
  },
  { id: "aidx", label: "AIDX", meta: "Fairness · drift · OOD" },
];

const PILLARS = [
  "Transparency",
  "Explainability",
  "Repeatability / Reproducibility",
  "Safety",
  "Security",
  "Robustness",
  "Fairness",
  "Data Governance",
  "Accountability",
  "Human Agency & Oversight",
  "Inclusive Growth, Societal & Environmental Well-being",
];

export default function SetupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [modelVersion, setModelVersion] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [testingEndpointUrl, setTestingEndpointUrl] = useState("");
  const [testRatio, setTestRatio] = useState("");
  const [judges, setJudges] = useState<Set<string>>(new Set());
  const [pillars, setPillars] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const setupComplete = name.trim() !== "" && description.trim() !== "";
  const endpointComplete =
    modelVersion !== "" &&
    apiToken.trim() !== "" &&
    testingEndpointUrl.trim() !== "";
  const parametersComplete =
    testRatio !== "" && judges.size > 0 && pillars.size > 0;
  const allComplete = setupComplete && endpointComplete && parametersComplete;

  const toggleSet = (set: Set<string>, key: string) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allComplete) return;

    setLoading(true);
    setMessage("");

    try {
      await submitSetup({
        name,
        description,
        tags,
        modelVersion,
        apiToken,
        testingEndpointUrl,
        testRatio,
        judges: Array.from(judges),
        pillars: Array.from(pillars),
      });

      router.push("/platform/jobs");
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
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-8 py-3">
        <div className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
          <span>Platform</span>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-foreground">New Evaluation</span>
        </div>
      </div>

      <form className="max-w-3xl space-y-6 px-8 py-10" onSubmit={handleSubmit}>
        {/* Setup Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Setup</CardTitle>
            </div>
            <CardDescription>
              Identify and tag this evaluation run.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Q4 Stress Test for Dim A"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A summary of the test run, including any important details for reviewers."
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tags</label>
              <Input
                value={tags.join(", ")}
                onChange={(e) =>
                  setTags(e.target.value.split(",").map((t) => t.trim()))
                }
                placeholder="production, q4-testing"
              />
            </div>

            {setupComplete && (
              <div className="text-sm text-green-600">✓ Setup complete</div>
            )}
          </CardContent>
        </Card>

        {/* Endpoint Selection Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Plug className="h-5 w-5" />
              <CardTitle>Endpoint Selection</CardTitle>
            </div>
            <CardDescription>
              Configure the model and access credentials to test against.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Model Version *</label>
              <Select value={modelVersion} onValueChange={setModelVersion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">OpenAI GPT-4o</SelectItem>
                  <SelectItem value="gpt-4o-mini">
                    OpenAI GPT-4o-mini
                  </SelectItem>
                  <SelectItem value="gpt-4">OpenAI GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">
                    OpenAI GPT-3.5-turbo
                  </SelectItem>
                  <SelectItem value="claude-opus">Claude Opus 4.7</SelectItem>
                  <SelectItem value="claude-sonnet">
                    Claude Sonnet 4.6
                  </SelectItem>
                  <SelectItem value="gemini-pro">Gemini 1.5 Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">API Token *</label>
              <Input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="xxxx-xxxxxx-xxxxxx-xxxxxxx"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Testing Endpoint URL *
              </label>
              <Input
                type="url"
                value={testingEndpointUrl}
                onChange={(e) => setTestingEndpointUrl(e.target.value)}
                placeholder="https://example.com/testing-endpoint"
              />
            </div>

            {endpointComplete && (
              <div className="text-sm text-green-600">
                ✓ Endpoint configured
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evaluation Parameters Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              <CardTitle>Evaluation Parameters</CardTitle>
            </div>
            <CardDescription>
              Sample size, judge frameworks, and evaluation pillars.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test Ratio */}
            <div>
              <label className="mb-3 block text-sm font-medium">
                Test Ratio *
              </label>
              <div className="space-y-2">
                {TEST_RATIOS.map((r) => (
                  <label
                    key={r.value}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="radio"
                      value={r.value}
                      checked={testRatio === r.value}
                      onChange={(e) => setTestRatio(e.target.value)}
                      className="h-4 w-4"
                    />
                    <span className="w-20 text-sm font-medium">{r.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {r.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Judge Selection */}
            <div>
              <label className="mb-3 block text-sm font-medium">Judges *</label>
              <div className="space-y-2">
                {JUDGES.map((j) => (
                  <label
                    key={j.id}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={judges.has(j.id)}
                      onChange={() => setJudges(toggleSet(judges, j.id))}
                      className="h-4 w-4"
                    />
                    <span className="w-24 text-sm font-medium">{j.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {j.meta}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pillars Selection */}
            <div>
              <label className="mb-3 block text-sm font-medium">
                Evaluation Pillars *
              </label>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {PILLARS.map((p) => (
                  <label
                    key={p}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={pillars.has(p)}
                      onChange={() => setPillars(toggleSet(pillars, p))}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{p}</span>
                  </label>
                ))}
              </div>
            </div>

            {parametersComplete && (
              <div className="text-sm text-green-600">
                ✓ Parameters configured
              </div>
            )}
          </CardContent>
        </Card>

        {message && <p className="text-sm text-red-600">{message}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" size="lg" disabled={!allComplete || loading}>
            {allComplete ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Run Evaluation
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Complete all sections
              </>
            )}
          </Button>
          {!allComplete && (
            <p className="text-muted-foreground text-xs">
              Complete all sections to unlock.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
