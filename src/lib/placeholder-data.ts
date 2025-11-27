import { Student, StudentOrganization, Admin, Project, Achievement, Certificate, News, StudentOrgUpdate, FacultyData, CategoryData, AppUser } from '@/types';

export const adminUser: Admin = {
    id: 'admin_user',
    role: 'admin',
    email: 'huseynimanov@ndu.edu.az',
    firstName: 'Hüseyn',
    lastName: 'Tahirov',
};

export const faculties: FacultyData[] = [
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

export const categories: CategoryData[] = [
    { id: '1', name: 'STEM' },
    { id: '2', name: 'Humanitar' },
    { id: '3', name: 'İncəsənət' },
    { id: '4İdman', name: 'İdman' },
    { id: '5', name: 'Sahibkarlıq' },
    { id: '6', name: 'Texnologiya / IT' },
    { id: '7', name: 'Startap və innovasiya' },
    { id: '8', name: 'Sosial fəaliyyət' },
    { id: '9', name: 'Media və yaradıcılıq' }
];

export const students: Student[] = [
  {
    id: 'student-1',
    role: 'student',
    firstName: 'Ayan',
    lastName: 'Məmmədova',
    email: 'ayan.m@istedad.ndu',
    faculty: 'Memarlıq və mühəndislik fakültəsi',
    major: 'Kompüter Mühəndisliyi',
    courseYear: 3,
    gpa: 92.5,
    skills: [{ name: 'Python', level: 'İrəli' }, { name: 'React', level: 'Orta' }, { name: 'UX/UI Design', level: 'Başlanğıc' }],
    category: 'Texnologiya / IT, STEM',
    talentScore: 95,
    status: 'təsdiqlənmiş',
    createdAt: '2023-10-26T10:00:00Z',
    successStory: 'İstedad Mərkəzi platforması vasitəsilə "TechCorp" şirkətində yay təcrübəsi qazandım və real layihələr üzərində işləyərək təcrübəmi artırdım.',
    projectIds: ['project-1-1'],
    achievementIds: ['ach-1-1'],
    certificateIds: ['cert-1-1'],
    profilePictureUrl: ''
  },
  {
    id: 'student-2',
    role: 'student',
    firstName: 'Tural',
    lastName: 'Əliyev',
    email: 'tural.a@istedad.ndu',
    faculty: 'İqtisadiyyat və idarəetmə fakültəsi',
    major: 'Biznesin idarə edilməsi',
    courseYear: 4,
    gpa: 88.0,
    skills: [{ name: 'Marketinq', level: 'İrəli' }, { name: 'Layihə İdarəçiliyi', level: 'Orta' }, { name: 'Data Analizi', level: 'Orta' }],
    category: 'Sahibkarlıq, Sosial fəaliyyət',
    talentScore: 91,
    status: 'təsdiqlənmiş',
    createdAt: '2023-11-15T14:30:00Z',
    successStory: '"Startap Həftəsi" tədbirində öz biznes ideyamı təqdim etdim və investorlardan ilkin maliyyə dəstəyi aldım. Bu platforma mənə özümə inamı qaytardı.',
    profilePictureUrl: ''
  }
];

export const studentOrganizations: StudentOrganization[] = [
    {
        id: 'org-1',
        role: 'student-organization',
        name: 'NDU Debat Klubu',
        description: 'Məntiqi və analitik düşüncəni inkişaf etdirən, natiqlik bacarıqlarını təkmilləşdirən tələbə klubu.',
        email: 'debat@istedad.ndu',
        logoUrl: '',
        memberIds: ['student-1', 'student-2'],
        status: 'təsdiqlənmiş',
        createdAt: '2023-09-01T09:00:00Z'
    },
    {
        id: 'org-2',
        role: 'student-organization',
        name: 'Robotexnika Klubu',
        description: 'Robot texnologiyaları, proqramlaşdırma və mühəndislik sahəsində tələbələri bir araya gətirir.',
        email: 'robotex@istedad.ndu',
        logoUrl: '',
        memberIds: ['student-1'],
        status: 'təsdiqlənmiş',
        createdAt: '2023-09-10T11:00:00Z'
    }
];

export const projects: Project[] = [
    { id: 'project-1-1', ownerId: 'student-1', ownerType: 'student', title: 'Mobil Tətbiq Prototipi', description: 'Tələbələr üçün sosial şəbəkə tətbiqinin prototipinin hazırlanması.', role: 'Developer', status: 'tamamlanıb' },
];
export const achievements: Achievement[] = [
    { id: 'ach-1-1', studentId: 'student-1', name: 'Respublika İnformatika Olimpiadası', position: '1-ci yer', date: '2023-05-15', level: 'Respublika' }
];
export const certificates: Certificate[] = [
    { id: 'cert-1-1', studentId: 'student-1', name: 'Advanced Python Course', certificateURL: '', level: 'Beynəlxalq' }
];

export const studentOrgUpdates: StudentOrgUpdate[] = [
    {
        id: 'update-1',
        organizationId: 'org-1',
        title: 'Yeni Mövsümə Qeydiyyat Başladı!',
        content: '<p>NDU Debat Klubu 2024-2025-ci il mövsümü üçün yeni üzvlərin qəbuluna start verir! Siz də komandamıza qoşulun.</p>',
        createdAt: '2024-09-05T12:00:00Z'
    }
];

export const news: News[] = [
    {
        id: 'news-1',
        slug: 'istedad-merkezi-acildi',
        title: 'Naxçıvan Dövlət Universitetində İstedad Mərkəzi fəaliyyətə başladı',
        content: '<h1>Əsas Başlıq</h1><p>Naxçıvan Dövlət Universitetində tələbələrin potensialını üzə çıxarmaq məqsədilə yaradılan İstedad Mərkəzinin rəsmi açılışı baş tutdu.</p>',
        authorId: 'admin_user',
        authorName: 'Hüseyn Tahirov',
        createdAt: '2024-09-01T10:00:00Z',
        coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
];

export const allUsers: AppUser[] = [
    adminUser,
    ...students,
    ...studentOrganizations
];
