import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'activeRoot',
    standalone: true
})
export class ActiveRootPipe implements PipeTransform {

    transform(value: string, arg: string): boolean {
        return value.includes(arg);
    }

}
