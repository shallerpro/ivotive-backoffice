import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {CdPage} from './cd.page';

describe('AddPostComponent', () => {
    let component: CdPage;
    let fixture: ComponentFixture<CdPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CdPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(CdPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
