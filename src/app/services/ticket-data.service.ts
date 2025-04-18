import { Injectable } from '@angular/core';
import * as cheerio from 'cheerio';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketDataService {

  constructor() { }

  /**
   * Process HTML file and extract ticket information
   * @param htmlContent The raw HTML content to process
   * @returns Array of extracted ticket data
   */
  processHtmlFile(htmlContent: string): Ticket[] {
    // First clean the HTML
    const cleanedHtml = this.cleanHtml(htmlContent);
    
    // Then extract ticket data
    return this.extractTicketData(cleanedHtml);
  }

  /**
   * Clean the HTML by removing unnecessary elements and attributes
   * @param html Raw HTML content
   * @returns Cleaned HTML
   */
  private cleanHtml(html: string): string {
    // Basic string replacements for major unwanted sections
    let cleanedHTML = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
    cleanedHTML = cleanedHTML.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    cleanedHTML = cleanedHTML.replace(/<[^>]*\sid\s*=\s*["']ca-service-desk-ticket-center-page-primarytab["'][^>]*>([\s\S]*?)<\/[^>]*>/gi, '');
    
    // Load into Cheerio for more targeted cleaning
    const $ = cheerio.load(cleanedHTML);
    
    // Define attributes to keep
    const allowedAttributes = new Set(['id', 'data-caid', 'name', 'autoidentifier', 'value']);
    
    // Remove all attributes except the allowed ones from all elements
    $('*').each(function() {
      const element = $(this);
      const attributes = { ...element.attr() }; // Clone attributes object
      
      for (const attrName in attributes) {
        if (!allowedAttributes.has(attrName)) {
          element.removeAttr(attrName);
        }
      }
    });
    
    // Only keep ext-comp elements with relevant extraction fields
    const container = $('<div></div>');
    $('div[id^="ext-comp-"]').each(function() {
      const compEl = $(this);
      // Include only if it contains a title or textarea
      if (!compEl.find('[data-caid="title"], textarea').length) return;
      const newComp = $('<div></div>').attr('id', compEl.attr('id'));
      // Append title field(s)
      compEl.find('[data-caid="title"]').clone().appendTo(newComp);
      // Append all textareas (Description, Details, Resolution)
      compEl.find('textarea').clone().appendTo(newComp);
      container.append(newComp);
    });
    return container.html() || '';
  }

  /**
   * Extract ticket data from cleaned HTML
   * @param html Cleaned HTML
   * @returns Array of extracted ticket data
   */
  private extractTicketData(html: string): Ticket[] {
    const $ = cheerio.load(html);
    const tickets: Ticket[] = [];

    // Find each ext-comp-* element
    $('[id^="ext-comp-"]').each(function() {
      const compElement = $(this);
      const compId = compElement.attr('id') || '';
      
      // Try to find ticket ID within this ext-comp element
      let ticketId: string | null = null;
      
      // Look for title element with ticket ID pattern
      compElement.find('[data-caid="title"]').each(function() {
        const titleText = $(this).text().trim();
        const match = titleText.match(/300-\d+/);
        if (match) {
          ticketId = match[0];
        }
      });
      
      // If no title element, look for any text that contains a ticket ID
      if (!ticketId) {
        compElement.find('*:contains("300-")').each(function() {
          const text = $(this).text().trim();
          const match = text.match(/300-\d+/);
          if (match && !$(this).children().length) {
            ticketId = match[0];
            return false; // break out of the loop
          }
          return true; // Continue the loop
        });
      }
      
      // If we found a ticket ID, extract the data
      if (ticketId) {
        const ticketData: Ticket = {
          ticketId: ticketId,
          compId,
          description: '',
          details: '',
          resolution: ''
        };
        
        // Find description fields
        compElement.find('textarea').each(function() {
          const textarea = $(this);
          const textareaContent = textarea.text() || textarea.attr('value') || '';
          if (!textareaContent.trim()) return;
          
          const name = textarea.attr('name') || '';
          const dataCaid = textarea.attr('data-caid') || '';
          const id = textarea.attr('id') || '';
          const autoId = textarea.attr('autoidentifier') || '';
          
          // Check what type of content this is
          if (name.includes('Description') || dataCaid.includes('Description') || 
              id.includes('Description') || autoId.includes('Description')) {
            if (!dataCaid.includes('Long') && !name.includes('Long')) {
              ticketData.description = textareaContent;
            }
          }
          
          if (name.includes('DescriptionLong') || dataCaid.includes('DescriptionLong') || 
              id.includes('DescriptionLong') || autoId.includes('Details')) {
            ticketData.details = textareaContent;
          }
          
          if (name.includes('Resolution') || dataCaid.includes('Resolution') || 
              id.includes('Resolution') || autoId.includes('Resolution')) {
            ticketData.resolution = textareaContent;
          }
        });
        
        // Add to our list of tickets
        tickets.push(ticketData);
      }
    });

    // Remove duplicates based on ticket ID
    const uniqueTickets: Ticket[] = [];
    const seenIds = new Set<string>();
    tickets.forEach(ticket => {
      if (!seenIds.has(ticket.ticketId)) {
        seenIds.add(ticket.ticketId);
        uniqueTickets.push(ticket);
      }
    });

    return uniqueTickets;
  }

  /**
   * Create a formatted string containing all ticket data
   * @param tickets Array of tickets to format
   * @returns Formatted string with all ticket data
   */
  formatTicketDataAsText(tickets: Ticket[]): string {
    if (tickets.length === 0) {
      return 'No tickets found';
    }

    let tableText = 'Ticket Information Table\n';
    tableText += '==============================================\n\n';

    tickets.forEach((ticket, index) => {
      tableText += `Ticket #${index + 1}: ${ticket.ticketId}\n`;
      tableText += '-'.repeat(60) + '\n';
      
      tableText += 'Description:\n';
      tableText += '-'.repeat(12) + '\n';
      tableText += `${ticket.description.trim() || 'Not provided'}\n\n`;
      
      tableText += 'Details:\n';
      tableText += '-'.repeat(8) + '\n';
      tableText += `${ticket.details.trim() || 'Not provided'}\n\n`;
      
      tableText += 'Resolution:\n';
      tableText += '-'.repeat(11) + '\n';
      tableText += `${ticket.resolution.trim() || 'Not provided'}\n\n`;
      
      tableText += '='.repeat(60) + '\n\n';
    });

    return tableText;
  }
}
