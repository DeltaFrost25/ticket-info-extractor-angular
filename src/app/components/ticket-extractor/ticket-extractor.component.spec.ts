import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketExtractorComponent } from './ticket-extractor.component';

describe('TicketExtractorComponent', () => {
  let component: TicketExtractorComponent;
  let fixture: ComponentFixture<TicketExtractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketExtractorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketExtractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
