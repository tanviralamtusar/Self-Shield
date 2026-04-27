'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function UsageChart() {
  const data = [
    { name: 'Mon', usage: 120 },
    { name: 'Tue', usage: 190 },
    { name: 'Wed', usage: 150 },
    { name: 'Thu', usage: 80 },
    { name: 'Fri', usage: 210 },
    { name: 'Sat', usage: 300 },
    { name: 'Sun', usage: 250 },
  ];

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
            tickFormatter={(value) => `${value}m`}
          />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))', 
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
              fontSize: '12px'
            }}
          />
          <Bar dataKey="usage" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.usage > 200 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
