import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ngxArrayOfNumbers' })
export class ArrayOfNumbersPipe implements PipeTransform {

    transform(input: number): number[] {
        let value: number[];
        value = [];
        if (input > 0) {
            for (let  i: number = 0; i < input; i++) {
                value.push(i);
            }
        }
        return value;
    }
}
