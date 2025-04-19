import type { Meta, StoryObj } from '@storybook/angular';
import { TicketExtractorComponent } from '../../app/components/ticket-extractor/ticket-extractor.component';
import { TicketDataService } from '../../app/services/ticket-data.service';
import { CommonModule } from '@angular/common';

// More on how to set up stories at: https://storybook.js.org/docs/angular/writing-stories/introduction
const meta: Meta<TicketExtractorComponent> = {
  title: 'Components/TicketExtractor',
  component: TicketExtractorComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: {
      ...args,
    },
    template: `<app-ticket-extractor></app-ticket-extractor>`,
  }),
  decorators: [
    (storyFunc) => {
      const story = storyFunc();
      return {
        ...story,
        moduleMetadata: {
          imports: [CommonModule],
          providers: [TicketDataService],
        },
      };
    },
  ],
};

export default meta;
type Story = StoryObj<TicketExtractorComponent>;

// Main component story - empty state
export const Empty: Story = {
  args: {
    isLoading: false,
    tickets: [],
    errorMessage: '',
    selectedFile: null,
    fileName: '',
  },
};

// Component with loaded tickets
export const WithTickets: Story = {
  args: {
    isLoading: false,
    tickets: [
      {
        ticketId: '300-1234',
        compId: 'ext-comp-1001',
        description: 'Issue with login functionality',
        details: 'User reported being unable to log in with valid credentials. The login button appears to be unresponsive.',
        resolution: 'Fixed an event handler issue in the login form component.'
      },
      {
        ticketId: '300-5678',
        compId: 'ext-comp-1002',
        description: 'Dashboard not loading data',
        details: 'The main dashboard is showing a loading spinner indefinitely.',
        resolution: 'Resolved API timeout issue and implemented proper error handling.'
      }
    ],
    errorMessage: '',
    selectedFile: null,
    fileName: 'example.html',
  },
};

// Component in loading state
export const Loading: Story = {
  args: {
    isLoading: true,
    tickets: [],
    errorMessage: '',
    selectedFile: null,
    fileName: 'loading.html',
  },
};

// Component showing an error
export const WithError: Story = {
  args: {
    isLoading: false,
    tickets: [],
    errorMessage: 'Please select an HTML file.',
    selectedFile: null,
    fileName: '',
  },
};
