import {isNullOrUndefined} from 'util';

export type BackgroundTaskStatus = 'STARTED' | 'RUNNING' | 'PAUSED' | 'STOPPED' | 'TERMINATED';

export interface BackgroundTask {
    id: string;
    jobs: BackgroundTaskJob[];
    status?: BackgroundTaskStatus;
    data?: any | null;
}

export interface BackgroundTaskMessage {
    taskId: string;
    taskData?: any | null;
    taskStatus: BackgroundTaskStatus;
    progress: BackgroundTaskProgress;
}

export interface BackgroundTaskProgress {
    totalJobs?: number | 0;
    doneJobs?: number | 0;
    progressPercent?: number | 0;
}

export interface BackgroundTaskJob {
    id: string;
    name?: string | 'Hi! System - Task';
    data?: any | null;
}

interface JobWrapper {
    job: BackgroundTaskJob;
    canceled?: boolean | false;
    timeout?: number | 1000;
    deleteOnCancel?: boolean | true;
}

/**
 * Jobs manager
 */
export class JobManager {
    private pendingJobs: Map<string, JobWrapper> = new Map<string, JobWrapper>();

    findPendingJob = (jobId: string) => {
        return this.pendingJobs.get(jobId);
    }

    cancelJob = (jobId: string) => {
        const job: JobWrapper = this.findPendingJob(jobId);
        if (!isNullOrUndefined(job)) {
            job.canceled = true;
            job.deleteOnCancel && this.pendingJobs.delete(jobId);
        }
    }

    performJob = (
        job: BackgroundTaskJob,
        onJobOver: (job: BackgroundTaskJob, success: boolean) => void,
        timeout?: number | 1000,
        deleteOnCancel?: boolean | true,
    ) => {
        this.pendingJobs.set(job.id, {
            job: job,
            timeout: timeout,
            deleteOnCancel: deleteOnCancel,
        });

        // simple timeout call back in this example.
        const timeoutInMs = this.pendingJobs.get(job.id).timeout || 1000;
        const timeoutInstance: number = window.setTimeout(() => {
            onJobOver(job, !this.pendingJobs.get(job.id).canceled);
            window.clearTimeout(timeoutInstance);
        }, timeoutInMs);
    }
}

/**
 * Jobs queue
 */
export class JobQueue {

    constructor(private _jobs: BackgroundTaskJob[]) {}

    jobs = (): BackgroundTaskJob[] => {
        this._jobs = (isNullOrUndefined(this._jobs) ? [] : this._jobs);
        return this._jobs;
    }

    addJobs = (...jobs: BackgroundTaskJob[]) => {
        this.jobs().push(...jobs);
    }

    getJob = (): BackgroundTaskJob | null => {
        return this.jobs().shift();
    }

    isEmpty = (): boolean => {
        return !this.jobs().length;
    }
}
