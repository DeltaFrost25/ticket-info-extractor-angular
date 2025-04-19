import { TicketDataService } from './ticket-data.service';
import { Ticket } from '../models/ticket.model';

describe('TicketDataService', () => {
  let service: TicketDataService;

  beforeEach(() => {
    service = new TicketDataService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cleanHtml', () => {
    it('should remove unnecessary elements and attributes', () => {
      const dirtyHtml = `
        <style>body { color: red; }</style>
        <script>alert('test');</script>
        <div id="ext-comp-1001" class="remove-me">
          <div data-caid="title">Case 300-1234: Test Case</div>
          <textarea name="Description">Description content</textarea>
        </div>
      `;
      
      const result = (service as any).cleanHtml(dirtyHtml);
      
      expect(result).not.toContain('<style>');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('class="remove-me"');
      expect(result).toContain('id="ext-comp-1001"');
      expect(result).toContain('data-caid="title"');
      expect(result).toContain('<textarea name="Description"');
    });
  });

  describe('extractTicketData', () => {
    it('should extract ticket information from clean HTML', () => {
      const cleanHtml = `
        <div id="ext-comp-1001">
          <div data-caid="title">Case 300-1234: Test Case</div>
          <textarea name="Description">Description content</textarea>
          <textarea name="DescriptionLong">Details content</textarea>
          <textarea name="Resolution">Resolution content</textarea>
        </div>
      `;
      
      const result = (service as any).extractTicketData(cleanHtml);
      
      expect(result.length).toBe(1);
      expect(result[0].ticketId).toBe('300-1234');
      expect(result[0].description).toBe('Description content');
      expect(result[0].details).toBe('Details content');
      expect(result[0].resolution).toBe('Resolution content');
    });

    it('should handle multiple tickets and remove duplicates', () => {
      const cleanHtml = `
        <div id="ext-comp-1001">
          <div data-caid="title">Case 300-1234: Test Case</div>
          <textarea name="Description">Description 1</textarea>
        </div>
        <div id="ext-comp-1002">
          <div data-caid="title">Case 300-1234: Duplicate</div>
          <textarea name="Description">Should be ignored</textarea>
        </div>
        <div id="ext-comp-1003">
          <div data-caid="title">Case 300-5678: Another Case</div>
          <textarea name="Description">Description 2</textarea>
        </div>
      `;
      
      const result = (service as any).extractTicketData(cleanHtml);
      
      expect(result.length).toBe(2);
      expect(result[0].ticketId).toBe('300-1234');
      expect(result[1].ticketId).toBe('300-5678');
    });
  });

  describe('processHtmlFile', () => {
    it('should process HTML file and return ticket data', () => {
      const htmlContent = `
        <html>
          <head>
            <style>body { color: red; }</style>
            <script>alert('test');</script>
          </head>
          <body>
            <div id="ext-comp-1001" class="remove-me">
              <div data-caid="title">Case 300-1234: Test Case</div>
              <textarea name="Description">Test description</textarea>
              <textarea name="DescriptionLong">Test details</textarea>
              <textarea name="Resolution">Test resolution</textarea>
            </div>
          </body>
        </html>
      `;
      
      // Mock the cleanHtml and extractTicketData methods
      const expectedTickets = [
        {
          ticketId: '300-1234',
          compId: 'ext-comp-1001',
          description: 'Test description',
          details: 'Test details',
          resolution: 'Test resolution'
        }
      ];
      
      const cleanHtmlSpy = jest.spyOn(service as any, 'cleanHtml').mockReturnValue('cleaned html');
      const extractTicketDataSpy = jest.spyOn(service as any, 'extractTicketData').mockReturnValue(expectedTickets);
      
      const result = service.processHtmlFile(htmlContent);
      
      expect(cleanHtmlSpy).toHaveBeenCalledWith(htmlContent);
      expect(extractTicketDataSpy).toHaveBeenCalledWith('cleaned html');
      expect(result).toEqual(expectedTickets);
      
      // Restore the original methods
      cleanHtmlSpy.mockRestore();
      extractTicketDataSpy.mockRestore();
    });
  });

  describe('formatTicketDataAsText', () => {
    it('should format ticket data as text', () => {
      const tickets: Ticket[] = [
        {
          ticketId: '300-1234',
          compId: 'ext-comp-1001',
          description: 'Test description',
          details: 'Test details',
          resolution: 'Test resolution'
        }
      ];
      
      const result = service.formatTicketDataAsText(tickets);
      
      expect(result).toContain('Ticket #1: 300-1234');
      expect(result).toContain('Description:');
      expect(result).toContain('Test description');
      expect(result).toContain('Details:');
      expect(result).toContain('Test details');
      expect(result).toContain('Resolution:');
      expect(result).toContain('Test resolution');
    });

    it('should handle empty ticket array', () => {
      const result = service.formatTicketDataAsText([]);
      expect(result).toBe('No tickets found');
    });
  });
});
