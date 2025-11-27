'use client';
import { Student } from '@/types';
import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useStudentOrg } from '../layout';
import { students as allStudents } from '@/lib/placeholder-data';

const chartConfig = {
  members: {
    label: 'Yeni Üzvlər',
    color: 'hsl(var(--chart-1))',
  },
};

export default function OrganizationDashboardPage() {
  const { organization, isLoading: orgLoading } = useStudentOrg();
  const [members, setMembers] = useState<Student[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);

  useEffect(() => {
    if (organization?.memberIds && organization.memberIds.length > 0) {
      const memberDetails = allStudents.filter(s => organization.memberIds.includes(s.id));
      setMembers(memberDetails);
    }
    setMembersLoading(false);
  }, [organization]);


  const memberJoinData = useMemo(() => {
    if (!members) return [];
    const monthlyData: { [key: string]: number } = {};
    const currentYear = new Date().getFullYear();
    const monthOrder = ["Yan", "Fev", "Mar", "Apr", "May", "İyn", "İyl", "Avq", "Sen", "Okt", "Noy", "Dek"];
    
    monthOrder.forEach(month => {
        monthlyData[month] = 0;
    });

    members.forEach(member => {
        if (!member || !member.createdAt) {
            return; 
        }
        const memberDate = new Date(member.createdAt);
        if (isNaN(memberDate.getTime())) {
            return;
        }

        if (memberDate.getFullYear() === currentYear) {
            const monthIndex = memberDate.getMonth();
            const monthName = monthOrder[monthIndex];
            if (monthName) {
                 monthlyData[monthName]++;
            }
        }
    });

    return monthOrder.map(month => ({ month, members: monthlyData[month] || 0 }));

  }, [members]);


  if (orgLoading || membersLoading) {
    return <div className="flex h-screen items-center justify-center">Yüklənir...</div>;
  }
  
  if(!organization) {
    return <div className="flex h-screen items-center justify-center">Təşkilat tapılmadı və ya təsdiqlənməyib.</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={organization.logoUrl} alt={organization.name} />
            <AvatarFallback>{organization.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{organization.name}</CardTitle>
            <CardDescription>{organization.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted text-center">
                    <p className="text-3xl font-bold">{organization.memberIds?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Üzv Sayı</p>
                </div>
                 <div className="p-4 rounded-lg bg-muted col-span-1 md:col-span-2">
                     <p className="text-lg font-bold mb-2">Aylara görə yeni üzvlər ({new Date().getFullYear()})</p>
                    <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
                        <BarChart accessibilityLayer data={memberJoinData}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="members" fill="var(--color-members)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
