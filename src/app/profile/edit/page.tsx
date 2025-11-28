'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Student, AppUser, Skill, SkillLevel, Project, Achievement, Certificate, AchievementLevel } from '@/types';
import { calculateTalentScore } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { User as UserIcon, Upload, X, Briefcase, Award, FileText, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useMemoFirebase, useDoc, useCollection } from '@/firebase';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { updateDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AvatarEditor from 'react-avatar-editor';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

// ============================================
// SCHEMAS
// ============================================
const studentProfileSchema = z.object({
  firstName: z.string().min(2, 'Ad ən azı 2 hərf olmalıdır.'),
  lastName: z.string().min(2, 'Soyad ən azı 2 hərf olmalıdır.'),
  major: z.string().min(2, 'İxtisas boş ola bilməz.'),
  courseYear: z.coerce.number().min(1).max(6),
  phoneNumber: z.string().min(5, 'Əlaqə nömrəsi daxil edin.'),
  gpa: z.coerce.number().min(0).max(100).optional().nullable(),
  skills: z.array(z.object({
    name: z.string().min(1),
    level: z.enum(['Başlanğıc', 'Orta', 'İrəli']),
  })).optional(),
  successStory: z.string().optional(),
  linkedInURL: z.string().url().or(z.literal('')).optional(),
  githubURL: z.string().url().or(z.literal('')).optional(),
  portfolioURL: z.string().url().or(z.literal('')).optional(),
});

const projectSchema = z.object({
  title: z.string().min(2, 'Layihə adı ən azı 2 hərf olmalıdır.'),
  description: z.string().min(10, 'Təsvir ən azı 10 hərf olmalıdır.'),
  role: z.string().min(2, 'Rol boş ola bilməz.'),
  teamMembersRaw: z.string().optional(),
  link: z.string().url().or(z.literal('')).optional(),
  status: z.enum(['davam edir', 'tamamlanıb']).default('davam edir'),
});

const achievementSchema = z.object({
  name: z.string().min(2, 'Nailiyyət adı boş ola bilməz.'),
  description: z.string().min(10, 'Təsvir ən azı 10 hərf olmalıdır.'),
  position: z.string().min(1, 'Mövqe boş ola bilməz.'),
  level: z.enum(['Universitet', 'Regional', 'Respublika', 'Beynəlxalq']),
  date: z.string().min(1, 'Tarix boş ola bilməz.'),
  link: z.string().url().or(z.literal('')).optional(),
});

const certificateSchema = z.object({
  name: z.string().min(2, 'Sertifikat adı boş ola bilməz.'),
  level: z.enum(['Universitet', 'Regional', 'Respublika', 'Beynəlxalq']),
  certificateURL: z.string().url('Düzgün URL daxil edin.'),
});

type StudentFormData = z.infer<typeof studentProfileSchema>;
type ProjectFormData = z.infer<typeof projectSchema>;
type AchievementFormData = z.infer<typeof achievementSchema>;
type CertificateFormData = z.infer<typeof certificateSchema>;

const SKILL_LEVELS: SkillLevel[] = ['Başlanğıc', 'Orta', 'İrəli'];
const ACHIEVEMENT_LEVELS: AchievementLevel[] = ['Universitet', 'Regional', 'Respublika', 'Beynəlxalq'];

// ============================================
// PROFILE PICTURE UPLOADER WITH EDITOR
// ============================================
function ProfilePictureUploader({ 
  currentUrl, 
  onUploadComplete,
  firstName,
  lastName 
}: { 
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  firstName?: string;
  lastName?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const [editorOpen, setEditorOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.2);
  const [newProfilePicBlob, setNewProfilePicBlob] = useState<Blob | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<AvatarEditor>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setEditorOpen(true);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveCroppedImage = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const croppedUrl = canvas.toDataURL();
      setPreviewUrl(croppedUrl);
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          setNewProfilePicBlob(blob);
          // Upload immediately
          setIsUploading(true);
          const formData = new FormData();
          formData.append('file', blob, 'profile.jpg');

          try {
            const response = await fetch('/api/upload/sekiller', { 
              method: 'POST', 
              body: formData 
            });
            const result = await response.json();
            
            if (result.success) {
              onUploadComplete(result.url);
              toast({ title: 'Şəkil yükləndi' });
            } else {
              throw new Error(result.error || 'Yükləmə uğursuz oldu');
            }
          } catch (error: any) {
            toast({ 
              variant: 'destructive', 
              title: 'Xəta', 
              description: error.message 
            });
          } finally {
            setIsUploading(false);
          }
        }
      }, 'image/jpeg');
      
      setEditorOpen(false);
      setImageSrc(null);
    }
  };

  const getInitials = () => 
    `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;

  return (
    <>
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24 border-2 border-muted">
          <AvatarImage src={previewUrl || undefined} />
          <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Yüklənir...' : 'Şəkli Dəyiş'}
          </Button>
          <Input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>
      </div>

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
                  onValueChange={(v) => setZoom(v[0])}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Ləğv et
            </Button>
            <Button onClick={handleSaveCroppedImage} disabled={isUploading}>
              {isUploading ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ============================================
// PROJECTS MANAGER
// ============================================
function ProjectsManager({ 
  userId,
  firestore,
  onUpdate 
}: { 
  userId: string;
  firestore: any;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const projectsQuery = useMemoFirebase(
    () => firestore 
      ? query(collection(firestore, 'projects'), where('studentId', '==', userId))
      : null,
    [firestore, userId]
  );
  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  const form = useForm<ProjectFormData>({
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

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await addDocumentNonBlocking(collection(firestore, 'projects'), {
        ...data,
        studentId: userId,
      });
      form.reset();
      toast({ title: 'Layihə əlavə edildi' });
      onUpdate();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Xəta',
        description: error.message,
      });
    }
  };

  const handleDelete = async (projectId: string, projectTitle: string) => {
    try {
      const docRef = doc(firestore, 'projects', projectId);
      await deleteDocumentNonBlocking(docRef);
      toast({ title: `"${projectTitle}" silindi` });
      onUpdate();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Xəta',
        description: error.message,
      });
    }
  };

  return (
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Layihə Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Məs: Mobil tətbiq" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Təsvir</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Layihə haqqında..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="role"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rolunuz</FormLabel>
                    <FormControl>
                      <Input placeholder="Məs: Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="link"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Layihə Linki (Könüllü)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" /> Layihə Əlavə Et
            </Button>
          </form>
        </Form>

        <Separator className="my-6" />
        <h4 className="text-md font-medium mb-4">Mövcud Layihələr</h4>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Yüklənir...</p>
          ) : projects && projects.length > 0 ? (
            projects.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-start p-3 border rounded-md"
              >
                <div>
                  <h5 className="font-medium">{p.title}</h5>
                  <p className="text-sm text-muted-foreground">{p.role}</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Silməni təsdiq edirsiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu əməliyyat geri qaytarıla bilməz. "{p.title}" adlı layihə
                        profilinizdən həmişəlik silinəcək.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(p.id, p.title)}
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
            <p className="text-sm text-muted-foreground">Hələ layihə əlavə edilməyib.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// ACHIEVEMENTS MANAGER
// ============================================
function AchievementsManager({ 
  userId,
  firestore,
  onUpdate 
}: { 
  userId: string;
  firestore: any;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const achievementsQuery = useMemoFirebase(
    () => firestore 
      ? query(collection(firestore, 'achievements'), where('studentId', '==', userId))
      : null,
    [firestore, userId]
  );
  const { data: achievements, isLoading } = useCollection<Achievement>(achievementsQuery);

  const form = useForm<AchievementFormData>({
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

  const onSubmit = async (data: AchievementFormData) => {
    try {
      await addDocumentNonBlocking(collection(firestore, 'achievements'), {
        ...data,
        studentId: userId,
      });
      form.reset();
      toast({ title: 'Nailiyyət əlavə edildi' });
      onUpdate();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Xəta',
        description: error.message,
      });
    }
  };

  const handleDelete = async (achievementId: string, achievementName: string) => {
    try {
      const docRef = doc(firestore, 'achievements', achievementId);
      await deleteDocumentNonBlocking(docRef);
      toast({ title: `"${achievementName}" silindi` });
      onUpdate();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Xəta',
        description: error.message,
      });
    }
  };

  return (
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nailiyyət Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Məs: Hackathon birinciliyi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Təsvir</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nailiyyət haqqında..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                name="position"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tutduğunuz Yer</FormLabel>
                    <FormControl>
                      <Input placeholder="Məs: 1-ci yer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="level"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Səviyyə</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACHIEVEMENT_LEVELS.map((l) => (
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
              <FormField
                name="date"
                control={form.control}
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
            </div>
            <FormField
              name="link"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link (Könüllü)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" /> Nailiyyət Əlavə Et
            </Button>
          </form>
        </Form>

        <Separator className="my-6" />
        <h4 className="text-md font-medium mb-4">Mövcud Nailiyyətlər</h4>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Yüklənir...</p>
          ) : achievements && achievements.length > 0 ? (
            achievements.map((a) => (
              <div
                key={a.id}
                className="flex justify-between items-start p-3 border rounded-md"
              >
                <div>
                  <h5 className="font-medium">{a.name}</h5>
                  <p className="text-sm text-muted-foreground">
                    {a.position} • {a.level}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Silməni təsdiq edirsiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu əməliyyat geri qaytarıla bilməz. "{a.name}" adlı nailiyyət
                        profilinizdən həmişəlik silinəcək.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(a.id, a.name)}
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
            <p className="text-sm text-muted-foreground">Hələ nailiyyət əlavə edilməyib.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// CERTIFICATES MANAGER
// ============================================
function CertificatesManager({ 
  userId,
  firestore,
  onUpdate 
}: { 
  userId: string;
  firestore: any;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const certificatesQuery = useMemoFirebase(
    () => firestore 
      ? collection(firestore, `users/${userId}/certificates`)
      : null,
    [firestore, userId]
  );
  const { data: certificates, isLoading } = useCollection<Certificate>(certificatesQuery);

  const form = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      name: '',
      level: 'Universitet',
      certificateURL: '',
    },
  });

  const onSubmit = async (data: CertificateFormData) => {
    try {
      await addDocumentNonBlocking(
        collection(firestore, `users/${userId}/certificates`),
        data
      );
      form.reset();
      toast({ title: 'Sertifikat əlavə edildi' });
      onUpdate();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Xəta',
        description: error.message,
      });
    }
  };

  const handleDelete = async (certificateId: string, certificateName: string) => {
    try {
      const docRef = doc(firestore, `users/${userId}/certificates`, certificateId);
      await deleteDocumentNonBlocking(docRef);
      toast({ title: `"${certificateName}" silindi` });
      onUpdate();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Xəta',
        description: error.message,
      });
    }
  };

  return (
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sertifikatın Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Məs: AWS Certified Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="level"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Səviyyə</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACHIEVEMENT_LEVELS.map((l) => (
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
            <FormField
              name="certificateURL"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sertifikat Linki</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" /> Sertifikat Əlavə Et
            </Button>
          </form>
        </Form>

        <Separator className="my-6" />
        <h4 className="text-md font-medium mb-4">Mövcud Sertifikatlar</h4>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Yüklənir...</p>
          ) : certificates && certificates.length > 0 ? (
            certificates.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center p-3 border rounded-md"
              >
                <a
                  href={c.certificateURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-medium"
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
                      <AlertDialogTitle>Silməni təsdiq edirsiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu əməliyyat geri qaytarılmazdır. "{c.name}" adlı sertifikat
                        profilinizdən həmişəlik silinəcək.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(c.id, c.name)}
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
            <p className="text-sm text-muted-foreground">Hələ sertifikat əlavə edilməyib.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
function SkillManager({ 
  skills, 
  onSkillsChange 
}: { 
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
}) {
  const [skillInput, setSkillInput] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Başlanğıc');
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    const exists = skills.some(s => 
      s.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      toast({ 
        variant: 'destructive', 
        title: 'Bu bacarıq artıq mövcuddur.' 
      });
      return;
    }

    onSkillsChange([...skills, { name: trimmed, level: skillLevel }]);
    setSkillInput('');
    setSkillLevel('Başlanğıc');
    inputRef.current?.focus();
  };

  const handleRemove = (skillName: string) => {
    onSkillsChange(skills.filter(s => s.name !== skillName));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-end gap-2">
        <div className="w-full">
          <FormLabel className="text-xs text-muted-foreground">
            Bacarıq adı
          </FormLabel>
          <Input 
            ref={inputRef}
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Məs: Python, Figma"
          />
        </div>
        <div className="w-full sm:w-auto shrink-0">
          <FormLabel className="text-xs text-muted-foreground">
            Səviyyə
          </FormLabel>
          <Select value={skillLevel} onValueChange={(v) => setSkillLevel(v as SkillLevel)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SKILL_LEVELS.map(l => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" onClick={handleAdd} className="shrink-0">
          Əlavə et
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 pt-2 min-h-[2.5rem]">
        {skills.map((skill) => (
          <Badge 
            key={skill.name} 
            variant="secondary" 
            className="flex items-center gap-2 text-sm"
          >
            {skill.name}
            <span className="text-xs opacity-70">({skill.level})</span>
            <button
              type="button"
              onClick={() => handleRemove(skill.name)}
              className="rounded-full hover:bg-muted-foreground/20 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

// ============================================
// STUDENT PROFILE FORM
// ============================================
function StudentProfileForm({ 
  user, 
  firestore 
}: { 
  user: Student;
  firestore: any;
}) {
  const { toast } = useToast();
  const { updateUser: updateAuthUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedProfilePicUrl, setUploadedProfilePicUrl] = useState<string | null>(null);

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
      portfolioURL: user.portfolioURL || '',
    },
  });

  const triggerTalentScoreUpdate = useCallback(async (userId: string) => {
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
            query(collection(firestore, 'projects'), where('studentId', '==', studentId))
          );
          const achievementsSnap = await getDocs(
            query(collection(firestore, 'achievements'), where('studentId', '==', studentId))
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
        description: `Yeni balınız: ${scoreResult.talentScore}`,
      });
    } catch (error) {
      console.error('Error updating talent score:', error);
    }
  }, [firestore, toast]);

  const onSubmit = async (data: StudentFormData) => {
    setIsSaving(true);
    
    try {
      const finalPayload: Partial<Student> = { ...data };
      
      if (uploadedProfilePicUrl) {
        finalPayload.profilePictureUrl = uploadedProfilePicUrl;
      }

      const userDocRef = doc(firestore, 'users', user.id);
      await updateDocumentNonBlocking(userDocRef, finalPayload);
      updateAuthUser({ ...user, ...finalPayload });

      toast({ title: 'Profil məlumatları yadda saxlanıldı.' });
      triggerTalentScoreUpdate(user.id);
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Xəta baş verdi', 
        description: error.message 
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon /> Şəxsi Məlumatlar
        </CardTitle>
        <CardDescription>
          Əsas profil məlumatlarınızı, bacarıqlarınızı və sosial media hesablarınızı yeniləyin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Profile Picture */}
            <FormItem>
              <FormLabel>Profil Şəkli</FormLabel>
              <ProfilePictureUploader
                currentUrl={user.profilePictureUrl || undefined}
                onUploadComplete={setUploadedProfilePicUrl}
                firstName={user.firstName}
                lastName={user.lastName}
              />
            </FormItem>

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="firstName"
                control={form.control}
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
                control={form.control}
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
              <FormField
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Əlaqə nömrəsi</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="major"
                control={form.control}
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
              <FormField
                name="courseYear"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Təhsil ili</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value, 10))}
                      value={field.value ? String(field.value) : ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map(y => (
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
                control={form.control}
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

            {/* Skills */}
            <Separator />
            <FormField
              name="skills"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">Bacarıqlar</FormLabel>
                  <SkillManager
                    skills={field.value || []}
                    onSkillsChange={field.onChange}
                  />
                </FormItem>
              )}
            />

            {/* Success Story */}
            <Separator />
            <FormField
              control={form.control}
              name="successStory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">
                    Uğur Hekayəsi{' '}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Könüllü)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Platforma sayəsində qazandığınız bir uğuru paylaşın..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Social Links */}
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sosial Linklər</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="linkedInURL"
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Yadda saxlanılır...' : 'Dəyişiklikləri Yadda Saxla'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
function EditProfilePageComponent() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const firestore = useFirestore();

  const userIdFromQuery = searchParams.get('userId');
  const userIdToFetch = 
    currentUser?.role === 'admin' && userIdFromQuery 
      ? userIdFromQuery 
      : currentUser?.id || null;

  const userDocRef = useMemoFirebase(
    () => userIdToFetch && firestore 
      ? doc(firestore, 'users', userIdToFetch) 
      : null,
    [firestore, userIdToFetch]
  );

  const { data: targetUser, isLoading: userLoading } = useDoc<AppUser>(userDocRef);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, authLoading, router]);

  if (authLoading || userLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        Yüklənir...
      </div>
    );
  }

  if (!targetUser || !firestore) {
    return (
      <div className="container mx-auto py-8 text-center">
        İstifadəçi tapılmadı.
      </div>
    );
  }

  const isStudent = targetUser.role === 'student';

  return (
    <div className="container mx-auto max-w-4xl py-8 md:py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Profili Redaktə Et
        </h1>
        <p className="text-muted-foreground">
          Profil məlumatlarınızı, layihə və nailiyyətlərinizi buradan idarə edin.
        </p>
      </div>

      <div className="space-y-8">
        {isStudent && (
          <>
            <StudentProfileForm 
              user={targetUser as Student} 
              firestore={firestore} 
            />
            
            <ProjectsManager
              userId={targetUser.id}
              firestore={firestore}
              onUpdate={() => {
                // Trigger talent score update
                const triggerUpdate = async () => {
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
                          query(collection(firestore, 'projects'), where('studentId', '==', studentId))
                        );
                        const achievementsSnap = await getDocs(
                          query(collection(firestore, 'achievements'), where('studentId', '==', studentId))
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
                      targetStudentId: targetUser.id,
                      allStudents: allStudentsContext as any,
                    });

                    const targetUserDoc = doc(firestore, 'users', targetUser.id);
                    await updateDocumentNonBlocking(targetUserDoc, {
                      talentScore: scoreResult.talentScore,
                    });
                  } catch (error) {
                    console.error('Error updating talent score:', error);
                  }
                };
                triggerUpdate();
              }}
            />

            <AchievementsManager
              userId={targetUser.id}
              firestore={firestore}
              onUpdate={() => {
                // Same talent score update logic
                const triggerUpdate = async () => {
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
                          query(collection(firestore, 'projects'), where('studentId', '==', studentId))
                        );
                        const achievementsSnap = await getDocs(
                          query(collection(firestore, 'achievements'), where('studentId', '==', studentId))
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
                      targetStudentId: targetUser.id,
                      allStudents: allStudentsContext as any,
                    });

                    const targetUserDoc = doc(firestore, 'users', targetUser.id);
                    await updateDocumentNonBlocking(targetUserDoc, {
                      talentScore: scoreResult.talentScore,
                    });
                  } catch (error) {
                    console.error('Error updating talent score:', error);
                  }
                };
                triggerUpdate();
              }}
            />

            <CertificatesManager
              userId={targetUser.id}
              firestore={firestore}
              onUpdate={() => {
                // Same talent score update logic
                const triggerUpdate = async () => {
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
                          query(collection(firestore, 'projects'), where('studentId', '==', studentId))
                        );
                        const achievementsSnap = await getDocs(
                          query(collection(firestore, 'achievements'), where('studentId', '==', studentId))
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
                      targetStudentId: targetUser.id,
                      allStudents: allStudentsContext as any,
                    });

                    const targetUserDoc = doc(firestore, 'users', targetUser.id);
                    await updateDocumentNonBlocking(targetUserDoc, {
                      talentScore: scoreResult.talentScore,
                    });
                  } catch (error) {
                    console.error('Error updating talent score:', error);
                  }
                };
                triggerUpdate();
              }}
            />
          </>
        )}
        
        {!isStudent && (
          <Card>
            <CardHeader>
              <CardTitle>Təşkilat Profili</CardTitle>
              <CardDescription>
                Təşkilat profili redaktəsi tezliklə aktiv olacaq.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}

// ============================================
// EXPORT
// ============================================
export default function EditProfilePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 text-center">
        Yüklənir...
      </div>
    }>
      <EditProfilePageComponent />
    </Suspense>
  );
}