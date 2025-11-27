'use client';
import {
  ArrowUpRight,
  Library,
  Users,
  RefreshCw
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import { Student, StudentOrganization } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { students as allStudents, studentOrganizations as allStudentOrgs } from "@/lib/placeholder-data";
import { useState, useEffect, useTransition } from "react";
import { syncDataAction } from "./action";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboard() {
  const { user: adminUser, loading: adminLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [studentOrgs, setStudentOrgs] = useState<StudentOrganization[]>([]);
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  
  const [syncedData, setSyncedData] = useState<string | null>(null);
  const [isSyncing, startSyncTransition] = useTransition();
  const { toast } = useToast();

  const isLoading = adminLoading;

  useEffect(() => {
    if (adminUser?.role === 'admin') {
        setStudents(allStudents);
        setStudentOrgs(allStudentOrgs);
        const sortedStudents = [...allStudents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentStudents(sortedStudents.slice(0, 5));
    }
  }, [adminUser]);

  const handleSync = () => {
    startSyncTransition(async () => {
        const result = await syncDataAction();
        if(result.success) {
            setSyncedData(result.data);
            toast({ title: "Sinxronizasiya Uğurlu Oldu", description: "Lokal məlumatlar üçün kod aşağıda göstərildi. Kopyalayıb placeholder-data.ts faylına yerləşdirin."})
        } else {
            toast({ variant: 'destructive', title: "Sinxronizasiya Xətası", description: result.error });
        }
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Yüklənir...</p>
        </div>
      </div>
    );
  }
  
  const totalStudents = students.length;
  const totalStudentOrgs = studentOrgs.length;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ümumi Tələbə
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Sistemdə qeydiyyatdan keçmiş tələbə sayı
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Link href="/admin/telebe-teskilatlari">Tələbə Təşkilatları</Link>
              </CardTitle>
              <Library className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudentOrgs}</div>
              <p className="text-xs text-muted-foreground">
                Platformadakı tələbə təşkilatlarının sayı
              </p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Sistem Sinxronizasiyası
                 <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground mb-2">
                    Firebase-dəki məlumatları lokal məlumat faylına köçürmək üçün sinxronizasiya edin.
                </p>
               <Button onClick={handleSync} disabled={isSyncing} className="w-full">
                {isSyncing ? 'Sinxronizasiya edilir...' : 'Məlumatları Sinxronizasiya Et'}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {syncedData && (
             <Card>
                <CardHeader>
                    <CardTitle>Sinxronizasiya Nəticəsi</CardTitle>
                    <CardDescription>Aşağıdakı kodu kopyalayıb `src/lib/placeholder-data.ts` faylının məzmunu ilə tam əvəz edin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        readOnly
                        value={syncedData}
                        className="h-96 font-mono text-xs"
                    />
                    <Button onClick={() => navigator.clipboard.writeText(syncedData)} className="mt-2">
                        Kodu Kopyala
                    </Button>
                </CardContent>
            </Card>
        )}

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Son Qeydiyyatlar</CardTitle>
                <CardDescription>
                  Sistemə yeni qoşulmuş tələbələr.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/admin/students">
                  Hamısına Bax
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tələbə</TableHead>
                    <TableHead className="hidden xl:table-column">
                      Fakültə
                    </TableHead>
                    <TableHead className="hidden xl:table-column">
                      Status
                    </TableHead>
                    <TableHead className="text-right">Qoşulma Tarixi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Heç bir tələbə tapılmadı</TableCell>
                    </TableRow>
                  ) : (
                    recentStudents.map((student: Student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="font-medium">{student.firstName} {student.lastName}</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {student.email}
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          {student.faculty}
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          <Badge variant={student.status === 'təsdiqlənmiş' ? 'default' : 'secondary'}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
