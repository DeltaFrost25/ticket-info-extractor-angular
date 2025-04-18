import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TicketExtractorComponent } from './components/ticket-extractor/ticket-extractor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TicketExtractorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Ticket Information Extractor';
}
