import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketDataService } from '../../services/ticket-data.service';
import { Ticket } from '../../models/ticket.model';
import { TicketTableComponent } from '../ticket-table/ticket-table.component';

@Component({
  selector: 'app-ticket-extractor',
  templateUrl: './ticket-extractor.component.html',
  styleUrls: ['./ticket-extractor.component.scss'],
  imports: [CommonModule, TicketTableComponent],
  standalone: true
})
export class TicketExtractorComponent {
  isLoading = false;
  tickets: Ticket[] = [];
  errorMessage = '';
  selectedFile: File | null = null;
  fileName = '';
  copiedAll = false;

  constructor(private ticketDataService: TicketDataService) {}

  /**
   * Handle file selection event
   * @param event File input change event
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    if (!file) {
      return;
    }

    // Verify file type
    if (!file.name.toLowerCase().endsWith('.html')) {
      this.errorMessage = 'Please select an HTML file.';
      return;
    }

    this.selectedFile = file;
    this.fileName = file.name;
    this.errorMessage = '';
    
    // Automatically process the file when selected
    this.processFile();
  }

  /**
   * Process the selected HTML file
   */
  processFile(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an HTML file first.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const htmlContent = e.target?.result as string;
        if (!htmlContent) {
          throw new Error('Failed to read file content');
        }
        
        // Process the HTML content
        this.tickets = this.ticketDataService.processHtmlFile(htmlContent);
        
        if (this.tickets.length === 0) {
          this.errorMessage = 'No ticket information found in the file.';
        }
      } catch (error) {
        console.error('Error processing file:', error);
        this.errorMessage = `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`;
      } finally {
        this.isLoading = false;
      }
    };
    
    reader.onerror = () => {
      this.errorMessage = 'Error reading the file.';
      this.isLoading = false;
    };
    
    reader.readAsText(this.selectedFile);
  }

  /**
   * Clear the current file selection and results
   */
  clearSelection(): void {
    this.selectedFile = null;
    this.fileName = '';
    this.tickets = [];
    this.errorMessage = '';
  }

  /**
   * Get all ticket data as formatted text
   */
  getAllTicketDataAsText(): string {
    return this.ticketDataService.formatTicketDataAsText(this.tickets);
  }
  
  /**
   * Get all ticket data as CSV
   */
  getAllTicketDataAsCsv(): string {
    return this.ticketDataService.formatTicketDataAsCsv(this.tickets);
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
   * Copy all ticket data to clipboard
   */
  copyAll(): void {
    if (this.tickets.length === 0) return;
    
    const textToCopy = this.getAllTicketDataAsText();
    this.copyTextToClipboard(textToCopy);
    
    // Show copy confirmation
    this.copiedAll = true;
    
    // Reset copy confirmation after 2 seconds
    setTimeout(() => {
      this.copiedAll = false;
    }, 2000);
  }
  
  /**
   * Download ticket data as CSV file
   */
  downloadCsv(): void {
    if (this.tickets.length === 0) return;
    
    const csvContent = this.getAllTicketDataAsCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger click
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', this.fileName.replace('.html', '-ticket-data.csv'));
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
}
