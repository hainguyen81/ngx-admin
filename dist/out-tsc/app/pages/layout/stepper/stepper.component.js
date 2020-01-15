import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
let StepperComponent = class StepperComponent {
    constructor(fb) {
        this.fb = fb;
    }
    ngOnInit() {
        this.firstForm = this.fb.group({
            firstCtrl: ['', Validators.required],
        });
        this.secondForm = this.fb.group({
            secondCtrl: ['', Validators.required],
        });
        this.thirdForm = this.fb.group({
            thirdCtrl: ['', Validators.required],
        });
    }
    onFirstSubmit() {
        this.firstForm.markAsDirty();
    }
    onSecondSubmit() {
        this.secondForm.markAsDirty();
    }
    onThirdSubmit() {
        this.thirdForm.markAsDirty();
    }
};
StepperComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-stepper',
        templateUrl: 'stepper.component.html',
        styleUrls: ['stepper.component.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder])
], StepperComponent);
export { StepperComponent };
//# sourceMappingURL=stepper.component.js.map