import {Injectable} from '@angular/core';
import {BackgroundWorker, WorkerActionListener, WorkerProperties} from './background.task.listener';
import {environment} from '../../../environments/environment';
import {BackgroundTask, BackgroundTaskMessage, JobManager, JobQueue} from './background.task.model';
import {Observable} from 'rxjs';

export type WorkerAction = 'start' | 'stop' | 'pause' | 'resume';

@Injectable()
export class WorkerService {
    private properties: WorkerProperties = {
        baseLocation: location.origin,
        debug: environment.mock,
        concurrentJobs: 1,
    };

    private workerURL: string;
    private workers: Map<string, Worker> = new Map<string, Worker>();

    startTask(task: BackgroundTask): Observable<BackgroundTaskMessage> {
        const worker = new Worker(this.getOrCreateWorkerUrl());
        this.workers.set(task.id, worker);
        return this.createWorkerObservableForTask(worker, task);
    }

    findWorker = (taskId: string) => {
        return this.workers.get(taskId);
    };

    pauseTask(taskId: string) {
        this.notify(taskId, 'pause', taskId);
    }

    resumeTask(taskId: string) {
        this.notify(taskId, 'resume', taskId);
    }

    stopTask(taskId: string) {
        this.notify(taskId, 'stop', taskId);
    }

    private createWorkerObservableForTask(worker: Worker, task: BackgroundTask): Observable<BackgroundTaskMessage> {
        return new Observable((observer: any) => {
            worker.addEventListener('message', event => {
                const message: BackgroundTaskMessage = event.data || {};
                if (message.taskId === task.id) {
                    observer.next(message);
                    if (message.taskStatus === 'TERMINATED') {
                        observer.complete();
                        worker.terminate();
                    }
                }
            });
            worker.addEventListener('error', error => observer.error(error));
            this.notify(task.id, 'start', task);
        });
    }

    private getOrCreateWorkerUrl(): string {
        if (!this.workerURL) {
            this.workerURL = this.createWorkerUrl();
        }
        return this.workerURL;
    }

    private notify(taskId: string, action: WorkerAction, payload: any) {
        if (this.workers.has(taskId)) {
            this.workers.get(taskId).postMessage({ action, payload });
        }
    }

    /**
     * Add the message event listener to the worker.
     */
    private createWorkerUrl(): string {
        const webWorkerTemplate = `
            ${this.createWorkerTemplate()}
            self.addEventListener('message', function(event) {
                var listener = function ${this.workerListener.toString()};
                listener(worker, event.data.action, event.data.payload);
            });`;
        return URL.createObjectURL(new Blob([webWorkerTemplate], { type: 'text/javascript' }));
    }

    /**
     * The magic part.
     */
    private createWorkerTemplate(): string {
        return `
            var config = {
              properties: {
                baseLocation: '${this.properties.baseLocation}',
                debug: ${this.properties.debug},
                concurrentJobs: ${this.properties.concurrentJobs},
              },
              dependencies: {
                createJobManager: ${JobManager.toString()},
                createJobQueue: ${JobQueue.toString()},
              },
            }
            var worker = new ${BackgroundWorker.toString()}(config);
        `;
    }

    /**
     * Will be executed by the worker thanks to the 'template injection'.
     */
    protected workerListener(worker: WorkerActionListener, action: WorkerAction, payload: any) {
        switch (action) {
            case 'start':
                worker.start(payload);
                break;
            case 'stop':
                worker.stop(payload);
                break;
            case 'resume':
                worker.resume(payload);
                break;
            case 'pause':
                worker.pause(payload);
                break;
            default:
                break;
        }
    }
}
