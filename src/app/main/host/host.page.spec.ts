import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {HostPage} from './host.page';

describe('AddPostComponent', () => {
    let component: HostPage;
    let fixture: ComponentFixture<HostPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [HostPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(HostPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
