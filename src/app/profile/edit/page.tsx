'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useEffect,
  useState,
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
import { Skeleton } from '@/components/ui/skeleton';

// --- Zod Schemas for Validation ---
const skillSchema = z.object({
  name: z.string().min(1, 'Bacarıq adı boş ola bilməz.'),
  level: z.enum(['Başlanğıc', 'Orta', 'İrəli']),
});

const profileSchema = z.object({
  firstName: z.string().min(2, 'Ad ən azı 2 hərf olmalıdır.'),
  lastName: z.string().min(2, 'Soyad ən azı 2 hərf olmalıdır.'),
  profilePictureUrl: z.string().url('Etibarlı bir URL daxil edin.').or(z.literal('')).optional(),
  major: z.string().min(2, 'İxtisas boş ola bilməz.'),
  courseYear: z.coerce.number().min(1, 'Təhsil ilini seçin.').max(6),
  educationForm: z.string().optional(),
  gpa: z.coerce.number().min(0).max(100).optional().nullable(),
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
  link: z.string().url().or(z.literal('')).optional(),
  status: z.enum(['davam edir', 'tamamlanıb']),
});

const achievementSchema = z.object({
  name: z.string().min(3, 'Nailiyyət adı boş ola bilməz.'),
  description: z.string().optional(),
  position: z.string().min(1, 'Dərəcə boş ola bilməz.'),
  level: z.enum(['Beynəlxalq', 'Respublika', 'Regional', 'Universitet']),
  date: z.string().min(1, 'Tarix boş ola bilməz.'),
  link: z.string().url().or(z.literal('')).optional(),
});

const certificateSchema = z.object({
  name: z.string().min(3, 'Sertifikat adı boş ola bilməz.'),
  certificateURL: z.string().url().or(z.literal('')).optional(),
  level: z.enum(['Beynəlxalq', 'Respublika', 'Regional', 'Universitet']),
});

const SKILL_LEVELS: SkillLevel[] = ['Başlanğıc', 'Orta', 'İrəli'];

