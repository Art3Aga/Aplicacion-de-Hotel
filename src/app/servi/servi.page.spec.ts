import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiPage } from './servi.page';

describe('ServiPage', () => {
  let component: ServiPage;
  let fixture: ComponentFixture<ServiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
