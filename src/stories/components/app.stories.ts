import type { Meta, StoryObj } from '@storybook/angular';
import { AppComponent } from '../../app/app.component';
import { TicketExtractorComponent } from '../../app/components/ticket-extractor/ticket-extractor.component';
import { TicketTableComponent } from '../../app/components/ticket-table/ticket-table.component';
import { TicketDataService } from '../../app/services/ticket-data.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

const meta: Meta<AppComponent> = {
  title: 'Components/App',
  component: AppComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: {
      ...args,
    },
  }),
  decorators: [
    (storyFunc) => {
      const story = storyFunc();
      return {
        ...story,
        moduleMetadata: {
          imports: [CommonModule, RouterOutlet, TicketExtractorComponent, TicketTableComponent],
          providers: [TicketDataService],
        },
      };
    },
  ],
};

export default meta;
type Story = StoryObj<AppComponent>;

export const Default: Story = {
  args: {
    title: 'Ticket Information Extractor'
  },
};
