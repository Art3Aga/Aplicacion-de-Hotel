import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservarPage } from './reservar.page';

describe('ReservarPage', () => {
  let component: ReservarPage;
  let fixture: ComponentFixture<ReservarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
