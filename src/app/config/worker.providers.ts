import {StaticProvider} from '@angular/core';
import {WorkerService} from '../sw/core/background.task.service';

export const BackgroundTaskProviders: StaticProvider[] = [
    {provide: WorkerService, useClass: WorkerService, deps: []},
];

export const WorkerProviders: StaticProvider[] = []
    .concat(BackgroundTaskProviders);
