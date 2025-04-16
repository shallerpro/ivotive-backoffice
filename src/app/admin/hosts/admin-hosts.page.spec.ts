import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHostsPage } from './admin-hosts.page';

describe('HomePage', () => {
  let component: AdminHostsPage;
  let fixture: ComponentFixture<AdminHostsPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(AdminHostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
