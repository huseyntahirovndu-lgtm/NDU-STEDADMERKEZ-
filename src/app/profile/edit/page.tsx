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
  Skill,
  SkillLevel,
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
  FormDescription
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
  User as UserIcon,
  X,
  Upload,
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
import { Badge } from '@/components/ui/badge';
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
  updateDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import AvatarEditor from 'react-avatar-editor';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const skillSchema = z.object({
  name: z.string().min(1, 'Bacarıq adı boş ola bilməz.'),
  level: z.enum(['Başlanğıc', 'Orta', 'İrəli']),
});

const profileSchema = z.object({
  firstName: z.string().min(2, 'Ad ən azı 2 hərf olmalıdır.'),
  lastName: z.string().min(2, 'Soyad ən azı 2 hərf olmalıdır.'),
  major: z.string().min(2, 'İxtisas boş ola bilməz.'),
  courseYear: z.coerce.number().min(1, 'Təhsil ilini seçin.').max(6),
  educationForm: z.string().optional(),
  gpa: z
    .coerce
    .number({ invalid_type_error: 'ÜOMG mütləq qeyd edilməlidir.' })
    .min(0, 'ÜOMG 0-dan az ola bilməz.')
    .max(100, 'ÜOMG 100-dən çox ola bilməz.')
    .optional()
    .nullable(),
  skills: z.array(skillSchema).optional(),
  successStory: z.string().optional(),
  linkedInURL: z.string().url().or(z.literal('')).optional(),
  githubURL: z.string().url().or(z.literal('')).optional(),
  behanceURL: z.string().url().or(z.literal('')).optional(),
  instagramURL: z.string().url().or(z.literal('')).optional(),
  portfolioURL: z.string().url().or(z.literal('')).optional(),
  googleScholarURL: z.string().url().or(z.literal('')).optional(),
  youtubeURL: z.string().url().or(z.literal('')).optional(),
});

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

const SKILL_LEVELS: SkillLevel[] = ['Başlanğıc', 'Orta', 'İrəli'];

