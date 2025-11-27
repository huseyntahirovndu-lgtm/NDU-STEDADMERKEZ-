'use server';

import { initializeServerFirebase } from '@/firebase/server-init';
import { collection, getDocs } from 'firebase/firestore';
import { Student, StudentOrganization, Admin, Project, Achievement, Certificate, News, StudentOrgUpdate, FacultyData, CategoryData, AppUser } from '@/types';

function formatDataForFile(data: any): string {
    const jsonString = JSON.stringify(data, (key, value) => {
        if (value && typeof value === 'object' && value.toDate) {
            return value.toDate().toISOString();
        }
        return value;
    }, 2);

    return jsonString;
}


export async function syncDataAction() {
  try {
    const { firestore } = initializeServerFirebase();

    const usersSnap = await getDocs(collection(firestore, 'users'));
    const newsSnap = await getDocs(collection(firestore, 'news'));
    
    const allUsers: AppUser[] = [];
    const allProjects: Project[] = [];
    const allAchievements: Achievement[] = [];
    const allCertificates: Certificate[] = [];
    const allStudentOrgUpdates: StudentOrgUpdate[] = [];

    // Fetch users (students, admins, orgs) and their subcollections
    for (const doc of usersSnap.docs) {
        const user = { id: doc.id, ...doc.data() } as AppUser;
        allUsers.push(user);

        if (user.role === 'student') {
            const projectsSnap = await getDocs(collection(firestore, `users/${user.id}/projects`));
            projectsSnap.forEach(pDoc => allProjects.push({ id: pDoc.id, ...pDoc.data() } as Project));

            const achievementsSnap = await getDocs(collection(firestore, `users/${user.id}/achievements`));
            achievementsSnap.forEach(aDoc => allAchievements.push({ id: aDoc.id, ...aDoc.data() } as Achievement));
            
            const certificatesSnap = await getDocs(collection(firestore, `users/${user.id}/certificates`));
            certificatesSnap.forEach(cDoc => allCertificates.push({ id: cDoc.id, ...cDoc.data() } as Certificate));
        } else if (user.role === 'student-organization') {
            const updatesSnap = await getDocs(collection(firestore, `users/${user.id}/updates`));
            updatesSnap.forEach(uDoc => allStudentOrgUpdates.push({ id: uDoc.id, ...uDoc.data() } as StudentOrgUpdate));
        }
    }
    
    const allNews: News[] = [];
    newsSnap.forEach(doc => allNews.push({ id: doc.id, ...doc.data() } as News));
    
    const students = allUsers.filter(u => u.role === 'student');
    const studentOrgs = allUsers.filter(u => u.role === 'student-organization');
    const adminUsers = allUsers.filter(u => u.role === 'admin');

    
const faculties: FacultyData[] = [
    { id: '1', name: "İqtisadiyyat və idarəetmə fakültəsi" },
    { id: '2', name: "Memarlıq və mühəndislik fakültəsi" },
    { id: '3', name: "Pedaqoji fakültə" },
    { id: '4', name: "Təbiətşünaslıq və kənd təsərrüfatı fakültəsi" },
    { id: '5', name: "Beynəlxalq münasibətlər və hüquq fakültəsi" },
    { id: '6', name: "Tarix-filologiya fakültəsi" },
    { id: '7', name: "Fizika-riyaziyyat fakültəsi" },
    { id: '8', name: "Xarici dillər fakültəsi" },
    { id: '9', name: "Tibb fakültəsi" },
    { id: '10', name: "İncəsənət fakültəsi" }
];

const categories: CategoryData[] = [
    { id: '1', name: 'STEM' },
    { id: '2', name: 'Humanitar' },
    { id: '3', name: 'İncəsənət' },
    { id: '4', name: 'İdman' },
    { id: '5', name: 'Sahibkarlıq' },
    { id: '6', name: 'Texnologiya / IT' },
    { id: '7', name: 'Startap və innovasiya' },
    { id: '8', name: 'Sosial fəaliyyət' },
    { id: '9', name: 'Media və yaradıcılıq' }
];

const adminUser: Admin = {
    id: 'admin_user',
    role: 'admin',
    email: 'huseynimanov@ndu.edu.az',
    firstName: 'Hüseyn',
    lastName: 'Tahirov',
};


    const fileContent = `import { Student, StudentOrganization, Admin, Project, Achievement, Certificate, News, StudentOrgUpdate, FacultyData, CategoryData, AppUser } from '@/types';

export const adminUser: Admin = ${formatDataForFile(adminUser)};

export const faculties: FacultyData[] = ${formatDataForFile(faculties)};

export const categories: CategoryData[] = ${formatDataForFile(categories)};

export const students: Student[] = ${formatDataForFile(students)};

export const studentOrganizations: StudentOrganization[] = ${formatDataForFile(studentOrgs)};

export const projects: Project[] = ${formatDataForFile(allProjects)};

export const achievements: Achievement[] = ${formatDataForFile(allAchievements)};

export const certificates: Certificate[] = ${formatDataForFile(allCertificates)};

export const studentOrgUpdates: StudentOrgUpdate[] = ${formatDataForFile(allStudentOrgUpdates)};

export const news: News[] = ${formatDataForFile(allNews)};

export const allUsers: AppUser[] = [
    adminUser,
    ...students,
    ...studentOrganizations
];
`;

    return { success: true, data: fileContent.trim() };
  } catch (error: any) {
    console.error("Sinxronizasiya xətası:", error);
    return { success: false, error: `Sinxronizasiya zamanı xəta baş verdi: ${error.message}` };
  }
}
