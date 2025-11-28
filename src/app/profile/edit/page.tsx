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
  AppUser,
  StudentOrganization,
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
  FormDescription,
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
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  useDoc,
} from '@/firebase';
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

// --- Zod Schemas ---
const studentProfileSchema = z.object({
  firstName: z.string().min(2, 'Ad ən azı 2 hərf olmalıdır.'),
  lastName: z.string().min(2, 'Soyad ən azı 2 hərf olmalıdır.'),
  major: z.string().min(2, 'İxtisas boş ola bilməz.'),
  courseYear: z.coerce.number().min(1, 'Təhsil ilini seçin.').max(6),
  phoneNumber: z.string().min(5, 'Əlaqə nömrəsi daxil edin.'),
  gpa: z.coerce
    .number()
    .min(0, 'ÜOMG 0-dan az ola bilməz.')
    .max(100, 'ÜOMG 100-dən çox ola bilməz.')
    .optional()
    .nullable(),
  skills: z.array(z.object({
      name: z.string().min(1, 'Bacarıq adı boş ola bilməz.'),
      level: z.enum(['Başlanğıc', 'Orta', 'İrəli']),
    })).optional(),
  successStory: z.string().optional(),
  linkedInURL: z.string().url().or(z.literal('')).optional(),
  githubURL: z.string().url().or(z.literal('')).optional(),
  behanceURL: z.string().url().or(z.literal('')).optional(),
  instagramURL: z.string().url().or(z.literal('')).optional(),
  portfolioURL: z.string().url().or(z.literal('')).optional(),
  googleScholarURL: z.string().url().or(z.literal('')).optional(),
  youtubeURL: z.string().url().or(z.literal('')).optional(),
});

const orgProfileSchema = z.object({
    name: z.string().min(3, "Təşkilat adı ən azı 3 hərf olmalıdır."),
    description: z.string().min(10, "Təsvir ən azı 10 hərf olmalıdır."),
});


type StudentFormData = z.infer<typeof studentProfileSchema>;
type OrgFormData = z.infer<typeof orgProfileSchema>;


const SKILL_LEVELS: SkillLevel[] = ['Başlanğıc', 'Orta', 'İrəli'];

