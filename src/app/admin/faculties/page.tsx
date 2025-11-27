'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { FacultyData } from '@/types';
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { faculties as allFaculties } from '@/lib/placeholder-data';
import { v4 as uuidv4 } from 'uuid';

export default function AdminFacultiesPage() {
  const [newFaculty, setNewFaculty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [faculties, setFaculties] = useState<FacultyData[]>(allFaculties);

  const handleAddFaculty = async () => {
    if (!newFaculty.trim()) return;
    setIsLoading(true);
    
    // This is a mock. In a real app, you'd send this to your backend.
    const newFacultyData: FacultyData = { id: uuidv4(), name: newFaculty };
    setFaculties(prev => [...prev, newFacultyData]);

    toast({ title: 'Uğurlu', description: 'Yeni fakültə əlavə edildi.' });
    setNewFaculty('');
    setIsLoading(false);
  };

  const handleDeleteFaculty = (facultyId: string) => {
    // This is a mock. In a real app, you'd send this to your backend.
    setFaculties(prev => prev.filter(f => f.id !== facultyId));
    toast({ title: 'Uğurlu', description: 'Fakültə silindi.' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Fakültələr</h1>
          <p className="text-muted-foreground">
            Universitetdəki mövcud fakültələrin siyahısı.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Fakültələri İdarə Et</CardTitle>
            <CardDescription>Yeni fakültələr əlavə edin və ya mövcud olanları silin. Bu dəyişikliklər qeydiyyat və axtarış səhifələrində görünəcək.</CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <div className="flex items-center gap-2 mb-6">
            <Input 
              value={newFaculty}
              onChange={(e) => setNewFaculty(e.target.value)}
              placeholder="Yeni fakültə adı"
              disabled={isLoading}
            />
            <Button onClick={handleAddFaculty} disabled={isLoading || !newFaculty.trim()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {isLoading ? 'Əlavə edilir...' : 'Əlavə Et'}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fakültə Adı</TableHead>
                <TableHead className="text-right">Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faculties.length > 0 ? (
                faculties.map((faculty) => (
                  <TableRow key={faculty.id}>
                    <TableCell className="font-medium">{faculty.name}</TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>Silməni təsdiq edirsiniz?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  Bu əməliyyat geri qaytarılmazdır. "{faculty.name}" fakültəsi sistemdən həmişəlik silinəcək.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteFaculty(faculty.id)} className="bg-destructive hover:bg-destructive/90">Bəli, sil</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">Heç bir fakültə tapılmadı.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
