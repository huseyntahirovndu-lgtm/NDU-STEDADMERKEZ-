'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  Suspense,
  ChangeEvent,
} from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Student,
  Project,
  Achievement,
  Certificate,
  AchievementLevel,
} from '@/types';
import { calculateTalentScore } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Trash2,
  PlusCircle,
  Award,
  Briefcase,
  FileText,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
} from '@/components/ui/alert-dialog';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  DocumentReference,
} from 'firebase/firestore';
import {
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';


const projectSchema = z.object({
  title: z.string().min(3, 'Layihə adı boş ola bilməz.'),
  description: z.string().min(10, 'Təsvir ən azı 10 hərf olmalıdır.'),
  role: z.string().min(2, 'Rol boş ola bilməz.'),
  teamMembersRaw: z.string().optional(),
  link: z.string().url().or(z.literal('')),
  status: z.enum(['davam edir', 'tamamlanıb']),
});

const achievementSchema = z.object({
  name: z.string().min(3, 'Nailiyyət adı boş ola bilməz.'),
  description: z.string().optional(),
  position: z.string().min(1, 'Dərəcə boş ola bilməz.'),
  level: z.enum(['Beynəlxalq', 'Respublika', 'Regional', 'Universitet']),
  date: z.string().min(1, 'Tarix boş ola bilməz.'),
  link: z.string().url().or(z.literal('')),
});

const certificateSchema = z.object({
  name: z.string().min(3, 'Sertifikat adı boş ola bilməz.'),
  certificateURL: z
    .string()
    .url({ message: 'Etibarlı bir link daxil edin.' })
    .optional()
    .or(z.literal('')),
  level: z.enum(['Beynəlxalq', 'Respublika', 'Regional', 'Universitet']),
});


function EditProfilePageComponent() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();

  const [isUploading, setIsUploading] = useState(false);
  const certificateFileInputRef = useRef<HTMLInputElement>(null);

  const userIdFromQuery = searchParams.get('userId');

  const userIdToFetch = (() => {
    if (currentUser?.role === 'admin' && userIdFromQuery) {
      return userIdFromQuery;
    }
    return currentUser?.id || null;
  })();

  const userDocRef = useMemoFirebase(() =>
    userIdToFetch && firestore ? doc(firestore, 'users', userIdToFetch) : null,
    [firestore, userIdToFetch]
  );

  const { data: targetUser, isLoading: userLoading } =
    useDoc<Student>(userDocRef);

  const projectsQuery = useMemoFirebase(
    () =>
      userIdToFetch && firestore
        ? query(
            collection(firestore, 'projects'),
            where('studentId', '==', userIdToFetch)
          )
        : null,
    [firestore, userIdToFetch]
  );
  const { data: projects, isLoading: projectsLoading } =
    useCollection<Project>(projectsQuery);

  const achievementsQuery = useMemoFirebase(
    () =>
      userIdToFetch && firestore
        ? query(
            collection(firestore, 'achievements'),
            where('studentId', '==', userIdToFetch)
          )
        : null,
    [firestore, userIdToFetch]
  );
  const { data: achievements, isLoading: achievementsLoading } =
    useCollection<Achievement>(achievementsQuery);

  const certificatesQuery = useMemoFirebase(
    () =>
      userIdToFetch && firestore
        ? collection(firestore, `users/${userIdToFetch}/certificates`)
        : null,
    [firestore, userIdToFetch]
  );
  const { data: certificates, isLoading: certificatesLoading } =
    useCollection<Certificate>(certificatesQuery);

  const projectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      role: '',
      teamMembersRaw: '',
      link: '',
      status: 'davam edir',
    },
  });

  const achievementForm = useForm<z.infer<typeof achievementSchema>>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      name: '',
      description: '',
      position: '',
      level: 'Universitet',
      date: '',
      link: '',
    },
  });

  const certificateForm = useForm<z.infer<typeof certificateSchema>>({
    resolver: zodResolver(certificateSchema),
    defaultValues: { name: '', level: 'Universitet', certificateURL: '' },
  });

  const triggerTalentScoreUpdate = useCallback(
    async (userId: string) => {
      if (!firestore) return;
      try {
        const allUsersSnapshot = await getDocs(
          query(collection(firestore, 'users'), where('role', '==', 'student'))
        );

        const allStudentsContext = await Promise.all(
          allUsersSnapshot.docs.map(async (userDoc) => {
            const data = userDoc.data() as Student;
            const studentId = userDoc.id;

            const projectsSnap = await getDocs(
              query(
                collection(firestore, 'projects'),
                where('studentId', '==', studentId)
              )
            );
            const achievementsSnap = await getDocs(
              query(
                collection(firestore, 'achievements'),
                where('studentId', '==', studentId)
              )
            );
            const certificatesSnap = await getDocs(
              collection(firestore, `users/${studentId}/certificates`)
            );

            return {
              id: studentId,
              talentScore: data.talentScore || 0,
              skills: data.skills || [],
              gpa: data.gpa || 0,
              courseYear: data.courseYear || 1,
              projects: projectsSnap.docs.map((d) => d.data()),
              achievements: achievementsSnap.docs.map((d) => d.data()),
              certificates: certificatesSnap.docs.map((d) => d.data()),
            };
          })
        );

        if (allStudentsContext.length === 0) return;

        const scoreResult = await calculateTalentScore({
          targetStudentId: userId,
          allStudents: allStudentsContext as any,
        });

        const targetUserDoc = doc(firestore, 'users', userId);
        await addDocumentNonBlocking(targetUserDoc, {
          talentScore: scoreResult.talentScore,
        });

        toast({
          title: 'İstedad Balınız Yeniləndi!',
          description: `Arxa planda hesablanan yeni balınız: ${scoreResult.talentScore}.`,
        });
      } catch (error: any) {
        console.error('Error updating talent score in background:', error);
      }
    },
    [firestore, toast]
  );

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, authLoading, router]);

  const handleFileUpload = async (
    file: File,
    type: 'sekil' | 'sened'
  ): Promise<string | null> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const endpoint =
      type === 'sekil' ? '/api/upload/sekiller' : '/api/upload/senedler';

    try {
      const response = await fetch(endpoint, { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) {
        toast({ title: 'Fayl uğurla yükləndi.' });
        return result.url;
      } else {
        throw new Error(result.error || 'Fayl yüklənərkən xəta baş verdi.');
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Yükləmə Xətası',
        description: err.message,
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };


  const onProjectSubmit: SubmitHandler<z.infer<typeof projectSchema>> = async (
    data
  ) => {
    if (!userIdToFetch || !firestore) return;

    const { teamMembersRaw, ...rest } = data;

    const teamMembers: string[] = teamMembersRaw
      ? teamMembersRaw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const projectCollectionRef = collection(firestore, `projects`);

    await addDocumentNonBlocking(projectCollectionRef, {
      ...rest,
      studentId: userIdToFetch,
      ownerType: 'student',
      teamMembers,
      teamMemberIds: [],
      invitedStudentIds: [],
    });

    projectForm.reset({
      title: '',
      description: '',
      role: '',
      teamMembersRaw: '',
      link: '',
      status: 'davam edir',
    });

    toast({ title: 'Layihə əlavə edildi' });
    triggerTalentScoreUpdate(userIdToFetch);
  };

  const onAchievementSubmit: SubmitHandler<
    z.infer<typeof achievementSchema>
  > = async (data) => {
    if (!userIdToFetch || !firestore) return;
    const achievementCollectionRef = collection(firestore, `achievements`);
    await addDocumentNonBlocking(achievementCollectionRef, {
      ...data,
      studentId: userIdToFetch,
    });
    achievementForm.reset();
    toast({ title: 'Nailiyyət əlavə edildi' });
    triggerTalentScoreUpdate(userIdToFetch);
  };

  const onCertificateSubmit: SubmitHandler<
    z.infer<typeof certificateSchema>
  > = async (data) => {
    if (!userIdToFetch || !firestore) return;
    const fileInput = certificateFileInputRef.current;
    let finalCertificateURL = data.certificateURL;

    if (fileInput?.files?.[0]) {
      const url = await handleFileUpload(fileInput.files[0], 'sened');
      if (!url) return;
      finalCertificateURL = url;
    }

    if (!finalCertificateURL) {
      toast({
        variant: 'destructive',
        title: 'Xəta',
        description:
          'Sertifikat üçün fayl yükləməli və ya link daxil etməlisiniz.',
      });
      return;
    }

    const certificateCollectionRef = collection(
      firestore,
      `users/${userIdToFetch}/certificates`
    );
    await addDocumentNonBlocking(certificateCollectionRef, {
      ...data,
      certificateURL: finalCertificateURL,
      studentId: userIdToFetch,
    });

    certificateForm.reset();
    if (fileInput) fileInput.value = '';

    toast({ title: 'Sertifikat əlavə edildi' });
    triggerTalentScoreUpdate(userIdToFetch);
  };

  const handleDelete = async (
    docId: string,
    itemType: 'project' | 'achievement' | 'certificate'
  ) => {
    if (!userIdToFetch || !firestore) return;
    let docRef: DocumentReference;

    switch (itemType) {
      case 'project':
        docRef = doc(firestore, 'projects', docId);
        break;
      case 'achievement':
        docRef = doc(firestore, 'achievements', docId);
        break;
      case 'certificate':
        docRef = doc(
          firestore,
          `users/${userIdToFetch}/certificates`,
          docId
        );
        break;
      default:
        return;
    }

    await deleteDocumentNonBlocking(docRef);
    toast({ title: 'Element silindi' });
    triggerTalentScoreUpdate(userIdToFetch);
  };

  if (authLoading || userLoading)
    return (
      <div className="container mx-auto py-8 text-center">Yüklənir...</div>
    );
  if (!targetUser)
    return (
      <div className="container mx-auto py-8 text-center">
        İstifadəçi tapılmadı.
      </div>
    );

  return (
    <>
      <div className="container mx-auto max-w-4xl py-8 md:py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Profili Redaktə Et
          </h1>
          <p className="text-muted-foreground">
            Profil məlumatlarınızı, layihə və nailiyyətlərinizi buradan idarə
            edin.
          </p>
        </div>

        <div className="space-y-8">
          {/* Projects Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase /> Layihələr
              </CardTitle>
              <CardDescription>
                Gördüyünüz işləri və layihələri profilinizə əlavə edin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...projectForm}>
                <form
                  onSubmit={projectForm.handleSubmit(onProjectSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    name="title"
                    control={projectForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Layihə Adı</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="description"
                    control={projectForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Təsvir</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="teamMembersRaw"
                    control={projectForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Komanda Üzvləri</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Adları vergül ilə ayırın"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      name="role"
                      control={projectForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rolunuz</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Məs: Developer, Dizayner"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="status"
                      control={projectForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="davam edir">
                                Davam edir
                              </SelectItem>
                              <SelectItem value="tamamlanıb">
                                Tamamlanıb
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    name="link"
                    control={projectForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Layihə Linki (GitHub, Vebsayt və s.)
                        </FormLabel>
                        <FormControl>
                          <Input type="url" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isUploading}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Layihə Əlavə Et
                  </Button>
                </form>
              </Form>

              <Separator className="my-6" />
              <h4 className="text-md font-medium mb-4">Mövcud Layihələr</h4>
              <div className="space-y-4">
                {projectsLoading ? (
                  <p>Yüklənir...</p>
                ) : (
                  projects?.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center p-2 border rounded-md"
                    >
                      <span>{p.title}</span>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Silməni təsdiq edirsiniz?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu əməliyyat geri qaytarıla bilməz. "{p.title}"
                              adlı layihə profilinizdən həmişəlik silinəcək.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(p.id, 'project')}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Bəli, sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Achievements Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award /> Nailiyyətlər
              </CardTitle>
              <CardDescription>
                Qazandığınız uğurları və mükafatları qeyd edin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...achievementForm}>
                <form
                  onSubmit={achievementForm.handleSubmit(onAchievementSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    name="name"
                    control={achievementForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nailiyyətin Adı (Müsabiqə, Olimpiada və s.)
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="description"
                    control={achievementForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Təsvir (Könüllü)</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      name="position"
                      control={achievementForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tutduğunuz Yer/Dərəcə</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Məs: 1-ci yer, Qızıl medal"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="level"
                      control={achievementForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Səviyyə</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(
                                [
                                  'Universitet',
                                  'Regional',
                                  'Respublika',
                                  'Beynəlxalq',
                                ] as AchievementLevel[]
                              ).map((l) => (
                                <SelectItem key={l} value={l}>
                                  {l}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      name="date"
                      control={achievementForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tarix</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="link"
                      control={achievementForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Təsdiq Linki (Könüllü)</FormLabel>
                          <FormControl>
                            <Input type="url" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={isUploading}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nailiyyət Əlavə Et
                  </Button>
                </form>
              </Form>

              <Separator className="my-6" />
              <h4 className="text-md font-medium mb-4">Mövcud Nailiyyətlər</h4>
              <div className="space-y-4">
                {achievementsLoading ? (
                  <p>Yüklənir...</p>
                ) : (
                  achievements?.map((a) => (
                    <div
                      key={a.id}
                      className="flex justify-between items-center p-2 border rounded-md"
                    >
                      <span>
                        {a.name} - {a.position}
                      </span>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Silməni təsdiq edirsiniz?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu əməliyyat geri qaytarıla bilməz. "{a.name}"
                              adlı nailiyyət profilinizdən həmişəlik silinəcək.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDelete(a.id, 'achievement')
                              }
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Bəli, sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Certificates Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText /> Sertifikatlar
              </CardTitle>
              <CardDescription>
                Əldə etdiyiniz sertifikatları profilinizə əlavə edin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...certificateForm}>
                <form
                  onSubmit={certificateForm.handleSubmit(onCertificateSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    name="name"
                    control={certificateForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sertifikatın Adı</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Sertifikat Faylı</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        ref={certificateFileInputRef}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormField
                    name="level"
                    control={certificateForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Səviyyə</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(
                              [
                                'Universitet',
                                'Regional',
                                'Respublika',
                                'Beynəlxalq',
                              ] as AchievementLevel[]
                            ).map((l) => (
                              <SelectItem key={l} value={l}>
                                {l}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isUploading}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Sertifikat Əlavə Et
                  </Button>
                </form>
              </Form>

              <Separator className="my-6" />
              <h4 className="text-md font-medium mb-4">Mövcud Sertifikatlar</h4>
              <div className="space-y-4">
                {certificatesLoading ? (
                  <p>Yüklənir...</p>
                ) : (
                  certificates?.map((c) => (
                    <div
                      key={c.id}
                      className="flex justify-between items-center p-2 border rounded-md"
                    >
                      <a
                        href={c.certificateURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {c.name}
                      </a>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Silməni təsdiq edirsiniz?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu əməliyyat geri qaytarılmazdır. "{c.name}" adlı
                              sertifikat profilinizdən həmişəlik silinəcək.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDelete(c.id, 'certificate')
                              }
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Bəli, sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function EditProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-8 text-center">Yüklənir...</div>
      }
    >
      <EditProfilePageComponent />
    </Suspense>
  );
}
