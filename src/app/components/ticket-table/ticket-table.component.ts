import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss']
})
export class TicketTableComponent {
  @Input() tickets: Ticket[] = [];
  copiedField: { ticketId: string; field: string } | null = null;

  /**
   * Copy a single field value to clipboard
   * @param ticket The ticket containing the field
   * @param field The field name to copy
   * @param value The value to copy
   */
  copyField(ticket: Ticket, field: string, value: string): void {
    if (!value.trim()) return;
    
    this.copyTextToClipboard(value);
    
    // Set the copied field for UI feedback
    this.copiedField = { ticketId: ticket.ticketId, field };
    
    // Reset the copied field after 2 seconds
    setTimeout(() => {
      this.copiedField = null;
    }, 2000);
    
    console.log(`Copied ${field} from ticket ${ticket.ticketId}`);
  }

  /**
   * Copy text to clipboard with fallback
   * @param text Text to copy
   */
  private copyTextToClipboard(text: string): void {
    try {
      // Try using the modern Clipboard API first
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Text copied to clipboard');
        })
        .catch(err => {
          // If Clipboard API fails, try the fallback method
          this.copyTextFallback(text);
        });
    } catch (err) {
      // If Clipboard API is not available, use fallback
      this.copyTextFallback(text);
    }
  }

  /**
   * Fallback method for copying text using a temporary textarea element
   * @param text Text to copy
   */
  private copyTextFallback(text: string): void {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Make the textarea out of viewport
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      
      // Select and copy the text
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      
      // Remove the temporary element
      document.body.removeChild(textArea);
      
      if (successful) {
        console.log('Text copied using fallback method');
      } else {
        console.error('Fallback copy method failed');
      }
    } catch (err) {
      console.error('All clipboard copy methods failed:', err);
    }
  }

  /**
   * Check if a specific field has been copied (for UI feedback)
   * @param ticketId The ticket ID
   * @param field The field name
   * @returns True if this field was most recently copied
   */
  isCopied(ticketId: string, field: string): boolean {
    return !!this.copiedField && 
           this.copiedField.ticketId === ticketId && 
           this.copiedField.field === field;
  }
}
