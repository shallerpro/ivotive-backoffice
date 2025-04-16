import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {IonChip, IonRow} from '@ionic/angular/standalone';
import {ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-item-selector',
    templateUrl: './item-selector.component.html',
    styleUrls: ['./item-selector.component.scss'],
    standalone : true,
    imports: [ReactiveFormsModule, IonRow, IonChip]
})
export class ItemSelectorComponent implements OnInit {

    @Input() horizontalScroll: boolean = false;
    @Input() items: any[] = [];
    @Input() multiSelection: boolean = false;
    @Output() onSelect: EventEmitter<[]> = new EventEmitter<[]>();

    constructor() {

    }

    async ngOnInit() {


    }

    doSelect(item: any) {
        if (!this.multiSelection) {
            this.items.forEach((item: any) => {
                item.raw.selected = false;
            });
        }
        item.raw.selected = !item.raw.selected;
        // @ts-ignore
        this.onSelect.emit(this.items.filter((item: any) => item.raw.selected));
    }


}
