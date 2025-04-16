import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrganizationsPage } from './admin-organizations.page';

describe('HomePage', () => {
  let component: AdminOrganizationsPage;
  let fixture: ComponentFixture<AdminOrganizationsPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(AdminOrganizationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
