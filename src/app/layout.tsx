'use client';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { SessionProvider, useAuth } from '@/hooks/use-auth';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Student } from '@/types';
import { updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

const siteConfig = {
  name: "İstedad Mərkəzi - Naxçıvan Dövlət Universiteti",
  url: "https://istedadmerkezi.net",
  ogImage: "https://i.ibb.co/cXv2KzRR/q2.jpg",
  description: "Naxçıvan Dövlət Universitetinin istedadlı tələbələrini kəşf edin. Potensialı reallığa çevirən platforma.",
  keywords: ["Naxçıvan Dövlət Universiteti", "İstedad Mərkəzi", "tələbə", "karyera", "istedad", "layihə", "NDU"],
};

function PhoneNumberModal() {
  const { user, updateUser } = useAuth();
  const firestore = useFirestore();
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && user.role === 'student' && !user.phoneNumber) {
      setIsOpen(true);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user || !firestore) return;
    if (phoneNumber.trim().length < 5) {
      toast({
        variant: 'destructive',
        title: 'Xəta',
        description: 'Zəhmət olmasa, etibarlı bir əlaqə nömrəsi daxil edin.',
      });
      return;
    }

    setIsSaving(true);
    const userDocRef = doc(firestore, 'users', user.id);
    const updatedData = { phoneNumber };
    
    await updateDocumentNonBlocking(userDocRef, updatedData);
    updateUser(updatedData); // Update local auth context
    
    toast({
      title: 'Uğurlu',
      description: 'Əlaqə nömrəniz yadda saxlanıldı.',
    });
    
    setIsSaving(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Əlaqə Nömrəsi</DialogTitle>
          <DialogDescription>
            Platformadan tam istifadə etmək üçün zəhmət olmasa, əlaqə nömrənizi daxil edin. Bu məlumat məxfi saxlanılacaq.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone-number" className="text-right">
              Nömrə
            </Label>
            <Input
              id="phone-number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="col-span-3"
              placeholder="+994..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register-student') || pathname.startsWith('/register-organization');
  
  const isAdminRoute = pathname.startsWith('/admin');
  const isOrgPanelRoute = pathname.startsWith('/telebe-teskilati-paneli');

  const showHeaderFooter = !isAuthPage && !isAdminRoute && !isOrgPanelRoute;

  return (
    <html lang="az">
      <head>
        <title>{siteConfig.name}</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="keywords" content={siteConfig.keywords.join(", ")} />
        <meta property="og:title" content={siteConfig.name} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteConfig.url} />
        <meta property="og:image" content={siteConfig.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteConfig.name} />
        <meta name="twitter:description" content={siteConfig.description} />
        <meta name="twitter:image" content={siteConfig.ogImage} />
        <link rel="canonical" href={`${siteConfig.url}${pathname}`} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-body bg-background antialiased">
        <FirebaseClientProvider>
          <SessionProvider>
            <PhoneNumberModal />
            {isAuthPage ? (
              <main className="flex min-h-screen items-center justify-center bg-background p-4">
                {children}
              </main>
            ) : (
              <div className="flex flex-col min-h-screen">
                {showHeaderFooter && <Header />}
                <main className="flex-1">{children}</main>
                {showHeaderFooter && <Footer />}
              </div>
            )}
            <Toaster />
          </SessionProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