function EditProfilePageComponent() {
  const { user: currentUser, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [editorOpen, setEditorOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.2);
  const [localProfilePicUrl, setLocalProfilePicUrl] = useState<string | null>(null);
  const [newProfilePicBlob, setNewProfilePicBlob] = useState<Blob | null>(null);


  const editorRef = useRef<AvatarEditor>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
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

  const [skillInput, setSkillInput] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Başlanğıc');

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
  });

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
        await updateDocumentNonBlocking(targetUserDoc, {
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

  useEffect(() => {
    if (targetUser) {
      profileForm.reset({
        firstName: targetUser.firstName || '',
        lastName: targetUser.lastName || '',
        major: targetUser.major || '',
        courseYear: targetUser.courseYear || 1,
        educationForm: targetUser.educationForm || '',
        gpa: targetUser.gpa ?? null,
        skills: targetUser.skills || [],
        successStory: targetUser.successStory || '',
        linkedInURL: targetUser.linkedInURL || '',
        githubURL: targetUser.githubURL || '',
        behanceURL: targetUser.behanceURL || '',
        instagramURL: targetUser.instagramURL || '',
        portfolioURL: targetUser.portfolioURL || '',
        googleScholarURL: targetUser.googleScholarURL || '',
        youtubeURL: targetUser.youtubeURL || '',
      });
      setLocalProfilePicUrl(targetUser.profilePictureUrl || null);
    }
  }, [targetUser, profileForm]);

  const handleFileUpload = async (
    file: File | Blob,
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

  const onProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setEditorOpen(true);
    }
    e.target.value = '';
  };

  const handleSaveCroppedImage = () => {
    if (editorRef.current) {
        const canvas = editorRef.current.getImageScaledToCanvas();
        setLocalProfilePicUrl(canvas.toDataURL());
        canvas.toBlob((blob) => {
            if (blob) {
                setNewProfilePicBlob(blob);
            }
        }, 'image/jpeg');
        setEditorOpen(false);
        setImageSrc(null);
    }
  };

  const onProfileSubmit: SubmitHandler<z.infer<typeof profileSchema>> = async (
    data
  ) => {
    if (!targetUser || !userDocRef) return;
    setIsSaving(true);
    
    let finalProfilePicUrl = targetUser.profilePictureUrl;

    if (newProfilePicBlob) {
        const uploadedUrl = await handleFileUpload(newProfilePicBlob, 'sekil');
        if (uploadedUrl) {
            finalProfilePicUrl = uploadedUrl;
        } else {
            setIsSaving(false);
            return;
        }
    }

    const payload = {
      ...data,
      profilePictureUrl: finalProfilePicUrl,
      gpa: Number(data.gpa) || 0,
    };

    await updateDocumentNonBlocking(userDocRef, payload);

    if (currentUser && currentUser.id === targetUser.id) {
      updateUser({
        ...currentUser,
        ...payload,
      });
    }

    toast({ title: 'Profil məlumatları yadda saxlanıldı.' });
    setIsSaving(false);
    setNewProfilePicBlob(null);
    triggerTalentScoreUpdate(targetUser.id);
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

  const handleSkillAdd = () => {
    const trimmedInput = skillInput.trim();
    if (trimmedInput) {
      const newSkill: Skill = { name: trimmedInput, level: skillLevel };
      const currentSkills = profileForm.getValues('skills') || [];
      if (
        !currentSkills.some(
          (s) => s?.name?.toLowerCase() === newSkill.name.toLowerCase()
        )
      ) {
        profileForm.setValue('skills', [...currentSkills, newSkill], {
          shouldValidate: true,
          shouldDirty: true,
        });
        setSkillInput('');
        setSkillLevel('Başlanğıc');
        skillInputRef.current?.focus();
      } else {
        toast({
          variant: 'destructive',
          title: 'Bu bacarıq artıq mövcuddur.',
        });
      }
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    profileForm.setValue(
      'skills',
      (profileForm.getValues('skills') || []).filter(
        (skill) => skill.name !== skillToRemove
      ),
      { shouldValidate: true, shouldDirty: true }
    );
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

  const getInitials = (firstName?: string, lastName?: string) =>
    `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;

  return (
    <>
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profil Şəklini Tənzimlə</DialogTitle>
            <DialogDescription>
              Şəkli yaxınlaşdırın və çərçivəyə uyğunlaşdırın.
            </DialogDescription>
          </DialogHeader>
          {imageSrc && (
            <div className="flex flex-col items-center gap-4">
              <AvatarEditor
                ref={editorRef}
                image={imageSrc}
                width={250}
                height={250}
                border={50}
                borderRadius={125}
                color={[0, 0, 0, 0.6]}
                scale={zoom}
                rotate={0}
              />
              <div className="w-full max-w-xs space-y-2">
                <Label htmlFor="zoom">Yaxınlaşdırma</Label>
                <Slider
                  id="zoom"
                  min={1}
                  max={3}
                  step={0.1}
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Ləğv et
            </Button>
            <Button onClick={handleSaveCroppedImage} disabled={isUploading}>
              {isUploading ? 'Yüklənir...' : 'Təsdiqlə'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon /> Şəxsi Məlumatlar
              </CardTitle>
              <CardDescription>
                Əsas profil məlumatlarınızı, bacarıqlarınızı və sosial media
                hesablarınızı yeniləyin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                    {/* Left Column - Avatar */}
                    <div className="flex flex-col items-center">
                       <FormItem>
                          <FormLabel className="text-center block mb-2">Profil Şəkli</FormLabel>
                            <Avatar className="h-32 w-32">
                              <AvatarImage
                                src={localProfilePicUrl || undefined}
                                alt={targetUser.firstName}
                              />
                              <AvatarFallback>
                                {getInitials(
                                  targetUser.firstName,
                                  targetUser.lastName
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <Button
                              type="button"
                              variant="outline"
                              className="mt-4"
                              onClick={() =>
                                profilePictureInputRef.current?.click()
                              }
                              disabled={isUploading}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              {isUploading ? 'Yüklənir...' : 'Dəyiş'}
                            </Button>
                            <Input
                              ref={profilePictureInputRef}
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={onProfilePictureChange}
                            />
                        </FormItem>
                    </div>

                    {/* Right Column - Fields */}
                    <div className="space-y-4">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            name="firstName"
                            control={profileForm.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ad</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="lastName"
                            control={profileForm.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Soyad</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                       </div>
                       <FormField
                          name="major"
                          control={profileForm.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>İxtisas</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            name="courseYear"
                            control={profileForm.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Təhsil ili</FormLabel>
                                <Select
                                  onValueChange={(value) =>
                                    field.onChange(parseInt(value, 10))
                                  }
                                  value={String(field.value)}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Təhsil ilini seçin" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {[1, 2, 3, 4, 5, 6].map((y) => (
                                      <SelectItem key={y} value={String(y)}>
                                        {y}-ci kurs
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="gpa"
                            control={profileForm.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ÜOMG (Könüllü)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    {...field}
                                    value={field.value ?? ''}
                                    placeholder="Məs: 85.5"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                       </div>
                    </div>
                  </div>

                  <Separator />

                  <FormField
                    name="skills"
                    control={profileForm.control}
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium">Bacarıqlar</FormLabel>
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
                           <div className="flex-grow w-full">
                            <FormLabel className="text-xs text-muted-foreground">Bacarıq adı</FormLabel>
                            <Input
                                ref={skillInputRef}
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSkillAdd();
                                }
                                }}
                                placeholder="Məs: Python, Figma"
                            />
                           </div>
                           <div className="w-full sm:w-auto">
                             <FormLabel className="text-xs text-muted-foreground">Səviyyə</FormLabel>
                            <Select
                              value={skillLevel}
                              onValueChange={(value) =>
                                setSkillLevel(value as SkillLevel)
                              }
                            >
                             <SelectTrigger>
                                <SelectValue placeholder="Səviyyə seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {SKILL_LEVELS.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                           </div>
                           <Button
                              type="button"
                              onClick={handleSkillAdd}
                              className="w-full sm:w-auto shrink-0"
                            >
                              Əlavə et
                            </Button>
                        </div>
                        <FormMessage />
                        <div className="flex flex-wrap gap-2 pt-2 min-h-[2.5rem]">
                          {profileForm.watch('skills')?.map((skill) => (
                            <Badge
                              key={skill.name}
                              variant="secondary"
                              className="flex items-center gap-2 text-sm"
                            >
                              {skill.name}{' '}
                              <span className="text-xs opacity-70">
                                ({skill.level})
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSkillRemove(skill.name)
                                }
                                className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={profileForm.control}
                    name="successStory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium">
                            Uğur Hekayəsi (Könüllü)
                            <span className="block text-xs font-normal text-muted-foreground mt-1">
                                Bu hekayə ana səhifədə nümayiş etdirilə bilər.
                            </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Platforma sayəsində qazandığınız bir uğuru və ya təcrübəni burada paylaşın..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />
                  <h3 className="text-lg font-medium">Sosial Linklər</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        name="linkedInURL"
                        control={profileForm.control}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>LinkedIn URL</FormLabel>
                            <FormControl>
                            <Input placeholder="https://linkedin.com/in/..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        name="githubURL"
                        control={profileForm.control}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>GitHub URL</FormLabel>
                            <FormControl>
                            <Input placeholder="https://github.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        name="portfolioURL"
                        control={profileForm.control}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Portfolio URL</FormLabel>
                            <FormControl>
                            <Input placeholder="https://sizin-saytiniz.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        name="behanceURL"
                        control={profileForm.control}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Behance URL</FormLabel>
                            <FormControl>
                            <Input placeholder="https://behance.net/..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isSaving || isUploading}>
                        {isSaving ? 'Yadda saxlanılır...' : 'Dəyişiklikləri Yadda Saxla'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

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
                        <FormLabel>Komanda Üzvləri (Könüllü)</FormLabel>
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
                  <Button type="submit" disabled={isSaving || isUploading}>
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
                ) : projects && projects.length > 0 ? (
                  projects.map((p) => (
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
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Heç bir layihə əlavə edilməyib.</p>
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
                  <Button type="submit" disabled={isSaving || isUploading}>
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
                ) : achievements && achievements.length > 0 ? (
                  achievements.map((a) => (
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
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Heç bir nailiyyət əlavə edilməyib.</p>
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
                    <FormLabel>Sertifikat Faylı və ya Linki</FormLabel>
                     <FormControl>
                      <Input
                        type="file"
                        ref={certificateFileInputRef}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        disabled={isUploading}
                      />
                    </FormControl>
                     <p className="text-sm text-muted-foreground pt-1">
                        Fayl yükləyə və ya aşağıdakı xanaya link daxil edə bilərsiniz.
                     </p>
                  </FormItem>
                   <FormField
                    name="certificateURL"
                    control={certificateForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="url" {...field} placeholder="Və ya link daxil edin" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <Button type="submit" disabled={isSaving || isUploading}>
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
                ) : certificates && certificates.length > 0 ? (
                  certificates.map((c) => (
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
                              Bu əməliyyat geri qaytarıla bilməz. "{c.name}" adlı
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
                ) : (
                     <p className="text-sm text-muted-foreground text-center py-4">Heç bir sertifikat əlavə edilməyib.</p>
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
