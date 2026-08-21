import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreNosComponent } from './sobre-nos';

describe('SobreNosComponent', () => {
  let component: SobreNosComponent;
  let fixture: ComponentFixture<SobreNosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobreNosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SobreNosComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});