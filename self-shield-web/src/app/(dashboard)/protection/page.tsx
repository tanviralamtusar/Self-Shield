import { StrictProtection } from '@/components/protection/StrictProtection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Strict Protection | Self-Shield',
  description: 'Manage advanced filtering and SafeSearch settings.',
};

export default function ProtectionPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <StrictProtection />
    </div>
  );
}
