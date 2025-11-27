import { Student, StudentOrganization, Admin, Project, Achievement, Certificate, News, StudentOrgUpdate, FacultyData, CategoryData, AppUser } from '@/types';

// Bu fayl artıq yalnız dəyişməyən, statik məlumatları saxlayır.
// Bütün dinamik məlumatlar (tələbələr, layihələr və s.) birbaşa Firestore-dan "canlı" olaraq çəkilir.

export const adminUser: Admin = {
  id: "admin_user",
  role: "admin",
  email: "huseynimanov@ndu.edu.az",
  firstName: "Hüseyn",
  lastName: "Tahirov"
};

export const faculties: FacultyData[] = [
  { id: "1", name: "İqtisadiyyat və idarəetmə fakültəsi" },
  { id: "2", name: "Memarlıq və mühəndislik fakültəsi" },
  { id: "3", name: "Pedaqoji fakültə" },
  { id: "4", name: "Təbiətşünaslıq və kənd təsərrüfatı fakültəsi" },
  { id: "5", name: "Beynəlxalq münasibətlər və hüquq fakültəsi" },
  { id: "6", name: "Tarix-filologiya fakültəsi" },
  { id: "7", name: "Fizika-riyaziyyat fakültəsi" },
  { id: "8", name: "Xarici dillər fakültəsi" },
  { id: "9", name: "Tibb fakültəsi" },
  { id: "10", name: "İncəsənət fakültəsi" }
];

export const categories: CategoryData[] = [
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

// Bu massivlər artıq boşdur, çünki məlumatlar birbaşa Firestore-dan gəlir.
export const students: Student[] = [];
export const studentOrganizations: StudentOrganization[] = [];
export const projects: Project[] = [];
export const achievements: Achievement[] = [];
export const certificates: Certificate[] = [];
export const studentOrgUpdates: StudentOrgUpdate[] = [];
export const news: News[] = [];

// Bu massiv də artıq istifadə edilmir.
export const allUsers: AppUser[] = [
    adminUser,
    ...students,
    ...studentOrganizations
];
