'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Plus, Search, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function BlocklistTable() {
  const [search, setSearch] = useState('');
  
  // Mock data
  const lists = [
    { id: '1', name: 'Social Media', type: 'System', items: 142, enabled: true },
    { id: '2', name: 'Adult Content', type: 'System', items: 8530, enabled: true },
    { id: '3', name: 'My Custom Deny', type: 'Custom', items: 12, enabled: true },
    { id: '4', name: 'Gaming', type: 'System', items: 65, enabled: false },
  ];

  const filteredLists = lists.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search lists..." 
            className="pl-8" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>List Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Entries</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLists.map((list) => (
              <TableRow key={list.id}>
                <TableCell className="font-medium">{list.name}</TableCell>
                <TableCell>
                  <Badge variant={list.type === 'System' ? 'secondary' : 'outline'}>
                    {list.type}
                  </Badge>
                </TableCell>
                <TableCell>{list.items.toLocaleString()}</TableCell>
                <TableCell>
                  {list.enabled ? (
                    <span className="text-success font-medium">Active</span>
                  ) : (
                    <span className="text-muted-foreground">Inactive</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger 
                      render={<Button variant="ghost" className="h-8 w-8 p-0" />}
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Entries</DropdownMenuItem>
                      <DropdownMenuItem>{list.enabled ? 'Disable' : 'Enable'}</DropdownMenuItem>
                      {list.type === 'Custom' && (
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="w-4 h-4 mr-2" />
                          Delete List
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredLists.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No blocklists found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
