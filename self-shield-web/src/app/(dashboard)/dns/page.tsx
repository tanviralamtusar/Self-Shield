import { DNSFilteringTools } from '@/components/dns/DNSFilteringTools';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DNS Filtering | Self-Shield',
  description: 'Recommended network-level DNS filtering solutions for enhanced protection.',
};

export default function DNSPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <DNSFilteringTools />
    </div>
  );
}
