'use client';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Student } from '@/types';

export default function MigrateDataPage() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const firestore = useFirestore();
  const { toast } = useToast();

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  const handleMigration = async () => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Firestore tapılmadı!' });
      return;
    }
    setIsMigrating(true);
    setProgress(0);
    setLogs([]);
    addLog('Miqrasiyaya başlanır...');

    try {
      addLog('Bütün tələbələr çəkilir...');
      const studentsQuery = collection(firestore, 'users');
      const studentsSnapshot = await getDocs(studentsQuery);
      const students = studentsSnapshot.docs.filter(d => d.data().role === 'student').map((doc) => ({ id: doc.id, ...doc.data() } as Student));

      if (students.length === 0) {
        addLog('Köçürüləcək tələbə tapılmadı.');
        toast({ title: 'Məlumat yoxdur', description: 'Köçürmək üçün heç bir tələbə məlumatı tapılmadı.' });
        setIsMigrating(false);
        return;
      }

      addLog(`${students.length} tələbə tapıldı.`);
      
      const newProjectsCollection = collection(firestore, 'projects');
      const newAchievementsCollection = collection(firestore, 'achievements');
      
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const studentName = `${student.firstName} ${student.lastName}`;
        addLog(`--- ${studentName} (ID: ${student.id}) üçün proses başladılır ---`);
        
        const batch = writeBatch(firestore);

        // Projects migration
        const oldProjectsRef = collection(firestore, `users/${student.id}/projects`);
        const oldProjectsSnap = await getDocs(oldProjectsRef);
        if (!oldProjectsSnap.empty) {
          addLog(`${oldProjectsSnap.size} layihə tapıldı.`);
          oldProjectsSnap.forEach((projectDoc) => {
            const projectData = projectDoc.data();
            const newProjectRef = doc(newProjectsCollection);
            batch.set(newProjectRef, { ...projectData, id: newProjectRef.id, studentId: student.id });
            addLog(` > Layihə "${projectData.title}" yeni kolleksiyaya əlavə edildi.`);
          });
        } else {
             addLog(`Layihə tapılmadı.`);
        }

        // Achievements migration
        const oldAchievementsRef = collection(firestore, `users/${student.id}/achievements`);
        const oldAchievementsSnap = await getDocs(oldAchievementsRef);
        if (!oldAchievementsSnap.empty) {
          addLog(`${oldAchievementsSnap.size} nailiyyət tapıldı.`);
          oldAchievementsSnap.forEach((achDoc) => {
            const achData = achDoc.data();
            const newAchRef = doc(newAchievementsCollection);
            batch.set(newAchRef, { ...achData, id: newAchRef.id, studentId: student.id });
            addLog(` > Nailiyyət "${achData.name}" yeni kolleksiyaya əlavə edildi.`);
          });
        } else {
            addLog(`Nailiyyət tapılmadı.`);
        }
        
        await batch.commit();
        addLog(`--- ${studentName} üçün məlumatlar köçürüldü ---`);
        setProgress(((i + 1) / students.length) * 100);
      }

      addLog('BÜTÜN MƏLUMATLAR UĞURLA KÖÇÜRÜLDÜ!');
      toast({ title: 'Miqrasiya Uğurlu Oldu', description: 'Bütün köhnə layihə və nailiyyət məlumatları yeni sistemə köçürüldü.' });

    } catch (error: any) {
      console.error("Migration failed: ", error);
      addLog(`XƏTA: ${error.message}`);
      toast({ variant: 'destructive', title: 'Miqrasiya zamanı xəta', description: error.message });
    }

    setIsMigrating(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Məlumatların Köçürülməsi (Miqrasiya)</CardTitle>
        <CardDescription>
          Bu əməliyyat, köhnə strukturdakı (tələbələrin alt-kolleksiyalarındakı) layihə və nailiyyət məlumatlarını yeni, mərkəzləşdirilmiş kolleksiyalara köçürəcək. Bu əməliyyatı yalnız bir dəfə icra etmək lazımdır.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleMigration} disabled={isMigrating}>
          {isMigrating ? 'Köçürülür...' : 'Miqrasiyaya Başla'}
        </Button>
        {isMigrating && (
            <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground text-center">{Math.round(progress)}% tamamlandı</p>
            </div>
        )}
        {logs.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-md max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-2">Gedişat Jurnalı:</h3>
            <pre className="text-xs whitespace-pre-wrap">
              {logs.join('\n')}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
