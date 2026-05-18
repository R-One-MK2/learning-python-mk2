/**
 * Job Details Page
 *
 * Displays comprehensive information about a single job including:
 * - Current status and progress tracking
 * - Evaluation configuration (model, judges, pillars, test ratio)
 * - Job metadata (name, description, creation date)
 * - Navigation links and action buttons
 *
 * Data is fetched directly from the backend API via job ID from URL params.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { getJob } from "@/lib/api";
import type { Job } from "@/lib/api";

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

/**
 * Get Tailwind CSS classes for job status badge background/text color
 * @param status - Job status (pending, processing, completed, failed)
 * @returns Tailwind class string for styling
 */
const getStatusColor = (status: string) => {
  if (status === "completed") return "bg-green-100 text-green-800";
  if (status === "processing") return "bg-blue-100 text-blue-800";
  return "bg-yellow-100 text-yellow-800";
};

/**
 * Get emoji icon representing job status
 * @param status - Job status
 * @returns Emoji string for visual representation
 */
const getStatusIcon = (status: string) => {
  if (status === "completed") return "✅";
  if (status === "processing") return "🟡";
  return "⏳";
};

// ============================================================================
// UI COMPONENTS
// ============================================================================

/**
 * Breadcrumb navigation showing: Setup > Jobs > [JobId]
 * Provides quick navigation back to setup or jobs list
 */
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

/**
 * Header section with job title and ID
 */
interface JobHeaderProps {
  jobId: string;
  name?: string;
}

const JobHeader = ({ jobId, name }: JobHeaderProps) => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold">{name || "Job Details"}</h1>
    <p className="mt-2 text-gray-600">ID: {jobId}</p>
  </div>
);

/**
 * Status card showing current job status and progress bar
 * Progress bar is only shown for non-completed jobs
 */
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
  name?: string;
  description?: string;
  createdAt?: string;
  modelVersion?: string;
}

const JobInfoCard = ({
  jobId,
  status,
  name,
  description,
  createdAt,
  modelVersion,
}: JobInfoCardProps) => (
  <div className="mb-6 rounded-lg border border-gray-200 p-6">
    <h3 className="mb-4 text-lg font-semibold">Job Information</h3>
    <div className="space-y-3 text-sm">
      {name && (
        <div className="flex justify-between">
          <span className="text-gray-600">Name:</span>
          <span className="font-medium">{name}</span>
        </div>
      )}
      {description && (
        <div className="flex justify-between">
          <span className="text-gray-600">Description:</span>
          <span className="text-gray-700">{description}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-gray-600">Job ID:</span>
        <span className="font-mono">{jobId}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Created:</span>
        <span suppressHydrationWarning>
          {createdAt
            ? new Date(createdAt).toLocaleString()
            : new Date().toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Status:</span>
        <span className="capitalize">{status}</span>
      </div>
      {modelVersion && (
        <div className="flex justify-between">
          <span className="text-gray-600">Model Version:</span>
          <span>{modelVersion}</span>
        </div>
      )}
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

interface EvaluationParametersProps {
  setup?: {
    modelVersion: string;
    testRatio: string;
    judges: string[];
    pillars: string[];
    tags: string[];
  };
}

const EvaluationParametersSection = ({ setup }: EvaluationParametersProps) => {
  if (!setup) return null;

  const hasData =
    setup.modelVersion ||
    setup.testRatio ||
    setup.judges.length > 0 ||
    setup.pillars.length > 0 ||
    setup.tags.length > 0;

  if (!hasData) return null;

  return (
    <div className="mb-6 rounded-lg border border-gray-200 p-6">
      <h3 className="mb-4 text-lg font-semibold">Evaluation Parameters</h3>
      <div className="space-y-4">
        {setup.modelVersion && (
          <div>
            <span className="text-sm font-medium text-gray-600">
              Model Version:
            </span>
            <p className="mt-1 text-sm">{setup.modelVersion}</p>
          </div>
        )}

        {setup.testRatio && (
          <div>
            <span className="text-sm font-medium text-gray-600">
              Test Ratio:
            </span>
            <p className="mt-1 text-sm capitalize">{setup.testRatio}</p>
          </div>
        )}

        {setup.judges.length > 0 && (
          <div>
            <span className="text-sm font-medium text-gray-600">
              Judge Frameworks:
            </span>
            <div className="mt-1 flex flex-wrap gap-2">
              {setup.judges.map((judge) => (
                <span
                  key={judge}
                  className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                >
                  {judge}
                </span>
              ))}
            </div>
          </div>
        )}

        {setup.tags.length > 0 && (
          <div>
            <span className="text-sm font-medium text-gray-600">Tags:</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {setup.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {setup.pillars.length > 0 && (
          <div>
            <span className="text-sm font-medium text-gray-600">
              Evaluation Pillars:
            </span>
            <div className="mt-2 flex-1">
              {setup.pillars.map((pillar) => (
                <div key={pillar} className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">{pillar}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await getJob(jobId);
        setJob(data);
        setProgress(data.progress);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  useEffect(() => {
    // Only simulate progress if not already completed/failed
    if (job && job.status !== "completed" && job.status !== "failed") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 100;
          }
          return prev + 10;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [job]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl py-12">
        <div className="text-center text-gray-500">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto max-w-6xl py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Error loading job: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-12">
      <BreadcrumbSection jobId={jobId} />
      <JobHeader jobId={jobId} name={job.name} />
      <StatusCard status={job.status} progress={progress} />
      <JobInfoCard
        jobId={jobId}
        status={job.status}
        name={job.name}
        description={job.description}
        createdAt={job.createdAt}
        modelVersion={job.setup?.modelVersion}
      />
      <EvaluationParametersSection setup={job.setup} />
      <ActionsSection />
      {job.status === "completed" && <ResultsSection />}
    </div>
  );
}
