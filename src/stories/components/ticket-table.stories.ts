import type { Meta, StoryObj } from '@storybook/angular';
import { TicketTableComponent } from '../../app/components/ticket-table/ticket-table.component';
import { CommonModule } from '@angular/common';

const meta: Meta<TicketTableComponent> = {
  title: 'Components/TicketTable',
  component: TicketTableComponent,
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
          imports: [CommonModule],
        },
      };
    },
  ],
};

export default meta;
type Story = StoryObj<TicketTableComponent>;

// Empty table
export const Empty: Story = {
  args: {
    tickets: [],
  },
};

// Table with single ticket
export const SingleTicket: Story = {
  args: {
    tickets: [
      {
        ticketId: '300-1234',
        compId: 'ext-comp-1001',
        description: 'Issue with login functionality',
        details: 'User reported being unable to log in with valid credentials. The login button appears to be unresponsive.',
        resolution: 'Fixed an event handler issue in the login form component.'
      }
    ],
  },
};

// Table with multiple tickets
export const MultipleTickets: Story = {
  args: {
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
      },
      {
        ticketId: '300-9012',
        compId: 'ext-comp-1003',
        description: 'Export functionality broken',
        details: 'The export to CSV button is not functioning. Clicking it does nothing.',
        resolution: 'Added missing event handler and error handling for the export process.'
      }
    ],
  },
};

// Showing copied field state
export const WithCopiedField: Story = {
  args: {
    tickets: [
      {
        ticketId: '300-1234',
        compId: 'ext-comp-1001',
        description: 'Issue with login functionality',
        details: 'User reported being unable to log in with valid credentials.',
        resolution: 'Fixed an event handler issue in the login form component.'
      }
    ],
    copiedField: { ticketId: '300-1234', field: 'description' }
  },
};
