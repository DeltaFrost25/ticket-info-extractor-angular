import { TicketExtractorComponent } from './ticket-extractor.component';
import { TicketDataService } from '../../services/ticket-data.service';
import { Ticket } from '../../models/ticket.model';

describe('TicketExtractorComponent', () => {
  let component: TicketExtractorComponent;
  let mockTicketDataService: any;
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

    mockTicketDataService = {
      processHtmlFile: jest.fn().mockReturnValue(sampleTickets),
      formatTicketDataAsText: jest.fn().mockReturnValue('Formatted text')
    };

    component = new TicketExtractorComponent(mockTicketDataService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection correctly', () => {
    // Mock the file selection event
    const mockFile = new File(['<html></html>'], 'test.html', { type: 'text/html' });
    const mockEvent = { target: { files: [mockFile] } } as unknown as Event;
    
    component.onFileSelected(mockEvent);
    
    expect(component.selectedFile).toBe(mockFile);
    expect(component.fileName).toBe('test.html');
    expect(component.errorMessage).toBe('');
  });

  it('should show an error for non-HTML files', () => {
    // Mock a non-HTML file selection
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const mockEvent = { target: { files: [mockFile] } } as unknown as Event;
    
    component.onFileSelected(mockEvent);
    
    expect(component.errorMessage).toContain('Please select an HTML file');
  });

  it('should clear selection', () => {
    // Setup initial state
    component.selectedFile = new File(['<html></html>'], 'test.html', { type: 'text/html' });
    component.fileName = 'test.html';
    component.tickets = [...sampleTickets];
    component.errorMessage = 'Some error';
    
    component.clearSelection();
    
    expect(component.selectedFile).toBeNull();
    expect(component.fileName).toBe('');
    expect(component.tickets).toEqual([]);
    expect(component.errorMessage).toBe('');
  });

  it('should get all ticket data as text', () => {
    component.tickets = sampleTickets;
    
    const result = component.getAllTicketDataAsText();
    
    expect(mockTicketDataService.formatTicketDataAsText).toHaveBeenCalledWith(sampleTickets);
    expect(result).toBe('Formatted text');
  });
});
