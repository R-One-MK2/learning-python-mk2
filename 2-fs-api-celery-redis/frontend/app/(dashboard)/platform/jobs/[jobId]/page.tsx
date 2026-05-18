"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";

interface JobDetailsPageProps {
  params: Promise<{
    jobId: string;
  }>;
}

export default function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { jobId } = use(params);
  const [status, setStatus] = useState("processing");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress for now
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setStatus("completed");
          return 100;
        }
        return prev + 10;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (status === "completed") return "bg-green-100 text-green-800";
    if (status === "processing") return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getStatusIcon = () => {
    if (status === "completed") return "✅";
    if (status === "processing") return "🟡";
    return "⏳";
  };

  return (
    <div className="container mx-auto max-w-2xl py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Job Details</h1>
        <p className="mt-2 text-gray-600">ID: {jobId}</p>
      </div>

      {/* Status Card */}
      <div className="mb-6 rounded-lg border border-gray-200 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Status</h2>
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor()}`}
          >
            {getStatusIcon()} {status.toUpperCase()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Job Info */}
      <div className="mb-6 rounded-lg border border-gray-200 p-6">
        <h3 className="mb-4 text-lg font-semibold">Job Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Job ID:</span>
            <span className="font-mono">{jobId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Created:</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="capitalize">{status}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link href="/platform/setup">
          <Button variant="outline">Create New Setup</Button>
        </Link>
        <Link href="/platform/jobs">
          <Button variant="outline">View All Jobs</Button>
        </Link>
      </div>

      {/* Results (shown when completed) */}
      {status === "completed" && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-green-900">
            ✅ Evaluation Complete
          </h3>
          <p className="text-sm text-green-700">
            Your evaluation has been completed. Results are now available.
          </p>
          <Button className="mt-4">View Results</Button>
        </div>
      )}
    </div>
  );
}
