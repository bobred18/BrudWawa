import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssue } from './add-issue';

describe('AddIssue', () => {
  let component: AddIssue;
  let fixture: ComponentFixture<AddIssue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIssue],
    }).compileComponents();

    fixture = TestBed.createComponent(AddIssue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