// --- Main Edit Profile Component ---
function EditProfilePageComponent() {
  // --- Hooks and State Initialization ---
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
  const [skillInput, setSkillInput] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Başlanğıc');

  const editorRef = useRef<AvatarEditor>(null);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const certificateFileInputRef = useRef<HTMLInputElement>(null);

  // --- Determine Target User ---
  const userIdFromQuery = searchParams.get('userId');
  const userIdToFetch = (currentUser?.role === 'admin' && userIdFromQuery) ? userIdFromQuery : (currentUser?.id || null);

  // --- Firebase Data Fetching Hooks ---
  const userDocRef = useMemoFirebase(() => (userIdToFetch && firestore) ? doc(firestore, 'users', userIdToFetch) : null, [firestore, userIdToFetch]);
  const { data: targetUser, isLoading: userLoading } = useDoc<Student>(userDocRef);

  const projectsQuery = useMemoFirebase(() => (userIdToFetch && firestore) ? query(collection(firestore, 'projects'), where('studentId', '==', userIdToFetch)) : null, [firestore, userIdToFetch]);
  const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsQuery);

  const achievementsQuery = useMemoFirebase(() => (userIdToFetch && firestore) ? query(collection(firestore, 'achievements'), where('studentId', '==', userIdToFetch)) : null, [firestore, userIdToFetch]);
  const { data: achievements, isLoading: achievementsLoading } = useCollection<Achievement>(achievementsQuery);

  const certificatesQuery = useMemoFirebase(() => (userIdToFetch && firestore) ? collection(firestore, `users/${userIdToFetch}/certificates`) : null, [firestore, userIdToFetch]);
  const { data: certificates, isLoading: certificatesLoading } = useCollection<Certificate>(certificatesQuery);

  // --- Form Initialization ---
  const profileForm = useForm<z.infer<typeof profileSchema>>({ resolver: zodResolver(profileSchema), mode: 'onChange' });
  const projectForm = useForm<z.infer<typeof projectSchema>>({ resolver: zodResolver(projectSchema), defaultValues: { title: '', description: '', role: '', teamMembersRaw: '', link: '', status: 'davam edir' } });
  const achievementForm = useForm<z.infer<typeof achievementSchema>>({ resolver: zodResolver(achievementSchema), defaultValues: { name: '', description: '', position: '', level: 'Universitet', date: '', link: '' } });
  const certificateForm = useForm<z.infer<typeof certificateSchema>>({ resolver: zodResolver(certificateSchema), defaultValues: { name: '', level: 'Universitet', certificateURL: '' } });

  // --- Effects ---
  useEffect(() => {
    if (!authLoading && !currentUser) router.push('/login');
  }, [currentUser, authLoading, router]);

  useEffect(() => {
    if (targetUser) {
      profileForm.reset({
        firstName: targetUser.firstName || '',
        lastName: targetUser.lastName || '',
        profilePictureUrl: targetUser.profilePictureUrl || '',
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
    }
  }, [targetUser, profileForm]);

  // --- Helper & Handler Functions ---
  const triggerTalentScoreUpdate = async (userId: string) => {
    if (!firestore) return;
    try {
      const allUsersSnapshot = await getDocs(query(collection(firestore, 'users'), where('role', '==', 'student')));
      const allStudentsContext = await Promise.all(
        allUsersSnapshot.docs.map(async (userDoc) => {
          const data = userDoc.data() as Student;
          const studentId = userDoc.id;
          const [projectsSnap, achievementsSnap, certificatesSnap] = await Promise.all([
            getDocs(query(collection(firestore, 'projects'), where('studentId', '==', studentId))),
            getDocs(query(collection(firestore, 'achievements'), where('studentId', '==', studentId))),
            getDocs(collection(firestore, `users/${studentId}/certificates`)),
          ]);
          return { id: studentId, talentScore: data.talentScore, skills: data.skills, gpa: data.gpa, courseYear: data.courseYear, projects: projectsSnap.docs.map(d => d.data()), achievements: achievementsSnap.docs.map(d => d.data()), certificates: certificatesSnap.docs.map(d => d.data()) };
        })
      );

      if (allStudentsContext.length === 0) return;
      const scoreResult = await calculateTalentScore({ targetStudentId: userId, allStudents: allStudentsContext as any });
      await updateDocumentNonBlocking(doc(firestore, 'users', userId), { talentScore: scoreResult.talentScore });
      toast({ title: 'İstedad Balınız Yeniləndi!', description: `Arxa planda hesablanan yeni balınız: ${scoreResult.talentScore}.` });
    } catch (error) { console.error('Error updating talent score:', error); }
  };

  const handleFileUpload = async (file: File, type: 'sekil' | 'sened'): Promise<string | null> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const endpoint = type === 'sekil' ? '/api/upload/sekiller' : '/api/upload/senedler';
    try {
      const response = await fetch(endpoint, { method: 'POST', body: formData });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Yükləmə zamanı xəta baş verdi.');
      toast({ title: 'Fayl uğurla yükləndi.' });
      return result.url;
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Yükləmə Xətası', description: err.message });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setEditorOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCroppedImage = () => {
    if (!editorRef.current) return;
    const canvas = editorRef.current.getImageScaledToCanvas();
    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
        const url = await handleFileUpload(file, 'sekil');
        if (url) {
          profileForm.setValue('profilePictureUrl', url, { shouldValidate: true, shouldDirty: true });
          setEditorOpen(false);
        }
      }
    }, 'image/jpeg');
  };

  const onProfileSubmit: SubmitHandler<z.infer<typeof profileSchema>> = async (data) => {
    if (!userDocRef || !userIdToFetch) return;
    setIsSaving(true);
    try {
      await updateDocumentNonBlocking(userDocRef, data);
      toast({ title: 'Profil uğurla yeniləndi.' });
      if (currentUser?.id === userIdToFetch) {
        updateUser(data);
      }
      triggerTalentScoreUpdate(userIdToFetch);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Xəta', description: 'Profil yenilənərkən problem baş verdi.' });
    } finally {
      setIsSaving(false);
    }
  };

  const onAddItem = async <T extends { title: string } | { name: string }>(
    form: any,
    schema: any,
    collectionName: string,
    additionalData: object = {}
  ) => {
    try {
      const values = await form.trigger();
      if (!values) return;
      if (!userIdToFetch || !firestore) return;
      const data = form.getValues();

      let finalData = { ...data, ...additionalData, studentId: userIdToFetch };
      
      if (collectionName === 'projects' && data.teamMembersRaw) {
        finalData.teamMembers = data.teamMembersRaw.split(',').map((s: string) => s.trim()).filter(Boolean);
        delete finalData.teamMembersRaw;
      }
      
      await addDocumentNonBlocking(collection(firestore, collectionName), finalData);
      form.reset();
      toast({ title: `${('title' in data ? data.title : data.name)} əlavə edildi.` });
      triggerTalentScoreUpdate(userIdToFetch);
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Xəta', description: 'Element əlavə edilərkən problem baş verdi.' });
    }
  };
  
   const onCertificateAdd = async () => {
    try {
      const values = await certificateForm.trigger();
      if (!values) return;
      if (!userIdToFetch || !firestore) return;
      const data = certificateForm.getValues();
      const fileInput = certificateFileInputRef.current;
      let finalCertificateURL = data.certificateURL;

      if (fileInput?.files?.[0]) {
        const url = await handleFileUpload(fileInput.files[0], 'sened');
        if (!url) return; // Stop if upload fails
        finalCertificateURL = url;
      }

      if (!finalCertificateURL) {
        toast({ variant: 'destructive', title: 'Xəta', description: 'Sertifikat üçün fayl yükləməli və ya link daxil etməlisiniz.' });
        return;
      }
      
      await addDocumentNonBlocking(collection(firestore, `users/${userIdToFetch}/certificates`), { ...data, certificateURL: finalCertificateURL, studentId: userIdToFetch });
      certificateForm.reset();
      if (fileInput) fileInput.value = '';
      toast({ title: `Sertifikat əlavə edildi.` });
      triggerTalentScoreUpdate(userIdToFetch);
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Xəta', description: 'Sertifikat əlavə edilərkən problem baş verdi.' });
    }
  };

  const onDeleteItem = async (id: string, collectionPath: string, itemName: string) => {
    if (!firestore || !userIdToFetch) return;
    try {
      await deleteDocumentNonBlocking(doc(firestore, collectionPath, id));
      toast({ title: `"${itemName}" silindi.` });
      triggerTalentScoreUpdate(userIdToFetch);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Xəta', description: 'Element silinərkən problem baş verdi.' });
    }
  };

  const handleSkillAdd = () => {
    const trimmedInput = skillInput.trim();
    if (!trimmedInput) return;
    const currentSkills = profileForm.getValues('skills') || [];
    if (currentSkills.some(s => s.name.toLowerCase() === trimmedInput.toLowerCase())) {
      toast({ variant: 'destructive', title: 'Bu bacarıq artıq mövcuddur.' });
      return;
    }
    const newSkill: Skill = { name: trimmedInput, level: skillLevel };
    profileForm.setValue('skills', [...currentSkills, newSkill], { shouldDirty: true });
    setSkillInput('');
    setSkillLevel('Başlanğıc');
  };

  const handleSkillRemove = (skillName: string) => {
    const currentSkills = profileForm.getValues('skills') || [];
    profileForm.setValue(currentSkills.filter(skill => skill.name !== skillName), { shouldDirty: true });
  };
  
  if (authLoading || userLoading) return <div className="container mx-auto py-8 text-center">Yüklənir...</div>;
  if (!targetUser) return <div className="container mx-auto py-8 text-center">İstifadəçi tapılmadı.</div>;
  
  // --- Render ---
  return (
    <>
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profil Şəklini Tənzimlə</DialogTitle>
            <DialogDescription>Şəkli yaxınlaşdırın və çərçivəyə uyğunlaşdırın.</DialogDescription>
          </DialogHeader>
          {imageSrc && (
            <div className="flex flex-col items-center gap-4">
              <AvatarEditor ref={editorRef} image={imageSrc} width={250} height={250} border={50} borderRadius={125} color={[0, 0, 0, 0.6]} scale={zoom} rotate={0} />
              <div className="w-full max-w-xs space-y-2">
                <Label htmlFor="zoom">Yaxınlaşdırma</Label>
                <Slider id="zoom" min={1} max={3} step={0.1} value={[zoom]} onValueChange={(value) => setZoom(value[0])} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Ləğv et</Button>
            <Button onClick={handleSaveCroppedImage} disabled={isUploading}>{isUploading ? 'Yüklənir...' : 'Yadda Saxla'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="container mx-auto max-w-4xl py-8 md:py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profili Redaktə Et</h1>
          <p className="text-muted-foreground">Profil məlumatlarınızı, layihə və nailiyyətlərinizi buradan idarə edin.</p>
        </div>

        <div className="space-y-8">
            {/* Şəxsi Məlumatlar Kartı */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserIcon /> Şəxsi Məlumatlar</CardTitle>
                    <CardDescription>Əsas profil məlumatlarınızı və sosial media hesablarınızı yeniləyin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                            {/* Ad və Soyad */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField name="firstName" control={profileForm.control} render={({ field }) => (<FormItem><FormLabel>Ad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="lastName" control={profileForm.control} render={({ field }) => (<FormItem><FormLabel>Soyad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>

                            {/* Profil Şəkli */}
                            <FormItem>
                                <FormLabel>Profil Şəkli</FormLabel>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20"><AvatarImage src={profileForm.watch('profilePictureUrl')} /><AvatarFallback>{targetUser.firstName?.charAt(0)}{targetUser.lastName?.charAt(0)}</AvatarFallback></Avatar>
                                    <Button type="button" onClick={() => profilePictureInputRef.current?.click()} disabled={isUploading}><Upload className="mr-2 h-4 w-4" />{isUploading ? 'Yüklənir...' : 'Şəkil Dəyiş'}</Button>
                                    <input ref={profilePictureInputRef} type="file" className="hidden" accept="image/*" onChange={handleProfilePictureChange} />
                                </div>
                            </FormItem>

                            {/* İxtisas və Təhsil ili */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField name="major" control={profileForm.control} render={({ field }) => (<FormItem><FormLabel>İxtisas</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="courseYear" control={profileForm.control} render={({ field }) => (<FormItem><FormLabel>Təhsil ili</FormLabel><Select onValueChange={(v) => field.onChange(parseInt(v, 10))} value={String(field.value)}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{[1,2,3,4,5,6].map(y => <SelectItem key={y} value={String(y)}>{y}-ci kurs</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                            </div>

                            {/* Təhsil Forması və GPA */}
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField name="educationForm" control={profileForm.control} render={({ field }) => (<FormItem><FormLabel>Təhsil Forması</FormLabel><FormControl><Input {...field} placeholder="Əyani / Qiyabi" /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="gpa" control={profileForm.control} render={({ field }) => (<FormItem><FormLabel>ÜOMG (GPA)</FormLabel><FormControl><Input type="number" step="0.1" {...field} value={field.value ?? ''} placeholder="Məs: 85.5" /></FormControl><FormMessage /></FormItem>)} />
                            </div>

                            {/* Bacarıqlar */}
                            <FormItem>
                                <FormLabel>Bacarıqlar</FormLabel>
                                <div className="flex flex-col sm:flex-row items-start gap-2">
                                    <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Bacarıq adı" className="flex-grow"/>
                                    <div className="flex w-full sm:w-auto gap-2">
                                        <Select value={skillLevel} onValueChange={(v) => setSkillLevel(v as SkillLevel)}><SelectTrigger className="w-full sm:w-[150px]"><SelectValue /></SelectTrigger><SelectContent>{SKILL_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
                                        <Button type="button" onClick={handleSkillAdd}>Əlavə et</Button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">{profileForm.watch('skills')?.map((skill) => (<Badge key={skill.name} variant="secondary" className="flex items-center gap-2">{skill.name} <span className="text-xs opacity-70">({skill.level})</span><button type="button" onClick={() => handleSkillRemove(skill.name)} className="rounded-full hover:bg-muted-foreground/20 p-0.5"><X className="h-3 w-3" /></button></Badge>))}</div>
                            </FormItem>

                            <Separator />
                            <h3 className="text-lg font-medium">Uğur Hekayəsi</h3>
                            <FormField control={profileForm.control} name="successStory" render={({ field }) => (<FormItem><FormLabel>Uğur Hekayəm</FormLabel><FormControl><Textarea placeholder="Platforma sayəsində qazandığınız bir uğuru və ya təcrübəni burada paylaşın..." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>)} />

                            <Separator />
                            <h3 className="text-lg font-medium">Sosial Linklər</h3>
                            {/* Sosial Link Sahələri */}
                             <FormField name="linkedInURL" control={profileForm.control} render={({ field }) => (<FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField name="githubURL" control={profileForm.control} render={({ field }) => (<FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField name="behanceURL" control={profileForm.control} render={({ field }) => (<FormItem><FormLabel>Behance URL</FormLabel><FormControl><Input placeholder="https://behance.net/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField name="instagramURL" control={profileForm.control} render={({ field }) => (<FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input placeholder="https://instagram.com/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField name="portfolioURL" control={profileForm.control} render={({ field }) => (<FormItem><FormLabel>Portfolio URL</FormLabel><FormControl><Input placeholder="https://sizin-saytiniz.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField name="googleScholarURL" control={profileForm.control} render={({ field }) => (<FormItem><FormLabel>Google Scholar URL</FormLabel><FormControl><Input placeholder="https://scholar.google.com/citations?user=..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField name="youtubeURL" control={profileForm.control} render={({ field }) => (<FormItem><FormLabel>YouTube URL</FormLabel><FormControl><Input placeholder="https://youtube.com/channel/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                             
                             <Button type="submit" disabled={isSaving || isUploading}>{isSaving ? 'Yadda saxlanılır...' : 'Dəyişiklikləri Yadda Saxla'}</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Layihələr, Nailiyyətlər, Sertifikatlar Kartları */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase /> Layihələr</CardTitle></CardHeader>
                <CardContent>
                    <Form {...projectForm}>
                        <form onSubmit={e => { e.preventDefault(); onAddItem(projectForm, projectSchema, 'projects'); }} className="space-y-4 mb-6">
                            <FormField name="title" control={projectForm.control} render={({ field }) => (<FormItem><FormLabel>Layihə Adı</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="description" control={projectForm.control} render={({ field }) => (<FormItem><FormLabel>Təsvir</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="teamMembersRaw" control={projectForm.control} render={({ field }) => (<FormItem><FormLabel>Komanda Üzvləri</FormLabel><FormControl><Input {...field} placeholder="Adları vergül ilə ayırın" /></FormControl><FormMessage /></FormItem>)} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField name="role" control={projectForm.control} render={({ field }) => (<FormItem><FormLabel>Rolunuz</FormLabel><FormControl><Input {...field} placeholder="Məs: Developer" /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="status" control={projectForm.control} render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="davam edir">Davam edir</SelectItem><SelectItem value="tamamlanıb">Tamamlanıb</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            </div>
                            <FormField name="link" control={projectForm.control} render={({ field }) => (<FormItem><FormLabel>Layihə Linki</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" />Layihə Əlavə Et</Button>
                        </form>
                    </Form>
                    <Separator />
                    <div className="space-y-2 mt-4">
                        {projectsLoading ? <p>Yüklənir...</p> : projects?.map(p => (
                            <div key={p.id} className="flex justify-between items-center p-2 border rounded-md"><span>{p.title}</span><Button variant="ghost" size="icon" onClick={() => onDeleteItem(p.id, 'projects', p.title)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Award /> Nailiyyətlər</CardTitle></CardHeader>
                <CardContent>
                    <Form {...achievementForm}>
                        <form onSubmit={e => { e.preventDefault(); onAddItem(achievementForm, achievementSchema, 'achievements'); }} className="space-y-4 mb-6">
                            <FormField name="name" control={achievementForm.control} render={({ field }) => (<FormItem><FormLabel>Nailiyyətin Adı</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="description" control={achievementForm.control} render={({ field }) => (<FormItem><FormLabel>Təsvir</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField name="position" control={achievementForm.control} render={({ field }) => (<FormItem><FormLabel>Dərəcə</FormLabel><FormControl><Input {...field} placeholder="Məs: 1-ci yer" /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="level" control={achievementForm.control} render={({ field }) => (<FormItem><FormLabel>Səviyyə</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{(['Universitet', 'Regional', 'Respublika', 'Beynəlxalq'] as AchievementLevel[]).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField name="date" control={achievementForm.control} render={({ field }) => (<FormItem><FormLabel>Tarix</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="link" control={achievementForm.control} render={({ field }) => (<FormItem><FormLabel>Təsdiq Linki</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" />Nailiyyət Əlavə Et</Button>
                        </form>
                    </Form>
                    <Separator />
                    <div className="space-y-2 mt-4">
                        {achievementsLoading ? <p>Yüklənir...</p> : achievements?.map(a => (
                            <div key={a.id} className="flex justify-between items-center p-2 border rounded-md"><span>{a.name}</span><Button variant="ghost" size="icon" onClick={() => onDeleteItem(a.id, 'achievements', a.name)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><FileText /> Sertifikatlar</CardTitle></CardHeader>
                <CardContent>
                    <Form {...certificateForm}>
                         <form onSubmit={e => { e.preventDefault(); onCertificateAdd(); }} className="space-y-4 mb-6">
                            <FormField name="name" control={certificateForm.control} render={({ field }) => (<FormItem><FormLabel>Sertifikat Adı</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormItem><FormLabel>Sertifikat Faylı və ya Linki</FormLabel><FormControl><Input type="file" ref={certificateFileInputRef} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" /></FormControl><div className="text-center text-sm text-muted-foreground my-2">və ya</div><FormControl><Input type="url" {...certificateForm.register('certificateURL')} placeholder="https://example.com/sertifikat.pdf" /></FormControl><FormMessage /></FormItem>
                            <FormField name="level" control={certificateForm.control} render={({ field }) => (<FormItem><FormLabel>Səviyyə</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{(['Universitet', 'Regional', 'Respublika', 'Beynəlxalq'] as Certificate['level'][]).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                            <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" />Sertifikat Əlavə Et</Button>
                        </form>
                    </Form>
                    <Separator />
                    <div className="space-y-2 mt-4">
                        {certificatesLoading ? <p>Yüklənir...</p> : certificates?.map(c => (
                            <div key={c.id} className="flex justify-between items-center p-2 border rounded-md"><span>{c.name}</span><Button variant="ghost" size="icon" onClick={() => onDeleteItem(c.id, `users/${userIdToFetch}/certificates`, c.name)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}

// Wrapper component to handle Suspense
export default function EditProfilePage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8 text-center">Yüklənir...</div>}>
      <EditProfilePageComponent />
    </Suspense>
  );
}
