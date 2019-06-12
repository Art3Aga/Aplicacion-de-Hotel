import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuartosPage } from './cuartos.page';

describe('CuartosPage', () => {
  let component: CuartosPage;
  let fixture: ComponentFixture<CuartosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuartosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuartosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
