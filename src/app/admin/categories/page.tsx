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
import type { CategoryData } from '@/types';
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
import { categories as allCategories } from '@/lib/placeholder-data';
import { v4 as uuidv4 } from 'uuid';

export default function AdminCategoriesPage() {
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryData[]>(allCategories);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setIsLoading(true);

    const newCategoryData: CategoryData = { id: uuidv4(), name: newCategory };
    setCategories(prev => [...prev, newCategoryData]);
    
    toast({ title: 'Uğurlu', description: 'Yeni kateqoriya əlavə edildi.' });
    setNewCategory('');
    setIsLoading(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    toast({ title: 'Uğurlu', description: 'Kateqoriya silindi.' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">İstedad Kateqoriyaları</h1>
          <p className="text-muted-foreground">
            Tələbələrin bölündüyü əsas istedad sahələri.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Kateqoriyaları İdarə Et</CardTitle>
            <CardDescription>Yeni istedad kateqoriyaları əlavə edin və ya mövcud olanları silin. Bu dəyişikliklər bütün saytda (qeydiyyat, axtarış və s.) dərhal tətbiq olunacaq.</CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <div className="flex items-center gap-2 mb-6">
            <Input 
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Yeni kateqoriya adı"
              disabled={isLoading}
            />
            <Button onClick={handleAddCategory} disabled={isLoading || !newCategory.trim()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {isLoading ? 'Əlavə edilir...' : 'Əlavə Et'}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kateqoriya Adı</TableHead>
                <TableHead className="text-right">Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>Silməni təsdiq edirsiniz?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  Bu əməliyyat geri qaytarılmazdır. "{category.name}" kateqoriyası sistemdən həmişəlik silinəcək.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} className="bg-destructive hover:bg-destructive/90">Bəli, sil</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">Heç bir kateqoriya tapılmadı.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
