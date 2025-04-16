import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CdsPage } from './cds.page';

describe('ShortcodePage', () => {
  let component: CdsPage;
  let fixture: ComponentFixture<CdsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CdsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
