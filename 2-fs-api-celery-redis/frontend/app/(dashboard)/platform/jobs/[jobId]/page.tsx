"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface JobDetailsPageProps {
  params: Promise<{
    jobId: string;
  }>;
}

// Helper functions
const getStatusColor = (status: string) => {
  if (status === "completed") return "bg-green-100 text-green-800";
  if (status === "processing") return "bg-blue-100 text-blue-800";
  return "bg-yellow-100 text-yellow-800";
};

const getStatusIcon = (status: string) => {
  if (status === "completed") return "✅";
  if (status === "processing") return "🟡";
  return "⏳";
};

// Components
interface BreadcrumbSectionProps {
  jobId: string;
}

const BreadcrumbSection = ({ jobId }: BreadcrumbSectionProps) => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/platform/jobs">Setup</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/platform/jobs">Jobs</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>{jobId}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

interface JobHeaderProps {
  jobId: string;
}

const JobHeader = ({ jobId }: JobHeaderProps) => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold">Job Details</h1>
    <p className="mt-2 text-gray-600">ID: {jobId}</p>
  </div>
);

interface StatusCardProps {
  status: string;
  progress: number;
}

const StatusCard = ({ status, progress }: StatusCardProps) => (
  <div className="mb-6 rounded-lg border border-gray-200 p-6">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-semibold">Status</h2>
      <span
        className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(status)}`}
      >
        {getStatusIcon(status)} {status.toUpperCase()}
      </span>
    </div>

    {/* Progress Bar - Only show for processing jobs */}
    {status !== "completed" && (
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
    )}
  </div>
);

interface JobInfoCardProps {
  jobId: string;
  status: string;
}

const JobInfoCard = ({ jobId, status }: JobInfoCardProps) => (
  <div className="mb-6 rounded-lg border border-gray-200 p-6">
    <h3 className="mb-4 text-lg font-semibold">Job Information</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Job ID:</span>
        <span className="font-mono">{jobId}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Created:</span>
        <span suppressHydrationWarning>{new Date().toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Status:</span>
        <span className="capitalize">{status}</span>
      </div>
    </div>
  </div>
);

const ActionsSection = () => (
  <div className="flex gap-4">
    <Link href="/platform/setup">
      <Button variant="outline">Create New Setup</Button>
    </Link>
    <Link href="/platform/jobs">
      <Button variant="outline">View All Jobs</Button>
    </Link>
  </div>
);

const ResultsSection = () => (
  <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6">
    <h3 className="mb-2 text-lg font-semibold text-green-900">
      ✅ Evaluation Complete
    </h3>
    <p className="text-sm text-green-700">
      Your evaluation has been completed. Results are now available.
    </p>
    <Button className="mt-4">View Results</Button>
  </div>
);

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

  return (
    <div className="container mx-auto max-w-6xl py-12">
      <BreadcrumbSection jobId={jobId} />
      <JobHeader jobId={jobId} />
      <StatusCard status={status} progress={progress} />
      <JobInfoCard jobId={jobId} status={status} />
      <ActionsSection />
      {status === "completed" && <ResultsSection />}
    </div>
  );
}