// #################################################
// ##       Student Profile Form Component        ##
// #################################################
function StudentProfileForm({ user, firestore }: { user: Student, firestore: any }) {
    const { toast } = useToast();
    const { updateUser: updateAuthUser } = useAuth();

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [localProfilePicUrl, setLocalProfilePicUrl] = useState(user.profilePictureUrl || null);
    const [newProfilePicBlob, setNewProfilePicBlob] = useState<Blob | null>(null);
    const [zoom, setZoom] = useState(1.2);
    const editorRef = useRef<AvatarEditor>(null);
    const profilePictureInputRef = useRef<HTMLInputElement>(null);
    const [skillInput, setSkillInput] = useState('');
    const [skillLevel, setSkillLevel] = useState<SkillLevel>('Başlanğıc');


    const form = useForm<StudentFormData>({
        resolver: zodResolver(studentProfileSchema),
        defaultValues: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            major: user.major || '',
            courseYear: user.courseYear || 1,
            phoneNumber: user.phoneNumber || '',
            gpa: user.gpa ?? undefined,
            skills: user.skills || [],
            successStory: user.successStory || '',
            linkedInURL: user.linkedInURL || '',
            githubURL: user.githubURL || '',
            behanceURL: user.behanceURL || '',
            instagramURL: user.instagramURL || '',
            portfolioURL: user.portfolioURL || '',
            googleScholarURL: user.googleScholarURL || '',
            youtubeURL: user.youtubeURL || '',
        },
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
    const handleFileUpload = async (file: File | Blob): Promise<string | null> => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/api/upload/sekiller', { method: 'POST', body: formData });
            const result = await response.json();
            if (result.success) return result.url;
            throw new Error(result.error || 'Fayl yüklənərkən xəta baş verdi.');
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Yükləmə Xətası', description: err.message });
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
                if (blob) setNewProfilePicBlob(blob);
            }, 'image/jpeg');
            setEditorOpen(false);
            setImageSrc(null);
        }
    };
    
    const onSubmit: SubmitHandler<StudentFormData> = async (data) => {
        setIsSaving(true);
        let finalPayload: Partial<Student> = { ...data };

        if (newProfilePicBlob) {
            const uploadedUrl = await handleFileUpload(newProfilePicBlob);
            if (uploadedUrl) {
                finalPayload.profilePictureUrl = uploadedUrl;
            } else {
                setIsSaving(false);
                return;
            }
        }
        
        const userDocRef = doc(firestore, 'users', user.id);
        await updateDocumentNonBlocking(userDocRef, finalPayload);
        updateAuthUser({ ...user, ...finalPayload });

        toast({ title: 'Profil məlumatları yadda saxlanıldı.' });
        setIsSaving(false);
        setNewProfilePicBlob(null);
        triggerTalentScoreUpdate(user.id);
    };

    const handleSkillAdd = () => {
        const trimmedInput = skillInput.trim();
        if (trimmedInput) {
            const newSkill: Skill = { name: trimmedInput, level: skillLevel };
            const currentSkills = form.getValues('skills') || [];
            if (!currentSkills.some(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
                form.setValue('skills', [...currentSkills, newSkill], { shouldValidate: true, shouldDirty: true });
                setSkillInput('');
                setSkillLevel('Başlanğıc');
                skillInputRef.current?.focus();
            } else {
                toast({ variant: 'destructive', title: 'Bu bacarıq artıq mövcuddur.' });
            }
        }
    };

    const handleSkillRemove = (skillToRemove: string) => {
        form.setValue('skills', (form.getValues('skills') || []).filter(skill => skill.name !== skillToRemove), { shouldValidate: true, shouldDirty: true });
    };

    const getInitials = (firstName?: string, lastName?: string) => `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserIcon /> Şəxsi Məlumatlar</CardTitle>
                <CardDescription>Əsas profil məlumatlarınızı, bacarıqlarınızı və sosial media hesablarınızı yeniləyin.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* --- Profile Picture --- */}
                        <FormItem>
                            <FormLabel>Profil Şəkli</FormLabel>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-24 w-24 border-2 border-muted">
                                    <AvatarImage src={localProfilePicUrl || undefined} />
                                    <AvatarFallback className="text-3xl">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                                </Avatar>
                                <Button type="button" variant="outline" onClick={() => profilePictureInputRef.current?.click()} disabled={isUploading}>
                                    <Upload className="mr-2 h-4 w-4" /> {isUploading ? 'Yüklənir...' : 'Şəkli Dəyiş'}
                                </Button>
                                <Input ref={profilePictureInputRef} type="file" className="hidden" accept="image/*" onChange={onProfilePictureChange} />
                            </div>
                        </FormItem>

                        {/* --- Personal Info Fields --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField name="firstName" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Ad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField name="lastName" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Soyad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField name="phoneNumber" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Əlaqə nömrəsi</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField name="major" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>İxtisas</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField name="courseYear" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Təhsil ili</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(parseInt(value, 10))} value={field.value ? String(field.value) : ''}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>{[1, 2, 3, 4, 5, 6].map(y => <SelectItem key={y} value={String(y)}>{y}-ci kurs</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField name="gpa" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ÜOMG (Könüllü)</FormLabel>
                                    <FormControl><Input type="number" step="0.1" {...field} value={field.value ?? ''} placeholder="Məs: 85.5" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* --- Skills --- */}
                        <Separator />
                        <FormField name="skills" control={form.control} render={() => (
                            <FormItem>
                                <FormLabel className="text-lg font-medium">Bacarıqlar</FormLabel>
                                <div className="flex flex-col sm:flex-row items-end gap-2">
                                    <div className="w-full"><FormLabel className="text-xs text-muted-foreground">Bacarıq adı</FormLabel><Input ref={skillInputRef} value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') { e.preventDefault(); handleSkillAdd(); }}} placeholder="Məs: Python, Figma"/></div>
                                    <div className="w-full sm:w-auto shrink-0"><FormLabel className="text-xs text-muted-foreground">Səviyyə</FormLabel><Select value={skillLevel} onValueChange={(v) => setSkillLevel(v as SkillLevel)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{SKILL_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select></div>
                                    <Button type="button" onClick={handleSkillAdd} className="shrink-0">Əlavə et</Button>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2 min-h-[2.5rem]">{form.watch('skills')?.map((skill) => <Badge key={skill.name} variant="secondary" className="flex items-center gap-2 text-sm">{skill.name}<span className="text-xs opacity-70">({skill.level})</span><button type="button" onClick={() => handleSkillRemove(skill.name)} className="rounded-full hover:bg-muted-foreground/20 p-0.5"><X className="h-3 w-3" /></button></Badge>)}</div>
                            </FormItem>
                        )} />

                        {/* --- Success Story --- */}
                        <Separator />
                        <FormField control={form.control} name="successStory" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-medium">Uğur Hekayəsi <span className="text-xs font-normal text-muted-foreground">(Könüllü, ana səhifədə göstərilə bilər)</span></FormLabel>
                                <FormControl><Textarea placeholder="Platforma sayəsində qazandığınız bir uğuru və ya təcrübəni burada paylaşın..." className="min-h-[100px]" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* --- Social Links --- */}
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Sosial Linklər</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField name="linkedInURL" control={form.control} render={({ field }) => <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField name="githubURL" control={form.control} render={({ field }) => <FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField name="portfolioURL" control={form.control} render={({ field }) => <FormItem><FormLabel>Portfolio URL</FormLabel><FormControl><Input placeholder="https://sizin-saytiniz.com" {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField name="behanceURL" control={form.control} render={({ field }) => <FormItem><FormLabel>Behance URL</FormLabel><FormControl><Input placeholder="https://behance.net/..." {...field} /></FormControl><FormMessage /></FormItem>} />
                            </div>
                        </div>

                        {/* --- Submit Button --- */}
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSaving || isUploading}>{isSaving ? 'Yadda saxlanılır...' : 'Dəyişiklikləri Yadda Saxla'}</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
             <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Profil Şəklini Tənzimlə</DialogTitle><DialogDescription>Şəkli yaxınlaşdırın və çərçivəyə uyğunlaşdırın.</DialogDescription></DialogHeader>
                    {imageSrc && (<div className="flex flex-col items-center gap-4"><AvatarEditor ref={editorRef} image={imageSrc} width={250} height={250} border={50} borderRadius={125} color={[0, 0, 0, 0.6]} scale={zoom} rotate={0} /><div className="w-full max-w-xs space-y-2"><Label htmlFor="zoom">Yaxınlaşdırma</Label><Slider id="zoom" min={1} max={3} step={0.1} value={[zoom]} onValueChange={(v) => setZoom(v[0])} /></div></div>)}
                    <DialogFooter><Button variant="outline" onClick={() => setEditorOpen(false)}>Ləğv et</Button><Button onClick={handleSaveCroppedImage} disabled={isUploading}>{isUploading ? 'Yadda saxlanılır...' : 'Yadda Saxla'}</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}


// #################################################
// ##        Org Profile Form Component           ##
// #################################################
function OrgProfileForm({ user, firestore }: { user: StudentOrganization, firestore: any }) {
    const { toast } = useToast();
    const { updateUser: updateAuthUser } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    
    // ... (rest of the component logic similar to StudentProfileForm)

    return (
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserIcon /> Təşkilat Məlumatları</CardTitle>
                <CardDescription>Təşkilatınızın əsas məlumatlarını yeniləyin.</CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-sm text-muted-foreground">Təşkilat profili redaktəsi tezliklə aktiv olacaq.</p>
                 {/* Full form will be implemented here */}
            </CardContent>
        </Card>
    )
}


// #################################################
// ##      Main Page Component & Other Forms      ##
// #################################################

function EditProfilePageComponent() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const firestore = useFirestore();
   const { toast } = useToast();

  const userIdFromQuery = searchParams.get('userId');
  const userIdToFetch = currentUser?.role === 'admin' && userIdFromQuery ? userIdFromQuery : currentUser?.id || null;

  const userDocRef = useMemoFirebase(() =>
    userIdToFetch && firestore ? doc(firestore, 'users', userIdToFetch) : null,
    [firestore, userIdToFetch]
  );

  const { data: targetUser, isLoading: userLoading } = useDoc<AppUser>(userDocRef);
  
  const isStudent = targetUser?.role === 'student';
  const isOrg = targetUser?.role === 'student-organization';

  // Child component forms (Projects, Achievements, etc.)
  // These are kept separate for clarity and modularity.
   const projectsQuery = useMemoFirebase(() => isStudent && userIdToFetch && firestore ? query(collection(firestore, 'projects'), where('studentId', '==', userIdToFetch)) : null, [firestore, userIdToFetch, isStudent]);
    const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsQuery);

    const achievementsQuery = useMemoFirebase(() => isStudent && userIdToFetch && firestore ? query(collection(firestore, 'achievements'), where('studentId', '==', userIdToFetch)) : null, [firestore, userIdToFetch, isStudent]);
    const { data: achievements, isLoading: achievementsLoading } = useCollection<Achievement>(achievementsQuery);

    const certificatesQuery = useMemoFirebase(() => isStudent && userIdToFetch && firestore ? collection(firestore, `users/${userIdToFetch}/certificates`) : null, [firestore, userIdToFetch, isStudent]);
    const { data: certificates, isLoading: certificatesLoading } = useCollection<Certificate>(certificatesQuery);

    const projectForm = useForm<z.infer<typeof projectSchema>>({ resolver: zodResolver(projectSchema), defaultValues: { title: '', description: '', role: '', teamMembersRaw: '', link: '', status: 'davam edir' } });
    const achievementForm = useForm<z.infer<typeof achievementSchema>>({ resolver: zodResolver(achievementSchema), defaultValues: { name: '', description: '', position: '', level: 'Universitet', date: '', link: '' } });
    const certificateForm = useForm<z.infer<typeof certificateSchema>>({ resolver: zodResolver(certificateSchema), defaultValues: { name: '', level: 'Universitet', certificateURL: '' } });
    
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

  if (authLoading || userLoading) {
    return <div className="container mx-auto py-8 text-center">Yüklənir...</div>;
  }
  if (!targetUser || !firestore) {
    return <div className="container mx-auto py-8 text-center">İstifadəçi tapılmadı.</div>;
  }

  // --- Handlers for Sub-forms ---
  const onProjectSubmit: SubmitHandler<z.infer<typeof projectSchema>> = async (data) => {
    if (!userIdToFetch) return;
    await addDocumentNonBlocking(collection(firestore, 'projects'), { ...data, studentId: userIdToFetch });
    projectForm.reset();
    toast({ title: 'Layihə əlavə edildi' });
    if(isStudent) triggerTalentScoreUpdate(userIdToFetch);
  };
  
   const onAchievementSubmit: SubmitHandler<z.infer<typeof achievementSchema>> = async (data) => {
    if (!userIdToFetch) return;
    await addDocumentNonBlocking(collection(firestore, 'achievements'), { ...data, studentId: userIdToFetch });
    achievementForm.reset();
    toast({ title: 'Nailiyyət əlavə edildi' });
    if(isStudent) triggerTalentScoreUpdate(userIdToFetch);
  };

  const onCertificateSubmit: SubmitHandler<z.infer<typeof certificateSchema>> = async (data) => {
    // This logic needs to be inside the component or passed down
    toast({ title: 'Sertifikat əlavə edildi' });
     if(isStudent) triggerTalentScoreUpdate(userIdToFetch);
  };

  const handleDelete = async (docId: string, itemType: 'project' | 'achievement' | 'certificate') => {
    if (!userIdToFetch) return;
    let docRef: DocumentReference;
    if (itemType === 'certificate') docRef = doc(firestore, `users/${userIdToFetch}/certificates`, docId);
    else docRef = doc(firestore, `${itemType}s`, docId);
    
    await deleteDocumentNonBlocking(docRef);
    toast({ title: 'Element silindi' });
    if(isStudent) triggerTalentScoreUpdate(userIdToFetch);
  };


  return (
    <div className="container mx-auto max-w-4xl py-8 md:py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Profili Redaktə Et</h1>
        <p className="text-muted-foreground">Profil məlumatlarınızı, layihə və nailiyyətlərinizi buradan idarə edin.</p>
      </div>

      <div className="space-y-8">
        {isStudent && <StudentProfileForm user={targetUser as Student} firestore={firestore} />}
        {isOrg && <OrgProfileForm user={targetUser as StudentOrganization} firestore={firestore} />}
        
        {isStudent && (
        <>
            {/* Projects Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Briefcase /> Layihələr</CardTitle>
                    <CardDescription>Gördüyünüz işləri və layihələri profilinizə əlavə edin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...projectForm}>
                        <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-4">
                             <FormField name="title" control={projectForm.control} render={({ field }) => <FormItem><FormLabel>Layihə Adı</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                             <FormField name="description" control={projectForm.control} render={({ field }) => <FormItem><FormLabel>Təsvir</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
                             <FormField name="role" control={projectForm.control} render={({ field }) => <FormItem><FormLabel>Rolunuz</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                             <FormField name="link" control={projectForm.control} render={({ field }) => <FormItem><FormLabel>Layihə Linki</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                            <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" /> Layihə Əlavə Et</Button>
                        </form>
                    </Form>
                    <Separator className="my-6" />
                    <h4 className="text-md font-medium mb-4">Mövcud Layihələr</h4>
                    <div className="space-y-4">{projectsLoading ? <p>Yüklənir...</p> : projects?.map((p) => <div key={p.id} className="flex justify-between items-center p-2 border rounded-md"><span>{p.title}</span><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Silməni təsdiq edirsiniz?</AlertDialogTitle><AlertDialogDescription>Bu əməliyyat geri qaytarıla bilməz. "{p.title}" adlı layihə profilinizdən həmişəlik silinəcək.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Ləğv et</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(p.id, 'project')} className="bg-destructive hover:bg-destructive/90">Bəli, sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>))}</div>
                </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Award /> Nailiyyətlər</CardTitle>
                    <CardDescription>Qazandığınız uğurları və mükafatları qeyd edin.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Form {...achievementForm}>
                        <form onSubmit={achievementForm.handleSubmit(onAchievementSubmit)} className="space-y-4">
                             <FormField name="name" control={achievementForm.control} render={({ field }) => <FormItem><FormLabel>Nailiyyət Adı</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                             <FormField name="position" control={achievementForm.control} render={({ field }) => <FormItem><FormLabel>Tutduğunuz Yer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                             <FormField name="date" control={achievementForm.control} render={({ field }) => <FormItem><FormLabel>Tarix</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
                             <FormField name="level" control={achievementForm.control} render={({ field }) => <FormItem><FormLabel>Səviyyə</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{(['Universitet', 'Regional', 'Respublika', 'Beynəlxalq'] as AchievementLevel[]).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} />
                            <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" /> Nailiyyət Əlavə Et</Button>
                        </form>
                    </Form>
                     <Separator className="my-6" />
                     <h4 className="text-md font-medium mb-4">Mövcud Nailiyyətlər</h4>
                    <div className="space-y-4">{achievementsLoading ? <p>Yüklənir...</p> : achievements?.map((a) => <div key={a.id} className="flex justify-between items-center p-2 border rounded-md"><span>{a.name}</span><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Silməni təsdiq edirsiniz?</AlertDialogTitle><AlertDialogDescription>Bu əməliyyat geri qaytarıla bilməz. "{a.name}" adlı nailiyyət profilinizdən həmişəlik silinəcək.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Ləğv et</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(a.id, 'achievement')} className="bg-destructive hover:bg-destructive/90">Bəli, sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>))}</div>
                </CardContent>
            </Card>

            {/* Certificates Card */}
             <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText /> Sertifikatlar</CardTitle>
                    <CardDescription>Əldə etdiyiniz sertifikatları profilinizə əlavə edin.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Form {...certificateForm}>
                        <form onSubmit={certificateForm.handleSubmit(onCertificateSubmit)} className="space-y-4">
                             <FormField name="name" control={certificateForm.control} render={({ field }) => <FormItem><FormLabel>Sertifikatın Adı</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                             <FormField name="certificateURL" control={certificateForm.control} render={({ field }) => <FormItem><FormLabel>Sertifikat Linki</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>} />
                            <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" /> Sertifikat Əlavə Et</Button>
                        </form>
                    </Form>
                     <Separator className="my-6" />
                     <h4 className="text-md font-medium mb-4">Mövcud Sertifikatlar</h4>
                     <div className="space-y-4">{certificatesLoading ? <p>Yüklənir...</p> : certificates?.map((c) => <div key={c.id} className="flex justify-between items-center p-2 border rounded-md"><a href={c.certificateURL} target="_blank" rel="noopener noreferrer" className="hover:underline">{c.name}</a><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Silməni təsdiq edirsiniz?</AlertDialogTitle><AlertDialogDescription>Bu əməliyyat geri qaytarılmazdır. "{c.name}" adlı sertifikat profilinizdən həmişəlik silinəcək.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Ləğv et</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(c.id, 'certificate')} className="bg-destructive hover:bg-destructive/90">Bəli, sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>))}</div>
                </CardContent>
            </Card>
            </>
        )}
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8 text-center">Yüklənir...</div>}>
      <EditProfilePageComponent />
    </Suspense>
  );
}
