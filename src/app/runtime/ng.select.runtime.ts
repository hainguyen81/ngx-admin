import {NgOption} from '@ng-select/ng-select';

export class NgSelectRuntime {
    setItemState(item: NgOption) {
        // merge state with internal option
        internalItem = {...internalItem, ...item};

        // detect changes
        this.detectChanges();
    }
}