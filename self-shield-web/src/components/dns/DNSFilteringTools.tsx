'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Server, Cloud, ShieldCheck } from 'lucide-react';

const dnsTools = [
  {
    name: 'Pi-hole',
    type: 'Self-hosted',
    description: 'A network-wide ad and content blocker that works at the DNS level. Highly customizable and runs on a Raspberry Pi or any Linux machine.',
    url: 'https://pi-hole.net/',
    icon: Server,
    features: ['Ad Blocking', 'Privacy', 'Open Source']
  },
  {
    name: 'AdGuard Home',
    type: 'Self-hosted',
    description: 'A network-wide software for blocking ads and tracking. It provides a user-friendly web interface to manage your network filtering.',
    url: 'https://adguard.com/en/adguard-home/overview.html',
    icon: Server,
    features: ['Parental Control', 'Safe Search', 'Encryption']
  },
  {
    name: 'OpenDNS FamilyShield',
    type: 'Cloud',
    description: 'Pre-configured DNS servers that automatically block adult content across all devices on your network without software installation.',
    url: 'https://www.opendns.com/setupguide/#familyshield',
    icon: Cloud,
    features: ['Adult Content Block', 'Easy Setup', 'Reliable']
  },
  {
    name: 'CleanBrowsing',
    type: 'Cloud',
    description: 'A family-friendly DNS service that provides different filters: Adult, Family, and Security. Focuses on privacy and speed.',
    url: 'https://cleanbrowsing.org/',
    icon: Cloud,
    features: ['Phishing Protection', 'Family Filter', 'Privacy']
  },
  {
    name: 'Cloudflare 1.1.1.3',
    type: 'Cloud',
    description: "Cloudflare's public DNS for families. Automatically blocks malware and adult content using one of the fastest DNS networks in the world.",
    url: 'https://developers.cloudflare.com/1.1.1.1/setup/',
    icon: Cloud,
    features: ['Ultra Fast', 'Malware Blocking', 'Global Network']
  },
  {
    name: 'NextDNS',
    type: 'Cloud',
    description: 'A modern DNS service that gives you full control over your internet traffic with advanced security and filtering options.',
    url: 'https://nextdns.io/',
    icon: Cloud,
    features: ['Highly Customizable', 'Analytics', 'Modern']
  }
];

export function DNSFilteringTools() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">DNS-Based Filtering</h2>
        <p className="text-muted-foreground">
          Combine Self-Shield with network-level DNS filtering for maximum protection against harmful content.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dnsTools.map((tool) => (
          <Card key={tool.name} className="group overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <tool.icon className="h-5 w-5" />
                </div>
                <Badge variant={tool.type === 'Self-hosted' ? 'secondary' : 'outline'} className="font-semibold">
                  {tool.type}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{tool.name}</CardTitle>
              <CardDescription className="line-clamp-3 min-h-[4.5rem] mt-2">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {tool.features.map((feature) => (
                  <Badge key={feature} variant="ghost" className="bg-primary/5 text-[10px] uppercase tracking-wider py-0 px-2 h-5 border border-primary/10">
                    {feature}
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2 group-hover:bg-primary group-hover:text-white transition-all duration-300"
                render={<a href={tool.url} target="_blank" rel="noopener noreferrer" />}
              >
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-primary">Pro Tip</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For the best results, configure one of these DNS providers directly on your home router. This ensures that every device connected to your WiFi (smart TVs, consoles, and guest phones) is protected automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
