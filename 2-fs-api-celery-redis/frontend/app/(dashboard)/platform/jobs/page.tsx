"use client";
import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getJobs } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Job {
  id: string;
  name: string;
  description: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  progress: number;
  setup: {
    modelVersion: string;
    apiToken: string;
    testingEndpointUrl: string;
    testRatio: string;
    judges: string[];
    pillars: string[];
    tags: string[];
  };
}

// Helper functions
const getStatusColor = (status: Job["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: Job["status"]) => {
  switch (status) {
    case "completed":
      return "🟢";
    case "processing":
      return "🟠";
    case "pending":
      return "🟡";
    case "failed":
      return "🔴";
    default:
      return "❓";
  }
};

// Sub-components
const JobBreadcrumb = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/platform/setup">Setup</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Jobs</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

const JobsHeader = () => (
  <div className="mb-8 flex items-center justify-between">
    <div>
      <h1 className="text-4xl font-bold">Jobs</h1>
      <p className="mt-2 text-gray-600">Monitor your evaluation runs</p>
    </div>
    <Link href="/platform/setup">
      <Button>New Evaluation</Button>
    </Link>
  </div>
);

const JobCard = ({ job }: { job: Job }) => (
  <Link key={job.id} href={`/platform/jobs/${job.id}`}>
    <div className="cursor-pointer rounded-lg border border-gray-200 p-6 transition-all hover:border-blue-400 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold">{job.name}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(job.status)}`}
            >
              {getStatusIcon(job.status)} {job.status.toUpperCase()}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{job.description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 space-y-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Progress</span>
          <span>{job.progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${job.progress}%` }}
          />
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>ID: {job.id}</span>
        <span suppressHydrationWarning>
          {new Date(job.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  </Link>
);

interface RunningJobsSectionProps {
  jobs: Job[];
}

const RunningJobsSection = ({ jobs }: RunningJobsSectionProps) => (
  <div className="mb-12">
    <h2 className="mb-4 text-2xl font-bold">Running Jobs</h2>
    <div className="flex space-y-4 space-x-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  </div>
);

interface CompletedJobsTableProps {
  jobs: Job[];
}

const CompletedJobsTable = ({ jobs }: CompletedJobsTableProps) => {
  const router = useRouter();

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">History</h2>
      <div className="rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow
                key={job.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  router.push(`/platform/jobs/${job.id}`);
                }}
              >
                <TableCell className="font-medium">{job.name}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {job.description}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(job.status)}`}
                  >
                    {getStatusIcon(job.status)} {job.status}
                  </span>
                </TableCell>
                <TableCell
                  className="text-sm text-gray-500"
                  suppressHydrationWarning
                >
                  {new Date(job.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-gray-500">
                  {job.id}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const JobsEmptyState = () => (
  <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
    <p className="mb-4 text-gray-500">No jobs yet</p>
    <Link href="/platform/setup">
      <Button>Create Your First Evaluation</Button>
    </Link>
  </div>
);

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl py-12">
        <JobBreadcrumb />
        <JobsHeader />
        <div className="text-center text-gray-500">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-6xl py-12">
        <JobBreadcrumb />
        <JobsHeader />
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Error loading jobs: {error}
        </div>
      </div>
    );
  }

  // Separate running and completed jobs
  const runningJobs = jobs.filter((job) =>
    ["pending", "processing"].includes(job.status),
  );
  const completedJobs = jobs.filter((job) =>
    ["completed", "failed"].includes(job.status),
  );

  return (
    <div className="container mx-auto max-w-6xl py-12">
      <JobBreadcrumb />
      <JobsHeader />

      {runningJobs.length > 0 && <RunningJobsSection jobs={runningJobs} />}
      {completedJobs.length > 0 && <CompletedJobsTable jobs={completedJobs} />}
      {runningJobs.length === 0 && completedJobs.length === 0 && (
        <JobsEmptyState />
      )}
    </div>
  );
}
