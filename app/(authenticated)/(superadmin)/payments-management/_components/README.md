# Payments Management UI Components

## Overview

This folder contains a modular, production-ready Admin UI for managing payments across organizations and elections. The components are built with Next.js 16 (React 19), Tailwind CSS, and shadcn/ui.

## Component Architecture

### 1. **PaymentsManagementClient** (Orchestrator)
The main wrapper component that coordinates the entire dashboard.
- Renders a header with title and subtitle
- Implements shadcn `<Tabs>` for switching between "Organizations" and "Elections" views
- Manages tab state and passes data to child tables
- **Props:** `organizationPayments`, `onVerifyPayment`, `onRejectPayment`

### 2. **OrganizationPaymentsTable** (Main Table)
Displays payment transactions for organizations in a responsive table.
- **Columns:**
  - Organization (name + shorthand)
  - Submitted By (user name + email)
  - Date & Amount (formatted datetime + PHP currency)
  - Receipt (view button that triggers modal)
  - Status (status badge)
  - Actions (Verify/Reject buttons for pending payments only)
- **Props:** `payments`, `onVerify`, `onReject`
- **Features:**
  - Responsive table with proper theming
  - Currency formatting as PHP (₱)
  - Date formatting to readable local format
  - Empty state handling

### 3. **PaymentStatusBadge** (Status Indicator)
Displays payment status with dynamic styling.
- **Statuses:**
  - `pending`: Yellow/Warning style
  - `verified`: Green/Success style
  - `rejected`: Red/Destructive style
- Uses shadcn `<Badge>` component with custom styling
- **Props:** `status`

### 4. **ReceiptModal** (Receipt Viewer)
Modal dialog for viewing and downloading payment receipts.
- Uses shadcn `<Dialog>` component
- Displays full receipt image using Next.js `<Image>`
- Shows loading spinner while image loads
- Includes download button
- **Props:** `receiptUrl`, `orgName`, `isOpen`, `onOpenChange`

### 5. **ElectionsPaymentsTable** (Placeholder)
Placeholder component for future elections payments feature.
- Displays "Coming Soon" message with calendar icon
- Placeholder styling to indicate incomplete feature

## Data Structure

All components use the `PaymentRowData` interface (defined in `types/database.ts`):

```typescript
export interface PaymentRowData {
  id: string;
  amount: number;
  receipt_url: string;
  status: PaymentStatus;
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
    email: string;
  };
  organizations: {
    name: string;
    shorthand_name: string;
  };
}
```

## Styling

- Uses Tailwind CSS with semantic theme variables from `globals.css`
- Examples: `bg-background`, `text-muted-foreground`, `border-border`
- Responsive design with proper spacing and typography
- Dark mode support built-in through shadcn/ui theming

## Usage

### Basic Usage

```tsx
import { PaymentsManagementClient } from '@/app/(authenticated)/(superadmin)/payments-management/_components';

const payments: PaymentRowData[] = [/* ... */];

export default function Page() {
  const handleVerify = (id: string) => {
    // Call server action to verify payment
  };

  const handleReject = (id: string) => {
    // Call server action to reject payment
  };

  return (
    <PaymentsManagementClient
      organizationPayments={payments}
      onVerifyPayment={handleVerify}
      onRejectPayment={handleReject}
    />
  );
}
```

### Individual Component Usage

```tsx
// Status Badge
import { PaymentStatusBadge } from './_components';
<PaymentStatusBadge status="pending" />

// Receipt Modal
import { ReceiptModal } from './_components';
<ReceiptModal
  receiptUrl="https://..."
  orgName="Organization Name"
  isOpen={isOpen}
  onOpenChange={setIsOpen}
/>

// Organization Payments Table
import { OrganizationPaymentsTable } from './_components';
<OrganizationPaymentsTable
  payments={payments}
  onVerify={handleVerify}
  onReject={handleReject}
/>
```

## Features

✅ Fully responsive design  
✅ Dark mode support  
✅ Accessible components using shadcn/ui  
✅ Proper loading states  
✅ Currency & date formatting  
✅ Empty state handling  
✅ Modular architecture  
✅ TypeScript support  
✅ Mock data included for UI development  

## Future Enhancements

- [ ] Add filtering by organization, user, date range
- [ ] Add sorting by columns
- [ ] Add pagination for large datasets
- [ ] Add search functionality
- [ ] Implement Elections Payments Table
- [ ] Add bulk actions (verify/reject multiple)
- [ ] Add export to CSV/PDF
- [ ] Add real-time updates with WebSocket
