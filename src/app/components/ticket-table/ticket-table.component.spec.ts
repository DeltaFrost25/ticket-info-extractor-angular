import { TicketTableComponent } from './ticket-table.component';
import { Ticket } from '../../models/ticket.model';

describe('TicketTableComponent', () => {
  let component: TicketTableComponent;
  let sampleTickets: Ticket[];

  beforeEach(() => {
    sampleTickets = [
      {
        ticketId: '300-1234',
        compId: 'ext-comp-1001',
        description: 'Test description',
        details: 'Test details',
        resolution: 'Test resolution'
      }
    ];

    component = new TicketTableComponent();
    component.tickets = sampleTickets;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should copy field value when clicked', () => {
    // Mock the copyTextToClipboard method
    jest.spyOn(component as any, 'copyTextToClipboard').mockImplementation(() => {});
    
    const ticket = sampleTickets[0];
    component.copyField(ticket, 'description', ticket.description);
    
    expect(component['copyTextToClipboard']).toHaveBeenCalledWith('Test description');
    expect(component.copiedField).toEqual({ ticketId: '300-1234', field: 'description' });
  });

  it('should handle empty field values when copying', () => {
    // Mock the copyTextToClipboard method
    jest.spyOn(component as any, 'copyTextToClipboard').mockImplementation(() => {});
    
    const ticket = sampleTickets[0];
    component.copyField(ticket, 'description', '   '); // Empty or whitespace-only value
    
    expect(component['copyTextToClipboard']).not.toHaveBeenCalled();
  });

  it('should correctly identify copied field', () => {
    component.copiedField = { ticketId: '300-1234', field: 'description' };
    
    expect(component.isCopied('300-1234', 'description')).toBe(true);
    expect(component.isCopied('300-1234', 'details')).toBe(false);
    expect(component.isCopied('300-5678', 'description')).toBe(false);
    
    component.copiedField = null;
    expect(component.isCopied('300-1234', 'description')).toBe(false);
  });
});
