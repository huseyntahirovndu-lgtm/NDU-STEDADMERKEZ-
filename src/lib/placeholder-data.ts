import { Student, StudentOrganization, Admin, Project, Achievement, Certificate, News, StudentOrgUpdate, FacultyData, CategoryData, AppUser } from '@/types';

export const adminUser: Admin = {
  id: "admin_user",
  role: "admin",
  email: "huseynimanov@ndu.edu.az",
  firstName: "Hüseyn",
  lastName: "Tahirov"
};

export const faculties: FacultyData[] = [
  {
    id: "1",
    name: "İqtisadiyyat və idarəetmə fakültəsi"
  },
  {
    id: "2",
    name: "Memarlıq və mühəndislik fakültəsi"
  },
  {
    id: "3",
    name: "Pedaqoji fakültə"
  },
  {
    id: "4",
    name: "Təbiətşünaslıq və kənd təsərrüfatı fakültəsi"
  },
  {
    id: "5",
    name: "Beynəlxalq münasibətlər və hüquq fakültəsi"
  },
  {
    id: "6",
    name: "Tarix-filologiya fakültəsi"
  },
  {
    id: "7",
    name: "Fizika-riyaziyyat fakültəsi"
  },
  {
    id: "8",
    name: "Xarici dillər fakültəsi"
  },
  {
    id: "9",
    name: "Tibb fakültəsi"
  },
  {
    id: "10",
    name: "İncəsənət fakültəsi"
  }
];

export const categories: CategoryData[] = [
  {
    id: "1",
    name: "STEM"
  },
  {
    id: "2",
    name: "Humanitar"
  },
  {
    id: "3",
    name: "İncəsənət"
  },
  {
    id: "4",
    name: "İdman"
  },
  {
    id: "5",
    name: "Sahibkarlıq"
  },
  {
    id: "6",
    name: "Texnologiya / IT"
  },
  {
    id: "7",
    name: "Startap və innovasiya"
  },
  {
    id: "8",
    name: "Sosial fəaliyyət"
  },
  {
    id: "9",
    name: "Media və yaradıcılıq"
  }
];

export const students: Student[] = [
  {
    courseYear: 2,
    talentScore: 10,
    successStory: "Respublika üzrə 1 ci və 2 ci yer tutmuşam Bədii qiraət üzrə\nValeybol yarışında qızlar arası 3 yer ",
    faculty: "İncəsənət fakültəsi",
    profilePictureUrl: "https://istedadmerkezi.net/api/sekiller/profile_1763974215310.jpg",
    email: "gulayagazade1311@gmail.com",
    id: "04209f24-63e2-44d5-ba75-9ff3aaf0e594",
    skills: [
      {
        name: "Bədii-qiraət, Teatr, valeybol",
        level: "İrəli"
      }
    ],
    instagramURL: "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=z6999ue",
    behanceURL: "",
    lastName: "Ağazadə",
    createdAt: "2025-11-24T08:47:13.385Z",
    gpa: 84.5,
    educationForm: "Əyani ",
    youtubeURL: "https://www.youtube.com/@gulayagazad7879",
    projectIds: [],
    certificateIds: [],
    category: "Teatr, səhnə ifası və bədii qiraət, Futbol, voleybol və basketbol, Fotoqrafiya və video çəkilişi",
    role: "student",
    major: "Aktyor sənəti ",
    firstName: "Gülay",
    linkedInURL: "",
    achievementIds: [],
    googleScholarURL: "",
    portfolioURL: "",
    status: "təsdiqlənmiş",
    githubURL: ""
  },
  {
    createdAt: "2025-11-24T08:07:57.980Z",
    certificateIds: [],
    faculty: "Tarix-filologiya fakültəsi",
    talentScore: 10,
    achievementIds: [],
    courseYear: 1,
    linkedInURL: "",
    behanceURL: "",
    category: "Teatr, səhnə ifası və bədii qiraət",
    portfolioURL: "",
    major: "Tarix",
    email: "heyderhesenov6305@gmail.com",
    projectIds: [],
    instagramURL: "",
    status: "təsdiqlənmiş",
    lastName: "Hesenov",
    githubURL: "",
    firstName: "Heyder",
    skills: [],
    id: "18852991-a069-4b93-a7e5-c7ef89a1fd15",
    role: "student"
  },
  {
    email: "aydanquliyeva1@icloud.com",
    faculty: "Tibb fakültəsi",
    skills: [],
    githubURL: "",
    createdAt: "2025-11-25T01:16:19.837Z",
    portfolioURL: "",
    achievementIds: [],
    role: "student",
    major: "Tibb",
    courseYear: 1,
    projectIds: [],
    behanceURL: "",
    instagramURL: "",
    id: "1b4f84ce-90cd-4dee-9137-ebe48e3886bc",
    linkedInURL: "",
    status: "gözləyir",
    firstName: "Aydan ",
    lastName: "Quliyeva",
    talentScore: 10,
    certificateIds: [],
    category: "Teatr, səhnə ifası və bədii qiraət, Fotoqrafiya və video çəkilişi, Elmi məqalə yazmaq və araşdırma aparmaq"
  },
  {
    projectIds: [],
    certificateIds: [],
    firstName: "İlkin",
    id: "1dc8c46e-89c9-4cfe-9941-b56ac139304a",
    githubURL: null,
    faculty: "Tibb fakültəsi",
    portfolioURL: null,
    category: "Xarici dillərdə yüksək səviyyədə danışıq, Futbol, voleybol və basketbol, Startup ideyaları və model hazırlamaq, Tədqiqatçılıq, Məlumatların təhlili və statistik yanaşma, Elmi məqalə yazmaq və araşdırma aparmaq",
    behanceURL: null,
    gpa: 62.5,
    status: "təsdiqlənmiş",
    talentScore: 30,
    profilePictureUrl: "https://istedadmerkezi.net/api/sekiller/profile_1763987445967.jpg",
    instagramURL: "https://www.instagram.com/ilkinhaciyef?igsh=cWVob29oNTNjczMx&utm_source=qr",
    role: "student",
    linkedInURL: "https://www.linkedin.com/in/ilkin-hac%C4%B1yev-17599938a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    googleScholarURL: null,
    educationForm: "Əyani",
    major: "Müalicə işi SABAH qrupları",
    successStory: "Mən  İlkin Hacıyev sizə uğur hekayəmi belə danışmaq istəyirəm .İlk öncə hər şey ailəmin məni liseyə yönləndirməsi ilə başladı. Burada olan rəqabət , prinsip və hirs məni daha fərqli birinə çevirdi . Tibbə yönəlməyimin əsas səbəbi həkim olan əmimdir . Tibb fakültəsinə daxil olmamışdan qabaq gecə gündüz çalışdığımı deyə bilmərəm . Amma bütün elmi , sosial , intellektual layihələrdə iştirak edirdim. Sanki çox çalışma ağıllı çalış. Universitet illəri boyunca öz inkişafıma yetərincə vaxt ayıra bildiyimi düşünürəm. Yalnızca intellektual olaraq deyil , həm də mənəvi və sosial inkişaf edə bildiyimə inanıram. \nHər kəsə Uğurlar!!",
    youtubeURL: null,
    achievementIds: [],
    skills: [
      {
        level: "İrəli",
        name: "Sürətli öyrənmə"
      },
      {
        name: "Analitik düşünmə",
        level: "İrəli"
      },
      {
        level: "İrəli",
        name: "Praktiki yanaşma"
      },
      {
        name: "Texniki bacarıqlar",
        level: "Orta"
      },
      {
        level: "Orta",
        name: "Tibbi bacarıqlar"
      }
    ],
    createdAt: "2025-11-24T12:27:33.520Z",
    lastName: "Hacıyev",
    email: "ilkinhaciyev2006@gmail.com",
    courseYear: 3
  },
  {
    courseYear: 1,
    talentScore: 10,
    faculty: "Xarici dillər fakültəsi",
    successStory: "",
    profilePictureUrl: "",
    email: "nuraymuslumova@ndu.edu.az",
    id: "233c7c8d-b213-425a-8f8d-473b50e156a8",
    skills: [],
    instagramURL: "https://www.instagram.com/nuray.muslumovaa?igsh=MTF3NWVwMnIwY29nMw==",
    behanceURL: "",
    lastName: "Müslümova ",
    createdAt: "2025-11-25T10:17:31.533Z",
    gpa: 0,
    educationForm: "",
    youtubeURL: "",
    projectIds: [],
    certificateIds: [],
    category: "Xarici dillərdə yüksək səviyyədə danışıq, Tədqiqatçılıq, Məlumatların təhlili və statistik yanaşma, Elmi məqalə yazmaq və araşdırma aparmaq",
    role: "student",
    firstName: "Nuray",
    major: "İngilis dili müəllimliyi ",
    linkedInURL: "",
    achievementIds: [],
    googleScholarURL: "",
    portfolioURL: "",
    status: "gözləyir",
    githubURL: ""
  },
  {
    role: "student",
    major: "Medical",
    behanceURL: "",
    status: "təsdiqlənmiş",
    instagramURL: "",
    projectIds: [],
    faculty: "Tibb fakültəsi",
    createdAt: "2025-11-24T12:36:15.142Z",
    lastName: "Hüseynova",
    certificateIds: [],
    talentScore: 10,
    portfolioURL: "",
    courseYear: 2,
    skills: [],
    category: "Xarici dillərdə yüksək səviyyədə danışıq, Tədqiqatçılıq, Elmi məqalə yazmaq və araşdırma aparmaq",
    firstName: "Zeynəb",
    githubURL: "",
    linkedInURL: "",
    id: "244d2622-e88c-42c2-901d-e8ec08159c3e",
    email: "huseynovazeynebbb@gmail.com",
    achievementIds: []
  },
  {
    email: "yeganehasimli@gmail.com",
    achievementIds: [],
    skills: [],
    courseYear: 3,
    talentScore: 10,
    role: "student",
    major: "Filologiya ",
    certificateIds: [],
    projectIds: [],
    linkedInURL: "",
    githubURL: "",
    lastName: "Quliyeva ",
    category: "Teatr, səhnə ifası və bədii qiraət, Elmi məqalə yazmaq və araşdırma aparmaq",
    id: "32b3da2e-04d2-41f1-97f6-ca56bce80d8e",
    createdAt: "2025-11-24T08:08:12.446Z",
    behanceURL: "",
    faculty: "Tarix-filologiya fakültəsi",
    profilePictureUrl: "https://istedadmerkezi.net/api/sekiller/profile_1763972126856.jpg",
    status: "təsdiqlənmiş",
    firstName: "Firuzə ",
    instagramURL: "",
    portfolioURL: ""
  },
  {
    email: "azizovanasiba23@gmail.com",
    githubURL: "",
    id: "32f8ec57-da66-44cd-b600-fefffc125446",
    category: "Xarici dillərdə yüksək səviyyədə danışıq, Tədqiqatçılıq, Məlumatların təhlili və statistik yanaşma, Elmi məqalə yazmaq və araşdırma aparmaq",
    status: "gözləyir",
    createdAt: "2025-11-25T14:53:58.874Z",
    major: "Medical",
    linkedInURL: "",
    courseYear: 3,
    behanceURL: "",
    profilePictureUrl: "",
    skills: [],
    projectIds: [],
    lastName: "Əzizova",
    instagramURL: "",
    firstName: "Nəsibə",
    talentScore: 10,
    portfolioURL: "",
    certificateIds: [],
    achievementIds: [],
    role: "student",
    faculty: "Tibb fakültəsi"
  },
  {
    email: "hesenovatelli888@gmail.com",
    id: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    portfolioURL: "",
    lastName: "Həsənova",
    projectIds: [],
    behanceURL: "",
    instagramURL: "",
    role: "student",
    courseYear: 3,
    successStory: "Müxtəlif online təlimlərə qoşularaq bilik və bacarıqlarımı artırıram, bununla yanaşı hekayələr yazaraq yaradıcılıq yönümü də daim inkişaf etdirirəm. “Yeni Fikir” qəzetində “Filologiya – o, qızın seçimi deyil, taleyidir” adlı məqaləm dərc olunub və xüsusi diqqətə layiq görülərək “525-ci qəzet”də də yayımlanıb. 2024-2025-ci illərdə \"Xalq qəzeti\", “525-ci qəzet”, “Yeni fikir” və müxtəlif mətbuat orqanlarında 10-a yaxın məqaləm dərc olunub. 2025-ci ildə Azərbaycan Respublikası Mədəniyyət Nazirliyi tərəfindən fəaliyyət aparan Ədəbiyyat və İncəsənət portalında kifayət qədər oxucu rəğbəti qazanmış 2 hekayəm təqdim olunub. Naxçıvan Dövlət Universitetində 2024-2025-ci tədris ilində Tələbə Elmi Cəmiyyəti xətti ilə yerinə yetirdiyi elmi tədqiqat işinin nəticələrinə görə təltif edilmişəm. Tarix-filologiya fakültəsinin “Jurnalistika və xarici ölkələr ədəbiyyatı” kafedrası üzrə ll yerə layiq görülmüşəm.\n2025-ci ildə KDT MMC nəzdində olan \"MASTERMİND ACADEMY\" tərəfindən “peşəkarlığı, yaradıcıllığı və daim zövqlə hazırladığı dizaynlarla komandanın inkişafına verdiyi töhfələrə görə” təltif olunmuşam.\n“Xalq” qəzetində “Çevrilmənin ruhi dözülməzliyi” adlı məqaləm dərc olunub. “Ruhu kitab qoxuyan qız” hekayəm isə müxtəlif saytlarda yayımlanaraq oxucuların diqqətini cəlb edib.\nKazuo İshiguronun “Məni heç vaxt tərk etmə” əsərinə həsr etdiyim elmi məqaləm çap olunub. ",
    faculty: "Tarix-filologiya fakültəsi",
    educationForm: "Əyani",
    createdAt: "2025-11-24T15:45:52.644Z",
    gpa: 94,
    googleScholarURL: "",
    certificateIds: [],
    profilePictureUrl: "",
    achievementIds: [],
    linkedInURL: "",
    status: "təsdiqlənmiş",
    firstName: "Telli",
    talentScore: 77,
    youtubeURL: "",
    skills: [],
    major: "Filologiya( Azərbaycan dili və ədəbiyyat)",
    githubURL: "",
    category: "Tədqiqatçılıq, Məlumatların təhlili və statistik yanaşma, Elmi məqalə yazmaq və araşdırma aparmaq"
  },
  {
    talentScore: 10,
    skills: [],
    firstName: "Nilufer",
    lastName: "Ilyaszade",
    role: "student",
    major: "Tibb sabah",
    email: "niluferilyaszade@icloud.com",
    courseYear: 3,
    certificateIds: [],
    id: "3b886fff-7961-428e-ba4c-10c768468f0a",
    linkedInURL: "",
    createdAt: "2025-11-24T12:15:37.275Z",
    githubURL: "",
    achievementIds: [],
    projectIds: [],
    category: "Musiqi ifaçılığı (fortepiano, tar, gitar, qarmon və s.), Teatr, səhnə ifası və bədii qiraət, Rəqs (milli, müasir, hip-hop), Bəstəkarlıq və mahnı yazmaq, Elmi məqalə yazmaq və araşdırma aparmaq, Fotoqrafiya və video çəkilişi",
    portfolioURL: "",
    faculty: "Tibb fakültəsi",
    instagramURL: "",
    status: "təsdiqlənmiş",
    behanceURL: ""
  },
  {
    linkedInURL: "",
    createdAt: "2025-11-26T18:39:23.661Z",
    id: "3e383ce4-707e-4b66-ae2e-c396f52016a5",
    talentScore: 10,
    behanceURL: "",
    educationForm: "eyani",
    courseYear: 5,
    youtubeURL: "",
    instagramURL: "https://www.instagram.com/davys_volition/",
    major: "Stomatologiya",
    certificateIds: [],
    successStory: "",
    gpa: 80,
    email: "otaconooocelot@gmail.com",
    skills: [
      {
        level: "İrəli",
        name: "İngilis Dili C-1"
      },
      {
        level: "Orta",
        name: "İsveç Dili B-1"
      },
      {
        name: "Phyton Yazılım",
        level: "Orta"
      },
      {
        level: "İrəli",
        name: "GDScript Yazılım"
      },
      {
        name: "5 Yıllık translator deneyimi",
        level: "İrəli"
      }
    ],
    githubURL: "",
    lastName: "Çakır",
    profilePictureUrl: "",
    status: "gözləyir",
    faculty: "Tibb fakültəsi",
    role: "student",
    portfolioURL: "",
    projectIds: [],
    googleScholarURL: "",
    firstName: "Mem Doğuhan",
    achievementIds: [],
    category: "Xarici dillərdə yüksək səviyyədə danışıq, Elmi məqalə yazmaq və araşdırma aparmaq, Startup ideyaları və model hazırlamaq, Məlumatların təhlili və statistik yanaşma"
  },
  {
    talentScore: 10,
    role: "student",
    lastName: "Kara",
    achievementIds: [],
    courseYear: 3,
    createdAt: "2025-11-24T12:15:33.261Z",
    major: "Stamatologiya",
    email: "ezgii.kara1905@hotmail.com",
    behanceURL: "",
    id: "45619d95-3846-44d5-b3f7-41580467cee3",
    linkedInURL: "",
    certificateIds: [],
    portfolioURL: "",
    category: "Futbol, voleybol və basketbol, Xarici dillərdə yüksək səviyyədə danışıq, Teatr, səhnə ifası və bədii qiraət",
    githubURL: "",
    faculty: "Tibb fakültəsi",
    instagramURL: "",
    firstName: "Emine ezgi",
    projectIds: [],
    skills: [],
    status: "təsdiqlənmiş"
  },
  {
    id: "4a62f6b9-7f9e-4c8f-81d8-e7c1d9d24256",
    faculty: "İncəsənət fakültəsi",
    skills: [],
    role: "student",
    firstName: "Telan",
    linkedInURL: "",
    portfolioURL: "",
    githubURL: "",
    email: "telanjabiyeva@gmail.com",
    certificateIds: [],
    major: "Təsviri İncəsənət Müəllimliyi",
    instagramURL: "",
    category: "Qrafik dizayn və rəqəmsal illüstrasiya, Elmi məqalə yazmaq və araşdırma aparmaq, Rəsm, karikatura və rəngkarlıq, Fotoqrafiya və video çəkilişi, Startup ideyaları və model hazırlamaq, 3D modelləşdirmə və məhsul dizaynı",
    lastName: "Jabiyeva",
    behanceURL: "",
    talentScore: 10,
    projectIds: [],
    courseYear: 2,
    achievementIds: [],
    status: "təsdiqlənmiş",
    createdAt: "2025-11-24T12:31:07.540Z"
  },
  {
    instagramURL: "",
    behanceURL: "",
    successStory: "Çoxlu kitab oxuyaraq, mütaliə edərək, yazmaq bacarığımı əldə etmişəm. ",
    educationForm: "Əyani ",
    googleScholarURL: "",
    youtubeURL: "",
    category: "Elmi məqalə yazmaq və araşdırma aparmaq",
    email: "ebrubayramova566@gmail.com",
    portfolioURL: "",
    projectIds: [],
    courseYear: 3,
    role: "student",
    firstName: "Ebru",
    githubURL: "",
    linkedInURL: "",
    certificateIds: [],
    achievementIds: [],
    profilePictureUrl: "",
    skills: [
      {
        name: "Elmi, publisistik məqalələr araşdırıb, yazmaq",
        level: "Orta"
      },
      {
        name: "Tədqiqatçılıq",
        level: "Orta"
      }
    ],
    lastName: "Bayramova",
    gpa: 88,
    faculty: "Tarix-filologiya fakültəsi",
    status: "təsdiqlənmiş",
    major: "Filologiya ",
    createdAt: "2025-11-24T15:28:04.653Z",
    talentScore: 83,
    id: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69"
  },
  {
    githubURL: "",
    certificateIds: [],
    createdAt: "2025-11-24T12:16:07.362Z",
    faculty: "Tibb fakültəsi",
    instagramURL: "",
    firstName: "Kenan",
    linkedInURL: "",
    category: "Futbol, voleybol və basketbol",
    portfolioURL: "",
    courseYear: 5,
    lastName: "Çetin ",
    email: "kenancetin.2002@gmail.com",
    major: "Tibb",
    projectIds: [],
    behanceURL: "",
    achievementIds: [],
    id: "4ebbc1d9-2749-4d16-8786-e4033c44798e",
    talentScore: 10,
    status: "gözləyir",
    skills: [],
    role: "student"
  },
  {
    profilePictureUrl: "",
    projectIds: [],
    portfolioURL: "",
    faculty: "Tibb fakültəsi",
    achievementIds: [],
    githubURL: "",
    role: "student",
    courseYear: 2,
    instagramURL: "",
    linkedInURL: "",
    id: "4f03fb00-0b20-4b5e-b123-4eacc8686962",
    firstName: "Muhammed Hatip",
    createdAt: "2025-11-25T05:30:05.837Z",
    lastName: "Koç",
    certificateIds: [],
    behanceURL: "",
    email: "muhammednurullah50@gmail.com",
    category: "Tədqiqatçılıq",
    skills: [],
    major: "Stomatologiya",
    status: "gözləyir",
    talentScore: 10
  },
  {
    status: "gözləyir",
    certificateIds: [],
    talentScore: 10,
    linkedInURL: "",
    achievementIds: [],
    skills: [],
    firstName: "Zeynəb ",
    profilePictureUrl: "",
    projectIds: [],
    githubURL: "",
    faculty: "Tarix-filologiya fakültəsi",
    instagramURL: "",
    major: "Jurnalistika ",
    portfolioURL: "",
    createdAt: "2025-11-25T12:57:03.676Z",
    behanceURL: "",
    lastName: "Seyidli ",
    courseYear: 2,
    category: "Startup ideyaları və model hazırlamaq, Məlumatların təhlili və statistik yanaşma, Tədqiqatçılıq",
    id: "4f260887-f033-42ab-bfb6-f4ba603fca4a",
    email: "zeynepseyidli2007@gmail.com",
    role: "student"
  },
  {
    linkedInURL: "",
    major: "Komputer mühəndisliyi İkili diplom (tədiris ingiliscə)",
    lastName: "Hüseynova",
    role: "student",
    firstName: "Turanə",
    email: "turanahuseynova0106@gmail.com",
    courseYear: 1,
    instagramURL: "",
    githubURL: "",
    skills: [],
    faculty: "Memarlıq və mühəndislik fakültəsi",
    createdAt: "2025-11-24T17:56:05.004Z",
    status: "təsdiqlənmiş",
    achievementIds: [],
    talentScore: 10,
    behanceURL: "",
    portfolioURL: "",
    projectIds: [],
    id: "4f4ad1d7-9017-4d6b-b253-9759cd01600b",
    category: "Süni intellekt və maşın öyrənməsi, Qrafik dizayn və rəqəmsal illüstrasiya, Kibertəhlükəsizlik bacarıqları, Startup ideyaları və model hazırlamaq",
    certificateIds: []
  },
  {
    profilePictureUrl: "",
    role: "student",
    firstName: "Emil",
    category: "Elmi məqalə yazmaq və araşdırma aparmaq, Tədqiqatçılıq",
    linkedInURL: "https://www.linkedin.com/in/emilr%C9%99hmanl%C4%B1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    projectIds: [],
    email: "emilrahmanli7@gmail.com",
    behanceURL: "",
    id: "52b273f4-bbdd-40fe-a9f1-205ccc110f38",
    githubURL: "",
    courseYear: 2,
    faculty: "Beynəlxalq münasibətlər və hüquq fakültəsi",
    certificateIds: [],
    status: "gözləyir",
    major: "Hüquqşünaslıq",
    educationForm: "Əyani",
    lastName: "Rəhmanlı",
    createdAt: "2025-11-25T05:27:20.498Z",
    achievementIds: [],
    portfolioURL: "",
    instagramURL: "https://www.instagram.com/emilrahmanli?igsh=bWcwMmk5MHBsem1x&utm_source=qr",
    gpa: 90.1,
    successStory: "",
    googleScholarURL: "",
    skills: [
      {
        name: "Komanda İdarəçiliyi və Liderlik",
        level: "İrəli"
      },
      {
        level: "İrəli",
        name: "Tədbir Təşkili və Koordinasiya"
      },
      {
        level: "İrəli",
        name: "Təşkilatçılıq və Planlaşdırma"
      },
      {
        name: "Komanda ruhu yaratmaq və kütləni motivasiya etmək",
        level: "İrəli"
      },
      {
        name: "Natiqlik və debat bacarıqları",
        level: "İrəli"
      }
    ],
    talentScore: 10,
    youtubeURL: ""
  },
  {
    createdAt: "2025-11-25T15:18:51.334Z",
    faculty: "Xarici dillər fakültəsi",
    courseYear: 2,
    status: "gözləyir",
    successStory: "",
    youtubeURL: "",
    category: "Rəsm, karikatura və rəngkarlıq, Futbol, voleybol və basketbol",
    googleScholarURL: "",
    instagramURL: "https://www.instagram.com/sevinc._hs?igsh=MWJnZGV0MmY0b3dwbg==",
    behanceURL: "",
    firstName: "Sevinc ",
    skills: [],
    projectIds: [],
    achievementIds: [],
    role: "student",
    profilePictureUrl: "",
    certificateIds: [],
    id: "556b6a6f-06ae-447e-b9e4-9071318142e3",
    email: "sevinchsnva2006@gmail.com",
    educationForm: "Əyani ",
    githubURL: "",
    talentScore: 10,
    linkedInURL: "",
    major: "Tərcümə İngilis ",
    lastName: "Həsənova ",
    portfolioURL: "",
    gpa: 85.43
  },
  {
    linkedInURL: "",
    id: "581a675b-44e9-4550-aeb1-dcac46c56cd6",
    googleScholarURL: "",
    createdAt: "2025-11-24T08:31:10.392Z",
    profilePictureUrl: "",
    youtubeURL: "",
    talentScore: 10,
    status: "təsdiqlənmiş",
    role: "student",
    major: "Azərbaycan dili və Ədəbiyyatı müəllimliyi ",
    behanceURL: "",
    certificateIds: [],
    category: "Rəsm, karikatura və rəngkarlıq",
    faculty: "Tarix-filologiya fakültəsi",
    gpa: 0,
    email: "haciyevanigar2217@gmail.com",
    lastName: "Hacıyeva ",
    githubURL: "",
    firstName: "Nigar ",
    skills: [],
    educationForm: "Əyani",
    projectIds: [],
    portfolioURL: "",
    instagramURL: "",
    achievementIds: [],
    successStory: "",
    courseYear: 1
  },
  {
    googleScholarURL: "",
    courseYear: 3,
    firstName: "Əyyub",
    educationForm: "Əyani",
    category: "Kibertəhlükəsizlik bacarıqları, Startup ideyaları və model hazırlamaq, Tədqiqatçılıq, Süni intellekt və maşın öyrənməsi, Məlumatların təhlili və statistik yanaşma, Elmi məqalə yazmaq və araşdırma aparmaq",
    instagramURL: "https://www.instagram.com/ibrahimov__.85?igsh=cmpmajhwemw4NXp1",
    profilePictureUrl: "",
    behanceURL: "",
    talentScore: 95,
    projectIds: [],
    status: "təsdiqlənmiş",
    certificateIds: [],
    email: "eyyubibrahimov5030@gmail.com",
    id: "58226ea5-90b4-4278-b57f-9cded7ee0384",
    achievementIds: [],
    skills: [
      {
        level: "İrəli",
        name: "Kibertəhlükəsizlik"
      },
      {
        name: "•Zəifliklərin Aşkarlanması və İdarə Edilməsi",
        level: "Orta"
      },
      {
        name: "•Şəbəkə və İnfrastruktur Təhlükəsizliyi",
        level: "Başlanğıc"
      },
      {
        level: "İrəli",
        name: "•Təhlükə Kəşfiyyatı və OSINT Analizi"
      },
      {
        level: "Orta",
        name: "•Python ilə Təhlükəsizlik Avtomatlaşdırması"
      },
      {
        name: "•Penetrasiya Testi",
        level: "Orta"
      },
      {
        level: "İrəli",
        name: "•Rəqəmsal Kriminalistika"
      },
      {
        level: "Orta",
        name: "•Kritik İnfrastruktur (ICS/SCADA) Təhlükəsizliyi"
      },
      {
        level: "İrəli",
        name: "•Kibertəhlükəsizlik Tədqiqatçılığı və İnnovasiya"
      },
      {
        level: "İrəli",
        name: "•Rəqəmsal İdarəetmə Təcrübəsi"
      }
    ],
    role: "student",
    youtubeURL: "",
    faculty: "Memarlıq və mühəndislik fakültəsi",
    portfolioURL: "",
    githubURL: "https://github.com/eyyub006",
    linkedInURL: "https://www.linkedin.com/in/eyyub-ibrahimli-1708a2277?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    successStory: "Mənim uğur hekayəm bir ixtisasın hüdudlarına sığmayan seçimlərin nəticəsidir. Ekologiya Mühəndisliyi təhsil alarkən, paralel olaraq kibertəhlükəsizlik sahəsinə yönəlməyim sadəcə maraq deyildi — gələcəyin strateji sahəsini vaxtında görmək idi.\n\n2023-cü ildə HackerOne-da tədqiqat aparmağa başladım və ilk zəiflikləri aşkarladıqca öz yolumu daha aydın gördüm. CCNA, Ethical Hacking, Threat Intelligence kimi sertifikatlarla biliklərimi möhkəmləndirdim və Python-dan tutmuş şəbəkə təhlükəsizliyinə qədər çoxşaxəli bacarıqlar qazandım.\n\n2024-cü ildə TENA-nı yaratmağım mənim üçün dönüş nöqtəsi oldu — artıq yalnız tədqiqatçı deyil, həm də innovasiya qurucusu kimi fəaliyyət göstərirdim. Dövlət Gömrük Komitəsində voluntar təcrübəm isə rəqəmsal idarəetmənin içindən baxmaq imkanı verdi.\n\nCIDC 2025-də iştirakım isə düşüncəmi daha da dərinləşdirdi: kritik infrastrukturun müdafiəsini real ssenarilər üzərindən görmək mənə kibertəhlükəsizliyin sadəcə texniki bilik yox, həm də strateji düşüncə olduğunu göstərdi.\n\nBu gün mən həm ekologiya mühəndisliyi, həm də kibertəhlükəsizlik üzrə çoxşaxəli biliklərə sahib, tədqiqatçı, analitik və innovativ yanaşmalı bir mütəxəssis kimi yoluma davam edirəm. Mənim hekayəm hələ bitməyib — əksinə, indi daha böyük məqsədlərin başlanğıcıdır.🇦🇿",
    gpa: 80.4,
    lastName: "İbrahimli",
    major: "Ekologiya Mühəndisliyi",
    createdAt: "2025-11-24T11:40:18.915Z"
  },
  {
    googleScholarURL: null,
    certificateIds: [],
    githubURL: null,
    faculty: "Memarlıq və mühəndislik fakültəsi",
    gpa: 77.8,
    successStory: null,
    talentScore: 35,
    skills: [
      {
        name: "IT",
        level: "İrəli"
      }
    ],
    achievementIds: [],
    portfolioURL: null,
    role: "student",
    major: "Kompüter Mühəndisliyi",
    youtubeURL: null,
    id: "582820c1-4734-42a5-81b7-2a3de2ddd158",
    firstName: "Hüseyn",
    category: "Süni intellekt və maşın öyrənməsi, Xarici dillərdə yüksək səviyyədə danışıq, 3D modelləşdirmə və məhsul dizaynı, Məlumatların təhlili və statistik yanaşma, Startup ideyaları və model hazırlamaq, Qrafik dizayn və rəqəmsal illüstrasiya, Elmi məqalə yazmaq və araşdırma aparmaq, Fotoqrafiya və video çəkilişi",
    email: "huseyntahirov@ndu.edu.az",
    courseYear: 1,
    educationForm: "Əyani",
    projectIds: [],
    linkedInURL: null,
    profilePictureUrl: "",
    createdAt: "2025-11-24T10:05:21.788Z",
    status: null,
    instagramURL: null,
    lastName: "Tahirov",
    behanceURL: null
  },
  {
    linkedInURL: "",
    major: "Musiqi müellimliyi",
    lastName: "Karabağ",
    role: "student",
    firstName: "Orçun",
    courseYear: 4,
    email: "karabag6730@gmail.com",
    instagramURL: "",
    githubURL: "",
    skills: [],
    faculty: "İncəsənət fakültəsi",
    createdAt: "2025-11-24T10:58:42.252Z",
    talentScore: 10,
    achievementIds: [],
    status: "təsdiqlənmiş",
    behanceURL: "",
    profilePictureUrl: "https://istedadmerkezi.net/api/sekiller/profile_1763999495022.jpg",
    portfolioURL: "",
    projectIds: [],
    id: "5f1405af-f691-4539-a049-19ea95a69b1b",
    category: "Musiqi ifaçılığı (fortepiano, tar, gitar, qarmon və s.)",
    certificateIds: []
  },
  {
    createdAt: "2025-11-25T13:05:59.491Z",
    githubURL: "",
    major: "İngilis dili müəllimlik",
    email: "fidanismayilovanib@gmail.com",
    courseYear: 2,
    role: "student",
    firstName: "Fidan",
    category: "Xarici dillərdə yüksək səviyyədə danışıq, Rəqs (milli, müasir, hip-hop), Futbol, voleybol və basketbol, Karate, taekvondo və judo, Elmi məqalə yazmaq və araşdırma aparmaq, Musiqi ifaçılığı (fortepian, tar, gitar, qarmon və s.), Teatr, səhnə ifası və bədii qiraət, Startup ideyaları və model hazırlamaq",
    skills: [],
    talentScore: 35,
    portfolioURL: "",
    behanceURL: "",
    id: "6580b7ce-23b6-4bdc-a169-035501acb3a6",
    projectIds: [],
    faculty: "Xarici dillər fakültəsi",
    achievementIds: [],
    profilePictureUrl: "",
    lastName: "İsmayılova",
    instagramURL: "",
    status: "gözləyir",
    certificateIds: [],
    linkedInURL: ""
  },
  {
    profilePictureUrl: "https://istedadmerkezi.net/api/sekiller/profile_1764003220259.jpg",
    linkedInURL: "",
    instagramURL: "",
    firstName: "aysel",
    createdAt: "2025-11-24T16:52:18.308Z",
    behanceURL: "",
    status: "təsdiqlənmiş",
    achievementIds: [],
    talentScore: 10,
    category: "Teatr, səhnə ifası və bədii qiraət, Elmi məqalə yazmaq və araşdırma aparmaq, Məlumatların təhlili və statistik yanaşma, Startup ideyaları və model hazırlamaq",
    skills: [],
    certificateIds: [],
    projectIds: [],
    portfolioURL: "",
    githubURL: "",
    major: "dövlet ve ictimai münasibetler",
    courseYear: 1,
    lastName: "tehmezbeyova",
    role: "student",
    id: "65f73614-d175-4a2e-8cf1-111c4525ef4e",
    faculty: "Beynəlxalq münasibətlər və hüquq fakültəsi",
    email: "aiselthmzbyvhaa@gmail.com"
  },
  {
    status: "gözləyir",
    role: "student",
    faculty: "Pedaqoji fakültə",
    behanceURL: "",
    skills: [
      {
        level: "Başlanğıc",
        name: "Voleybol, resm, uzguculuk, təşkilatçılıq"
      }
    ],
    linkedInURL: "",
    githubURL: "",
    gpa: 0,
    instagramURL: "",
    profilePictureUrl: "",
    lastName: "Rüstəmli",
    certificateIds: [],
    projectIds: [],
    successStory: "8 ci sinifden voleybolla mesqulam\nMekteb illerinde tovuz regionalin komandasinda idim\nDaha sonra bakida ryuga komandasina daxil oldum\nSonra universitet ucun naxcivana geldim ve burada universitetin, fakultenin komandasinin uzvuyem.\nIndiyene kimi qatildigim her yarisda qalib olmusuq.\nMasa tennisinide bacariram\nFakulteler arasi yarisda 1 ci yer olmusdum.\n\nElave olaraq  uzguculuk, resm qabiliyyetimde cox yaxsidir.\n\nHemcinin teskilatciligimda yaxsidir. Hazirda pedaqoji fakultenin tgt sedriyem.",
    courseYear: 2,
    category: "Rəsm, karikatura və rəngkarlıq, Futbol, voleybol və basketbol, Atletika, gimnastika və üzgüçülük",
    talentScore: 10,
    googleScholarURL: "",
    portfolioURL: "",
    email: "rustemlizuleyxa@gmail.com",
    firstName: "Züleyxa",
    major: "Fiziki tərbuyə və çağırışa qədərki hazırlıq müəllimliyi",
    educationForm: "Əyani",
    youtubeURL: "",
    achievementIds: [],
    createdAt: "2025-11-25T05:46:23.857Z",
    id: "718dc50e-b814-4dd0-9e26-693b3e23c73a"
  },
  {
    projectIds: [],
    firstName: "Xatirə",
    createdAt: "2025-11-24T14:55:33.477Z",
    githubURL: "",
    behanceURL: "",
    talentScore: 10,
    id: "71db11c1-60c3-460c-9c5b-0ff5b185fe15",
    status: "təsdiqlənmiş",
    courseYear: 1,
    skills: [],
    instagramURL: "",
    portfolioURL: "",
    lastName: "Həsənova",
    category: "Teatr, səhnə ifası və bədii qiraət, Tədqiqatçılıq, Məlumatların təhlili və statistik yanaşma, Elmi məqalə yazmaq və araşdırma aparmaq",
    faculty: "Tarix-filologiya fakültəsi",
    role: "student",
    linkedInURL: "",
    major: "Azərbaycan dili və ədəbiyyat müəllimliyi",
    certificateIds: [],
    email: "xatirehesenovaa01@gmail.com",
    achievementIds: []
  },
  {
    gpa: 80,
    educationForm: "Əyani",
    certificateIds: [],
    talentScore: 78,
    major: "Tibb-SABAH",
    successStory: "",
    id: "81f7f1b4-0cc8-4ad2-9798-b28dfcbf9d9a",
    googleScholarURL: "",
    skills: [],
    email: "drgunay2006@gmail.com",
    faculty: "Tibb fakültəsi",
    behanceURL: "",
    status: "gözləyir",
    courseYear: 3,
    portfolioURL: "",
    achievementIds: [],
    lastName: "Hüseynzadə",
    projectIds: [],
    youtubeURL: "",
    instagramURL: "https://www.instagram.com/drgunayh23?igsh=MWJ2ODMzemp1N3MyNA%3D%3D&utm_source=qr",
    githubURL: "",
    role: "student",
    linkedInURL: "https://www.linkedin.com/in/g%C3%BCnay-h%C3%BCseynzad%C9%99-01bb13353?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    profilePictureUrl: "",
    createdAt: "2025-11-25T07:19:42.347Z",
    category: "Tədqiqatçılıq, Elmi məqalə yazmaq və araşdırma aparmaq",
    firstName: "Günay"
  },
  {
    courseYear: 4,
    behanceURL: "",
    projectIds: [],
    educationForm: "",
    role: "student",
    profilePictureUrl: "",
    major: "Musiqi Müellimliyi",
    category: "Musiqi ifaçılığı (fortepiano, tar, gitar, qarmon və s.), Futbol, voleybol və basketbol",
    faculty: "İncəsənət fakültəsi",
    gpa: 0,
    instagramURL: "",
    status: "təsdiqlənmiş",
    portfolioURL: "",
    googleScholarURL: "",
    talentScore: 10,
    id: "8285267f-5a98-4031-a3b6-6e673b506b50",
    linkedInURL: "",
    certificateIds: [],
    achievementIds: [],
    lastName: "Gökhasan",
    email: "bgokhasan1@gmail.com",
    skills: [],
    firstName: "Batuhan",
    githubURL: "",
    youtubeURL: "",
    createdAt: "2025-11-24T15:55:48.915Z",
    successStory: ""
  },
  {
    linkedInURL: "",
    portfolioURL: "",
    githubURL: "",
    courseYear: 3,
    talentScore: 10,
    certificateIds: [],
    behanceURL: "",
    skills: [],
    faculty: "Tibb fakültəsi",
    achievementIds: [],
    createdAt: "2025-11-24T14:28:12.685Z",
    lastName: "Allahverdiyev",
    id: "849f7855-23dc-4b0a-9625-76c094b9bb2d",
    category: "Qrafik dizayn və rəqəmsal illüstrasiya, Musiqi ifaçılığı (fortepiano, tar, gitar, qarmon və s.)",
    firstName: "Amin",
    major: "Tibb",
    email: "sirallamin@gmail.com",
    status: "təsdiqlənmiş",
    projectIds: [],
    role: "student",
    instagramURL: ""
  },
  {
    status: "təsdiqlənmiş",
    instagramURL: "",
    projectIds: [],
    lastName: "Babazadə",
    email: "farasat.babazada7@gmail.com",
    certificateIds: [],
    id: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    successStory: "",
    behanceURL: "",
    educationForm: "Əyani",
    firstName: "Fərasət",
    youtubeURL: "",
    achievementIds: [],
    createdAt: "2025-11-24T08:37:55.624Z",
    skills: [
      {
        level: "Orta",
        name: "Hekayə, məqalə yazmaq"
      }
    ],
    profilePictureUrl: "",
    portfolioURL: "",
    category: "Tədqiqatçılıq, Elmi məqalə yazmaq və araşdırma aparmaq",
    talentScore: 82,
    role: "student",
    githubURL: "",
    googleScholarURL: "",
    major: "Filologiya",
    linkedInURL: "",
    courseYear: 3,
    faculty: "Tarix-filologiya fakültəsi",
    gpa: 94.1
  },
  {
    lastName: "Qulizadə",
    category: "Rəsm, karikatura və rəngkarlıq, Qrafik dizayn və rəqəmsal illüstrasiya",
    certificateIds: [],
    gpa: 91,
    educationForm: "Əyani",
    major: "Dizayn",
    googleScholarURL: "",
    linkedInURL: "https://www.linkedin.com/in/shahrezad-guluzadeh-a69273385?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    role: "student",
    email: "quluzadee861@gmail.com",
    skills: [
      {
        level: "Orta",
        name: "Rəsm"
      },
      {
        level: "Orta",
        name: "Adobe illustrator,Adobe photoshop proqramlarında işləmək"
      }
    ],
    achievementIds: [],
    courseYear: 2,
    profilePictureUrl: "",
    talentScore: 10,
    portfolioURL: "",
    githubURL: "",
    firstName: "Şəhrizad",
    faculty: "İncəsənət fakültəsi",
    id: "90fa85d6-67b2-46dc-b642-6e00f30a6985",
    projectIds: [],
    createdAt: "2025-11-24T08:48:43.510Z",
    youtubeURL: "",
    status: "təsdiqlənmiş",
    instagramURL: "https://www.instagram.com/by.shahrezad?igsh=M2twbnJydmV2bGYx",
    successStory: "",
    behanceURL: "https://www.behance.net/sahrezaquluzad"
  },
  {
    email: "enescagataytopal@gmail.com",
    linkedInURL: "",
    projectIds: [],
    talentScore: 10,
    role: "student",
    firstName: "Enes Çağatay",
    githubURL: "",
    createdAt: "2025-11-24T15:21:35.865Z",
    id: "9591c728-4db3-41b0-a838-6d03396fd367",
    instagramURL: "",
    portfolioURL: "",
    status: "təsdiqlənmiş",
    courseYear: 1,
    category: "Futbol, voleybol və basketbol",
    achievementIds: [],
    certificateIds: [],
    behanceURL: "",
    skills: [],
    major: "Tibb",
    faculty: "Tibb fakültəsi",
    lastName: "Topal"
  },
  {
    firstName: "Səma",
    projectIds: [],
    certificateIds: [],
    createdAt: "2025-11-26T18:28:42.544Z",
    role: "student",
    talentScore: 10,
    category: "Teatr, səhnə ifası və bədii qiraət, Rəqs (milli, müasir, hip-hop)",
    id: "97b35206-f935-4192-9870-2600f9a9a851",
    instagramURL: "",
    status: "gözləyir",
    achievementIds: [],
    portfolioURL: "",
    linkedInURL: "",
    email: "semamehdiyeva2206@gmail.com",
    major: "Tibb",
    skills: [],
    lastName: "Mehdiyeva",
    courseYear: 1,
    faculty: "Tibb fakültəsi",
    githubURL: "",
    behanceURL: ""
  },
  {
    major: "Əczaçılıq",
    talentScore: 55,
    createdAt: "2025-11-26T20:19:35.008Z",
    portfolioURL: "",
    certificateIds: [],
    lastName: "Rəhimli",
    status: "gözləyir",
    linkedInURL: "",
    courseYear: 1,
    email: "nicat.rahimli07@gmail.com",
    githubURL: "",
    behanceURL: "",
    instagramURL: "",
    faculty: "Tibb fakültəsi",
    skills: [],
    id: "9fa71ee4-ba46-426a-8ab2-6458383a161d",
    achievementIds: [],
    category: "3D modelləşdirmə və məhsul dizaynı, Karate, taekvondo və judo, Məlumatların təhlili və statistik yanaşma, Elmi məqalə yazmaq və araşdırma aparmaq, Startup ideyaları və model hazırlamaq",
    projectIds: [],
    role: "student",
    firstName: "Nicat"
  },
  {
    major: "Tarix ",
    createdAt: "2025-11-24T08:15:00.336Z",
    status: "təsdiqlənmiş",
    courseYear: 1,
    lastName: "Ağayeva",
    linkedInURL: "",
    projectIds: [],
    behanceURL: "",
    id: "a247d881-2f49-493b-9ee5-26414af45a87",
    instagramURL: "",
    portfolioURL: "",
    firstName: "Aysu ",
    skills: [],
    role: "student",
    certificateIds: [],
    faculty: "Tarix-filologiya fakültəsi",
    achievementIds: [],
    githubURL: "",
    talentScore: 10,
    email: "aysua3358@gmail.com",
    category: "Rəsm, karikatura və rəngkarlıq"
  },
  {
    certificateIds: [],
    createdAt: "2025-11-24T12:11:38.496Z",
    faculty: "Tibb fakültəsi",
    talentScore: 10,
    achievementIds: [],
    courseYear: 3,
    linkedInURL: "",
    category: "Xarici dillərdə yüksək səviyyədə danışıq, Rəqs (milli, müasir, hip-hop), Elmi məqalə yazmaq və araşdırma aparmaq, Tədqiqatçılıq, Məlumatların təhlili və statistik yanaşma, Fotoqrafiya və video çəkilişi",
    behanceURL: "",
    portfolioURL: "",
    email: "gulay.xelilzade@icloud.com",
    major: "Tibb SABAH",
    projectIds: [],
    instagramURL: "",
    status: "təsdiqlənmiş",
    lastName: "Xəlilzadə",
    githubURL: "",
    firstName: "Gülay",
    skills: [],
    id: "a438db48-8e92-4864-8360-3e8653d7b73f",
    role: "student"
  },
  {
    certificateIds: [],
    linkedInURL: "",
    major: "Dövlət və ictimai münasibətlər",
    createdAt: "2025-11-24T17:22:13.328Z",
    portfolioURL: "",
    id: "a52f98b7-ee78-4e1d-8d00-d520a7b219e2",
    firstName: "Zeynəb",
    instagramURL: "",
    courseYear: 1,
    behanceURL: "",
    talentScore: 10,
    achievementIds: [],
    role: "student",
    email: "zeynepesgerova6@gmail.com",
    faculty: "Beynəlxalq münasibətlər və hüquq fakültəsi",
    githubURL: "",
    status: "təsdiqlənmiş",
    lastName: "Əsgərova",
    category: "Futbol, voleybol və basketbol, Elmi məqalə yazmaq və araşdırma aparmaq",
    projectIds: [],
    skills: []
  },
  {
    faculty: "Tarix-filologiya fakültəsi",
    firstName: "Həqiqət ",
    certificateIds: [],
    createdAt: "2025-11-24T08:01:58.587Z",
    achievementIds: [],
    category: "Tədqiqatçılıq, Məlumatların təhlili və statistik yanaşma, Elmi məqalə yazmaq və araşdırma aparmaq",
    role: "student",
    major: "Azərbaycan dili və ədəbiyyat müəllimliyi",
    id: "aa9774a0-a3f7-431a-ba64-d38420865ac2",
    status: "təsdiqlənmiş",
    courseYear: 3,
    behanceURL: "",
    linkedInURL: "",
    skills: [],
    instagramURL: "",
    githubURL: "",
    email: "thik@ndu.edu.az",
    talentScore: 10,
    projectIds: [],
    lastName: "Əsgərova",
    portfolioURL: ""
  },
  {
    gpa: 0,
    successStory: "İnnovasiya təlimlərində iştirak edib təcrübə qazanmışam və mentorluq edirəm",
    email: "sfrlseda@gmail.com",
    createdAt: "2025-11-24T07:50:51.638Z",
    educationForm: "Əyani",
    profilePictureUrl: "",
    youtubeURL: "",
    behanceURL: "",
    linkedInURL: "",
    achievementIds: [],
    faculty: "Tarix-filologiya fakültəsi",
    projectIds: [],
    role: "student",
    major: "Tarix",
    courseYear: 1,
    talentScore: 10,
    id: "ad5362f9-b28f-46af-8ba9-faa972c3ba4d",
    skills: [],
    githubURL: "",
    googleScholarURL: "",
    status: "təsdiqlənmiş",
    firstName: "Seda",
    instagramURL: "",
    portfolioURL: "",
    certificateIds: [],
    category: "Məlumatların təhlili və statistik yanaşma",
    lastName: "Səfərli"
  },
  {
    certificateIds: [],
    lastName: "Şahsuvarova",
    category: "Xarici dillərdə yüksək səviyyədə danışıq, Rəqs (milli, müasir, hip-hop), Elmi məqalə yazmaq və araşdırma aparmaq",
    behanceURL: "",
    gpa: 90.7,
    googleScholarURL: "",
    courseYear: 2,
    profilePictureUrl: "",
    educationForm: "Əyani",
    talentScore: 75,
    major: "Tərcümə ( İngilis Azərbaycan )",
    achievementIds: [],
    projectIds: [],
    instagramURL: "",
    portfolioURL: "",
    firstName: "Jalə",
    status: "təsdiqlənmiş",
    id: "b25df151-810d-450a-aea4-8351404de311",
    role: "student",
    skills: [
      {
        level: "Orta",
        name: "Elmi məqalə yazmaq və araşdırma aparmaq"
      },
      {
        level: "İrəli",
        name: "Xarici dillərdə yüksək səviyyədə danışıq"
      },
      {
        name: "Tədbir təşkilatçılığı",
        level: "Orta"
      },
      {
        name: "Layihələrin planlanması",
        level: "İrəli"
      },
      {
        level: "İrəli",
        name: "İctimai çıxış"
      }
    ],
    createdAt: "2025-11-24T08:30:30.730Z",
    successStory: "",
    githubURL: "",
    faculty: "Xarici dillər fakültəsi",
    youtubeURL: "",
    linkedInURL: "",
    email: "jsahsuvarova@gmail.com"
  },
  {
    portfolioURL: "",
    role: "student",
    profilePictureUrl: "https://istedadmerkezi.net/api/sekiller/profile_1763971940558.jpg",
    linkedInURL: "",
    githubURL: "",
    createdAt: "2025-11-24T08:07:37.781Z",
    major: "Jurnalistika ",
    behanceURL: "",
    firstName: "Onur ",
    skills: [],
    id: "b90cbd10-a824-4746-9598-cf8a36e486db",
    lastName: "Cəbrayılov ",
    talentScore: 10,
    status: "təsdiqlənmiş",
    projectIds: [],
    certificateIds: [],
    achievementIds: [],
    email: "onurcbrayilov062@gmail.com",
    faculty: "Tarix-filologiya fakültəsi",
    category: "Teatr, səhnə ifası və bədii qiraət, Xarici dillərdə yüksək səviyyədə danışıq, Atletika, gimnastika və üzgüçülük, Elmi məqalə yazmaq və araşdırma aparmaq",
    instagramURL: "",
    courseYear: 1
  },
  {
    talentScore: 10,
    successStory: "Kick boks üzrə  naxcıvan çempiyonu",
    lastName: "Novruzov",
    gpa: 71.4,
    certificateIds: [],
    youtubeURL: "",
    googleScholarURL: "",
    projectIds: [],
    faculty: "İncəsənət fakültəsi",
    status: "təsdiqlənmiş",
    email: "mehemmed.novruzov@icloud.com",
    educationForm: "Əyani",
    role: "student",
    createdAt: "2025-11-24T08:21:20.471Z",
    githubURL: "",
    courseYear: 2,
    portfolioURL: "",
    linkedInURL: "",
    behanceURL: "",
    achievementIds: [],
    id: "c67dbf82-84ff-4fdd-848d-b447569c4b9b",
    firstName: "Məhəmməd",
    profilePictureUrl: "",
    category: "Karate, taekvondo və judo",
    skills: [
      {
        level: "Orta",
        name: "Boks Kickboks"
      }
    ],
    major: "Aktyor sənəti",
    instagramURL: ""
  },
  {
    firstName: "Aysel",
    githubURL: "",
    talentScore: 10,
    status: "gözləyir",
    certificateIds: [],
    achievementIds: [],
    skills: [],
    major: "Filologiya",
    instagramURL: "",
    email: "lEsyAHseynzad@gmail.com",
    behanceURL: "",
    createdAt: "2025-11-25T04:56:08.545Z",
    id: "c898dbc3-43d7-413f-a513-a20ca2136fa4",
    role: "student",
    faculty: "Tarix-filologiya fakültəsi",
    linkedInURL: "",
    profilePictureUrl: "",
    projectIds: [],
    lastName: "Hüseynzadə",
    portfolioURL: "",
    category: "Elmi məqalə yazmaq və araşdırma aparmaq",
    courseYear: 1
  },
  {
    projectIds: [],
    firstName: "Sədaqət ",
    linkedInURL: "",
    id: "ca8e6a74-1bd1-4488-8b52-a85d0e4fe898",
    lastName: "Babayeva ",
    category: "Elmi məqalə yazmaq və araşdırma aparmaq",
    talentScore: 10,
    certificateIds: [],
    role: "student",
    courseYear: 3,
    portfolioURL: "",
    achievementIds: [],
    email: "babayevasedaqet76@gmail.com",
    major: "Filologiya ",
    skills: [],
    behanceURL: "",
    instagramURL: "",
    faculty: "Tarix-filologiya fakültəsi",
    createdAt: "2025-11-24T08:09:09.818Z",
    status: "təsdiqlənmiş",
    githubURL: ""
  },
  {
    category: "Startup ideyaları və model hazırlamaq, Məlumatların təhlili və statistik yanaşma, Elmi məqalə yazmaq və araşdırma aparmaq",
    id: "cbd71cff-45df-4f04-b85b-10f592acc769",
    linkedInURL: "",
    behanceURL: "",
    portfolioURL: "",
    faculty: "Tibb fakültəsi",
    lastName: "Tanrıverdiyeva",
    createdAt: "2025-11-24T14:57:14.325Z",
    certificateIds: [],
    firstName: "Nərgiz",
    instagramURL: "",
    projectIds: [],
    achievementIds: [],
    status: "təsdiqlənmiş",
    major: "Tibb ",
    email: "nargizztanriverdiyeva@gmail.com",
    skills: [],
    courseYear: 1,
    talentScore: 10,
    githubURL: "",
    role: "student"
  },
  {
    certificateIds: [],
    githubURL: "",
    talentScore: 50,
    status: "təsdiqlənmiş",
    educationForm: "Əyani",
    achievementIds: [],
    portfolioURL: "",
    role: "student",
    profilePictureUrl: "https://istedadmerkezi.net/api/sekiller/profile_1763989481643.jpg",
    createdAt: "2025-11-24T13:01:30.721Z",
    youtubeURL: "",
    successStory: "",
    gpa: 85.5,
    linkedInURL: "",
    firstName: "Nərgiz",
    lastName: "Qafarova ",
    instagramURL: "",
    googleScholarURL: "",
    projectIds: [],
    email: "qafarovan4@gmail.com",
    faculty: "Beynəlxalq münasibətlər və hüquq fakültəsi",
    id: "d07686de-7732-451f-b206-2a7a37ee2073",
    major: "Dövlət və İctimai münasibətlər ",
    skills: [
      {
        level: "İrəli",
        name: "Fortepiano\'da ifa etmək"
      },
      {
        name: "Səhnədə çıxış etmək, obraz yaratmaq, ifadəli və emosional danışmaq",
        level: "İrəli"
      },
      {
        level: "Orta",
        name: "Tədqiqatçılıq"
      },
      {
        name: "Məlumatların təhlili və statistik yanaşma",
        level: "Orta"
      },
      {
        name: "Araşdırma aparmaq",
        level: "İrəli"
      }
    ],
    category: "Musiqi ifaçılığı (fortepiano, tar, gitar, qarmon və s.), Məlumatların təhlili və statistik yanaşma, Elmi məqalə yazmaq və araşdırma aparmaq, Teatr, səhnə ifası və bədii qiraət, Startup ideyaları və model hazırlamaq, Tədqiqatçılıq",
    behanceURL: "",
    courseYear: 2
  },
  {
    linkedInURL: "",
    skills: [],
    createdAt: "2025-11-24T08:51:52.161Z",
    lastName: "Hüseynov ",
    successStory: "3 məqalə çap olunub",
    major: "Muzey,arxiv işi və abidələrin qorunması ",
    gpa: 86.6,
    role: "student",
    talentScore: 10,
    githubURL: "",
    profilePictureUrl: "",
    certificateIds: [],
    faculty: "Tarix-filologiya fakültəsi",
    instagramURL: "",
    category: "Məlumatların təhlili və statistik yanaşma",
    achievementIds: [],
    email: "intiqamliintiqam66@gmail.com",
    youtubeURL: "",
    courseYear: 3,
    firstName: "İntiqam ",
    id: "d1b49793-34ef-4d8d-aa62-03a12554f55c",
    status: "təsdiqlənmiş",
    behanceURL: "",
    portfolioURL: "",
    educationForm: "Əyani",
    projectIds: [],
    googleScholarURL: ""
  },
  {
    role: "student",
    talentScore: 10,
    category: "Rəqs (milli, müasir, hip-hop), Fotoqrafiya və video çəkilişi, Futbol, voleybol və basketbol, Qrafik dizayn və rəqəmsal illüstrasiya",
    projectIds: [],
    successStory: "",
    achievementIds: [],
    googleScholarURL: "",
    githubURL: "",
    profilePictureUrl: "https://istedadmerkezi.net/api/sekiller/profile_1763972652401.jpg",
    id: "ee089178-8538-4271-ab28-0a2aa1fd7532",
    createdAt: "2025-11-24T08:21:47.555Z",
    lastName: "Həsənov",
    educationForm: "Əyani",
    status: "təsdiqlənmiş",
    linkedInURL: "",
    portfolioURL: "",
    courseYear: 3,
    gpa: 82.7,
    faculty: "İncəsənət fakültəsi",
    skills: [],
    certificateIds: [],
    major: "Dizayn",
    firstName: "Rəhman",
    instagramURL: "https://www.instagram.com/hasanofff.555?igsh=dnJhajd4aGRhOGln&utm_source=qr",
    youtubeURL: "",
    email: "rveliyev844@gmail.com",
    behanceURL: ""
  },
  {
    profilePictureUrl: "https://istedadmerkezi.net/api/sekiller/profile_1763983377993.jpg",
    firstName: "Aytac",
    educationForm: "Əyani",
    googleScholarURL: "",
    courseYear: 2,
    createdAt: "2025-11-24T11:17:22.340Z",
    instagramURL: "",
    successStory: "",
    role: "student",
    major: "Energetika mühəndisliyi ",
    certificateIds: [],
    youtubeURL: "",
    id: "f6ea3a16-2605-4ca8-88c2-92bb1062637f",
    githubURL: "",
    email: "aytaccumsudova75@gmail.com",
    skills: [],
    projectIds: [],
    achievementIds: [],
    lastName: "Cümşüdova ",
    gpa: 70.9,
    talentScore: 10,
    faculty: "Memarlıq və mühəndislik fakültəsi",
    linkedInURL: "",
    behanceURL: "",
    portfolioURL: "",
    category: "3D modelləşdirmə və məhsul dizaynı, Elmi məqalə yazmaq və araşdırma aparmaq, Süni intellekt və maşın öyrənməsi",
    status: "təsdiqlənmiş"
  }
];

export const studentOrganizations: StudentOrganization[] = [];

export const projects: Project[] = [
  {
    id: "IlS838jORSaSECE1UtYA",
    invitedStudentIds: [],
    status: "davam edir",
    ownerId: "04209f24-63e2-44d5-ba75-9ff3aaf0e594",
    teamMembers: [
      "l"
    ],
    title: "Kamal Abdulla Hərdən mənə mələkdə deyirlər ",
    ownerType: "student",
    link: "",
    teamMemberIds: [],
    role: "Mələk ",
    description: "Tamaşadır. "
  },
  {
    id: "p6HGgEyhKifzrMwz4WoR",
    teamMembers: [
      "M"
    ],
    ownerType: "student",
    status: "davam edir",
    role: "Layihə rəhbəri, təlimçi",
    invitedStudentIds: [],
    title: "SpeakUP",
    description: "SpeakUP layihəsi Naxçıvan Dövlət Universitetində tələbələrin ingilis dili danışıq bacarıqlarını inkişaf etdirmək üçün yaradılmış interaktiv təlim proqramıdır. Layihə həm Conversation Club, həm də praktiki English Training dərslərini özündə birləşdirir. Tələbələr burada gündəlik mövzular, oyunlar və suallar vasitəsilə sərbəst danışıq təcrübəsi qazanırlar. Sessiyalar dinamik, maraqlı və tam interaktiv formatda keçirilir. Layihənin məqsədi tələbələrin real mühitdə özünəinamla ingiliscə danışmasını təmin etməkdir.",
    link: "https://www.instagram.com/p/DRPyR3cjGGW/?igsh=MXVtejNhdDg2N3gxMw==",
    teamMemberIds: [],
    ownerId: "52b273f4-bbdd-40fe-a9f1-205ccc110f38"
  },
  {
    id: "EK6SiK5IkkBGuAK2VOxH",
    teamMemberIds: [],
    status: "davam edir",
    link: "https://tenagroup.vercel.app/",
    ownerType: "student",
    description: "TENA Group – İnnovasiya və Təhlükəsizlik Qrupu\n\nTENA Group, veb inkişafı, kibertəhlükəsizlik və proqram təminatı sahələrində fəaliyyət göstərən, gələcəyə yönəlmiş texnoloji həllər yaradan bir layihədir. Məqsədimiz yalnız tətbiqlər yaratmaq deyil, həm də etibarlı, dayanıqlı və strateji rəqəmsal infrastruktur formalaşdırmaqdır.\n\nBiz real problemlərə innovativ yanaşma tətbiq edir, bizneslər və fərdlər üçün yüksək keyfiyyətli rəqəmsal məhsullar hazırlayırıq. Layihələrimiz arasında təhlükəsizlik sistemləri, veb platformalar və texnoloji avtomatizasiya həlləri yer alır.\n\nKomandamız veb tərtibatçıları, kibertəhlükəsizlik mütəxəssisləri və proqramçıların bir araya gəldiyi güclü və vizyoner bir birlikdir. TENA Group-un məqsədi regional və beynəlxalq səviyyədə etibarlı texnologiya ekosistemi qurmaq və innovasiyanın mərkəzində yer almaqdır.",
    title: "TENA group",
    ownerId: "58226ea5-90b4-4278-b57f-9cded7ee0384",
    teamMembers: [
      "E"
    ],
    role: "Kibertəhlükəsizlik Mütəxəssis,Mentor",
    invitedStudentIds: []
  },
  {
    id: "w83aknwX6T9seD6jjVMD",
    ownerId: "9fa71ee4-ba46-426a-8ab2-6458383a161d",
    status: "tamamlanıb",
    invitedStudentIds: [],
    teamMemberIds: [],
    title: "Xəzər dənizində suyun təmizlənməsi və qida zəncirinin bırpasi",
    ownerType: "student",
    link: "",
    role: "Developer, dizayner, fikirin əsas sahibi",
    teamMembers: [
      "🔥"
    ],
    description: "Bu qurğu sayəsində Xəzər dənizi həm neftdən və digər plastik maddələrdən təmizlənir həmçinin qurğunun bir hissəsinə milçək sürfələri qoyuruq və nəticədə qida zənciridə bərpa olunur"
  }
];

export const achievements: Achievement[] = [
  {
    id: "raizLP4n9aAQ1iQkpWnz",
    level: "Respublika",
    link: "https://www.instagram.com/p/Cqstd--tP6b/?igsh=a3Q5Z2t3MGFsdGM0",
    position: "1 ci yer",
    name: "Şeir müsabiqəsi",
    date: "2023-04-05",
    studentId: "04209f24-63e2-44d5-ba75-9ff3aaf0e594",
    description: "Tələbə "
  },
  {
    id: "0tEnb5ztnP0LKNn4k8m9",
    date: "2025-05-23",
    name: "IGDA Azerbaijan GameJam Naxcivan",
    level: "Universitet",
    link: "",
    studentId: "3e383ce4-707e-4b66-ae2e-c396f52016a5",
    description: "",
    position: "1-ci yer"
  },
  {
    id: "KlbbMf7a64B6Wz9zzdH1",
    name: "İngilis Dili ve metodika kafedrasının fakulteler arası intellektual viktorina",
    studentId: "3e383ce4-707e-4b66-ae2e-c396f52016a5",
    level: "Universitet",
    description: "",
    position: "1-ci yer",
    link: "",
    date: "2024-05-28"
  },
  {
    id: "D2BWXNfJO0Qv2RgNFgRD",
    studentId: "4f03fb00-0b20-4b5e-b123-4eacc8686962",
    name: "Xarici Tələbələr Sədri",
    link: "",
    position: ".",
    level: "Universitet",
    date: "2023-09-25",
    description: "Könüllü"
  },
  {
    id: "jCthV9GCIIQnJf8lG6nY",
    date: "2025-02-21",
    position: "Könüllü",
    level: "Regional",
    studentId: "52b273f4-bbdd-40fe-a9f1-205ccc110f38",
    name: "Könüllü - Naxçıvan Muxtar Respublikasının İnsan Hüquqları üzrə Müvəkkili - Ombudsman",
    description: "İnsan hüquqlarının müdafiəsi şöbəsində könüllü",
    link: "https://www.facebook.com/share/p/1DizGRQAjh/?mibextid=wwXIfr"
  },
  {
    id: "weS0qzstnQoiv19oXdHa",
    link: "https://www.instagram.com/p/DJ924IhMZDN/?igsh=N3o0ZHZ3MDNmcXdo",
    position: "Komanda olaraq 1-ci yer, fərdi natiqlik olaraq 2-ci yer",
    description: "“Verdict” komandamız fakültələrarası debat yarışmasında 1-ci yerə layiq görüldü və mən ən yaxşı 2-ci natiq seçildim. ",
    level: "Universitet",
    studentId: "52b273f4-bbdd-40fe-a9f1-205ccc110f38",
    date: "2025-05-22",
    name: "Ən yaxşı 2-ci natiq mükafatı"
  },
  {
    id: "8pw5s77X3eGeDDFACjNx",
    description: "Zəifliklərin aşkarlanması, etik hakerlik\ntədqiqatları və beynəlxalq platformada müstəqil fəaliyyət.",
    name: "CyberSecurity Researcher - HackerOne",
    level: "Beynəlxalq",
    link: "",
    date: "2023-11-24",
    studentId: "58226ea5-90b4-4278-b57f-9cded7ee0384",
    position: "Fəal tədqiqatçı"
  },
  {
    id: "EHZir7JUaPaevIzKuge8",
    position: "Təcrübəçi",
    studentId: "58226ea5-90b4-4278-b57f-9cded7ee0384",
    link: "",
    date: "2023-11-24",
    name: "Penetration Tester Təcrübəçi",
    level: "Beynəlxalq",
    description: "Uzaqdan idarə olunan penetrasiya\ntestləri, zəifliklərin aşkarlanması və təhlükəsizlik hesabatlarının hazırlanması."
  },
  {
    id: "Jr2pgLzVMgWV9mZKnu6A",
    description: "Rəqəmsal idarəetmə proseslərində iştirak, texniki dəstək və rəqəmsal xidmətlərin təşkilində yardım.",
    level: "Regional",
    name: "Könüllü - Dövlət Gömrük Komitəsi",
    link: "",
    date: "2024-11-24",
    studentId: "58226ea5-90b4-4278-b57f-9cded7ee0384",
    position: "Könüllü iştirakçı"
  },
  {
    id: "vjEB8KttB4PeAr0budTh",
    studentId: "58226ea5-90b4-4278-b57f-9cded7ee0384",
    level: "Universitet",
    description: "Kibertəhlükəsizlik və innovasiya mərkəzli texnoloji layihələrin və startap həllərinin qurulması.",
    link: "https://tenagroup.vercel.app/",
    position: "Həmtəsisçi",
    date: "2024-11-24",
    name: "Cybersecurity Expert & Co-Founder - TENA Group"
  },
  {
    id: "0wRUdlk6iCz0tNCOeucS",
    name: "‘Xəmsə’ milli intellektual oyunu məktəb üzrə",
    studentId: "6580b7ce-23b6-4bdc-a169-035501acb3a6",
    level: "Regional",
    description: "",
    date: "2019-05-16",
    position: "1-ci yer",
    link: ""
  },
  {
    id: "suGqEjHRbYFTBkI6NpiW",
    description: "Bakıda keçirilmiş 3-cü Beynəlxalq Azərbaycan Laborator Tibb Konqresi & Lab Expo-da (AZLTK & LAB EXPO 2025) iştirak etmişəm.\n\nTezis göndərərək tələbə təqaüdü qazanmış və bu əsasda 1-2 may tarixində konqresdə ödənişsiz iştirak hüququ əldə etmişəm. Həmiçinin 3 mayda “Blood Culture Course” iştirak etmişəm.\nAzerbaijan journal of laboratory medicine jurnalında tezisim çap olunmuşdur.",
    studentId: "81f7f1b4-0cc8-4ad2-9798-b28dfcbf9d9a",
    level: "Respublika",
    position: "İştirak hüququ",
    name: "Konqres",
    link: "",
    date: "2025-05-01"
  },
  {
    id: "2N2raiLDDdzY9cUFe7HA",
    level: "Universitet",
    name: "\"İntellektual dünya görüşü\" adlı yarış",
    description: "Dünyagörüş haqqında intelektual yarış",
    link: "",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    date: "2025-04-16",
    position: "1-ci yer"
  },
  {
    id: "4t9Ua2eqtXiHNgv9jvSz",
    date: "2025-08-13",
    position: "1-ci yer",
    level: "Universitet",
    description: "İntellektual yarış",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    name: "\"Düşün və Cavabla\" adlı yarış",
    link: ""
  },
  {
    id: "7sqdqsFwtBgSYgZ08lHq",
    position: "1-ci yer",
    date: "2025-07-15",
    description: "Dünyagörüş haqqında yarış",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    name: "\"Cavabla\" adlı yarış",
    link: "",
    level: "Respublika"
  },
  {
    id: "8LhjTVpMIXn5MB8c4n2A",
    position: "2-ci yer",
    date: "2025-05-04",
    description: "Dünyagörüş haqqında intelektual yarış",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    level: "Respublika",
    name: "\"Düşün və Cavabla\" adlı yarış",
    link: ""
  },
  {
    id: "D128v5q2e6jy0ysrb8Yq",
    position: "1-ci yer",
    name: "Ümummilli lider Heydər Əliyevin anadan olmasının 100 illik yubileyi çərçivəsində keçirilən festival",
    description: "",
    link: "",
    level: "Respublika",
    date: "2023-11-13",
    studentId: "90fa85d6-67b2-46dc-b642-6e00f30a6985"
  },
  {
    id: "lXyfNyqfksZqYAAnG0RH",
    date: "2023-03-18",
    link: "",
    name: "2-ci Bakı Elm Olimpiyadasi",
    level: "Respublika",
    studentId: "9fa71ee4-ba46-426a-8ab2-6458383a161d",
    description: "Bu Olimpiyada  H.Əliyevin şərəfinə həsr olunmuşdur burada 3 fənn Kimya,Biologiya və Fizikada ibarət idi.2 mərhələdən ibarət idi birinci mərhələni respublika 3-sü olaeaq tamamladim 2 ci mərhələdə (Final) 2 hissədən ibarət idi  ilk hissə nəzəri 2 ci hissə isə praktiki tur idi",
    position: "Finalçı olmuşdum"
  },
  {
    id: "2pQcN6moU5PDfSMfEaUN",
    studentId: "ad5362f9-b28f-46af-8ba9-faa972c3ba4d",
    link: "",
    level: "Respublika",
    position: "2 ci yer gümüş medal ",
    description: "Bakıda keçirilən tədbir zamanı bir çox hədiyyə təqdim olunub ",
    date: "2025-05-25",
    name: "Respublika fənn olimpiadası"
  },
  {
    id: "11fTYfhZOcqXGgMMYL5B",
    link: "",
    description: "2017-2018-ci illərdə Naxçıvan Qızlar Liseyində təhsildə əldə etdiyim nailiyyətlərə görə təltif olunmuşam.",
    studentId: "b25df151-810d-450a-aea4-8351404de311",
    level: "Universitet",
    date: "2018-06-13",
    name: "“İlin Xanımı” ",
    position: "“İlin Xanımı”"
  },
  {
    id: "Iz8EUQnDRa9eo5l6tpYr",
    studentId: "b25df151-810d-450a-aea4-8351404de311",
    description: "Naxçıvan Qızlar liseyində şagirdlər arasında keçirilən “Vətənini tanı” intellektual oyununda puzzle tipli coğrafi xəritə tapşırıqlarını sürətli analiz və düzgün ardıcıllıqla həll edərək yarışda birinci olmuşam.",
    position: "I yer",
    link: "",
    date: "2022-05-23",
    level: "Universitet",
    name: "“Vətənini tanı” intellektual oyun"
  },
  {
    id: "dJfNJgdI3j8oNMJayyKI",
    level: "Regional",
    studentId: "b25df151-810d-450a-aea4-8351404de311",
    name: "PET Trial Exam",
    description: "Cambridge Authorized Exam Centre & İTAC birgə təşkil etdiyi PET Trial Exam-də iştirak edərək İngilis dili bacarıqlarımı (oxuma, yazma, dinləmə və danışıq) sınaqdan keçirdim ",
    link: "",
    date: "2023-11-24",
    position: "III yer"
  },
  {
    id: "hJ2fh1OKZvuIYuQrwphk",
    description: "TEC və Xarici Dillər Fakültəsinin birgə keçirdiyi “Dil Oyunu Marafonu” adlı interaktiv yarışda fərqli mərhələlər vasitəsilə həm söz ehtiyatı, həm də ünsiyyət bacarıqlarım inkişaf etdi.",
    level: "Universitet",
    position: "II yer",
    name: "“WORDQUEST” İntellektual dil oyun",
    date: "2025-11-15",
    link: "",
    studentId: "b25df151-810d-450a-aea4-8351404de311"
  }
];

export const certificates: Certificate[] = [
  {
    id: "9gEmQDuIPSbjqTATEfUO",
    name: "Elmmetrik bazalara qeydiyyat",
    certificateURL: "https://istedadmerkezi.net/api/senedler/img_2923_1763989433425.jpeg",
    level: "Universitet",
    studentId: "1dc8c46e-89c9-4cfe-9941-b56ac139304a"
  },
  {
    id: "X1xKOFNFJH2d3fzQjY1Z",
    studentId: "1dc8c46e-89c9-4cfe-9941-b56ac139304a",
    level: "Universitet",
    name: "New Professional Horizons: Becoming a Physician in the United States”, organized by the European Medical Students’ Association",
    certificateURL: "https://istedadmerkezi.net/api/senedler/sertifika-ilkin-hajiyev_1763989790705.pdf"
  },
  {
    id: "a9SbHQXv8gH6dCzVEcbn",
    level: "Universitet",
    name: "EMSA Twinning Program between EMSA Nakhchivan and EMSA Bucharest",
    studentId: "1dc8c46e-89c9-4cfe-9941-b56ac139304a",
    certificateURL: "https://istedadmerkezi.net/api/senedler/img_2922_1763989237233.jpeg"
  },
  {
    id: "u6Tv7dT3HdIv0Vcucen0",
    certificateURL: "https://istedadmerkezi.net/api/senedler/img_2921_1763989063697.jpeg",
    level: "Universitet",
    name: "Azerbaijan and Turkey Pediatricians Symposium ",
    studentId: "1dc8c46e-89c9-4cfe-9941-b56ac139304a"
  },
  {
    id: "0hs5h5bioymoaDpyP1vi",
    name: "İDEA Education Center MMC\'nin nəzdində fəaliyyət göstərən GeniusMind Academy\'nin 26.05.2025-ci il tarixində təşkil etdiyi \"Yaşadığımız hekayələrdən aldığımız qorxulara necə qalib gəlməli?\" adlı təlimində iştirak etdiyi üçün təqdim olunur!",
    certificateURL: "",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    level: "Universitet"
  },
  {
    id: "7MSoNnZ3cXY4G5NXU4y6",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    level: "Universitet",
    certificateURL: "",
    name: "13 May “Şəxsiyyətin Təməli : Uşaqda Disiplin, Məsuliyyət və Empatiya \" mövzusu əsasında keçirilən təlimdə iştirakı üçün təltif edilir."
  },
  {
    id: "9ZwJTmHfg6jAMs43Oqdm",
    level: "Universitet",
    certificateURL: "",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    name: "İDEA EDUCATION CENTER MMC-nin nəzdində fəaliyyət göstərən \"Solvita Academy\" tərəfindən təşkil olunan \"Ailədə sağlam ünsiyyətin sirləri \" adlı rəsmi təlimdə fəal iştirakına görə təltif olunur."
  },
  {
    id: "AZmieP1dVM1DMXdIZfVo",
    name: "KDT MMC NƏZDİNDƏ OLAN MASTERMIND ACADEMY TƏRƏFİNDƏN KEÇİRİLƏN \" BAŞQALARININ FİKRİNDƏN AZAD YAŞAMAQ MÜMKÜNDÜRMÜ?\" TƏLİMİNDƏ FƏAL İŞTİRAK ETDİYİNİZ ÜÇÜN TƏŞƏKKÜR EDİRİK.",
    level: "Universitet",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    certificateURL: ""
  },
  {
    id: "CK4Ui0woeO3vcysTw5oa",
    certificateURL: "",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    level: "Universitet",
    name: "28 May\" Amiqdala Effektləri və Zehni Xətalar. Şürurlu Qərarların Açarları\" mövzusu əsasında keçirilən tədbirdə iştirakına görə təltif edilir."
  },
  {
    id: "DCfmae7hIKJNQMFaiI2w",
    name: "ADA \"Adventure Development Academy\" MMC nəzdində fəaliyyət göstərən \"Grand Academy” təşkilatçılığı ilə 15.07.2025-25.07.2025 tarixində keçirilən \"Daxilimdəki mən\" adlı marafonun “Ən yaxşı sən versiyası” təlimində aktiv iştirakına görə verilir.",
    level: "Universitet",
    certificateURL: "",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9"
  },
  {
    id: "DNJ0mrjHbPBjLJC5P66K",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    name: "KDT MMC nəzdində olan \"MASTERMİND ACADEMY\" tərəfindən peşəkarlığı, yaradıcıllığı və daim zövqlə hazırladığı dizaynlarla komandanın inkişafına verdiyi töhfələrə görə TELLİ HƏSƏNOVA təltif olunur.",
    level: "Universitet",
    certificateURL: ""
  },
  {
    id: "ORTSZDPHXFqSlhJvai6x",
    level: "Universitet",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    certificateURL: "",
    name: "İDEA EDUCATION CENTER MMC-nin nəzdində fəaliyyət göstərən SOLVITA ACADEMY-də fəal iştirakına görə təltif olunur."
  },
  {
    id: "OStTkfkLn4vLnjvubjd5",
    certificateURL: "",
    name: "İDEA EDUCATION CENTER MMC-nin nəzdində fəaliyyət göstərən \"Solvita Academy\" tərəfindən təşkil olunan \"Ailədə sağlam ünsiyyətin sirləri \" adlı rəsmi təlimdə fəal iştirakına görə təltif olunur",
    level: "Universitet",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9"
  },
  {
    id: "WRUA9GlAUDnk3qjVGZeb",
    name: "KDT MMC-nin nəzdində fəaliyyət göstərən “MASTERMİND Academy” də göstərdiyi yüksək fəallıq, məsuliyyət və təşəbbüskarlıq nümunəsinə görə təltif olunur.",
    level: "Universitet",
    certificateURL: "",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9"
  },
  {
    id: "Y0WgDpHPZ4H9X6mE4If8",
    name: "İDEA Education Center MMC\'nin nəzdində fəaliyyət göstərən Genius Mind Academy\'nin təlimlərində aktiv iştirak etdiyi üçün təqdim olunur!",
    certificateURL: "",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    level: "Universitet"
  },
  {
    id: "ZWeFq4wjb1YMva9jskF0",
    certificateURL: "",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    name: "Ona görə ki, Netmerge (Diamond Academy) təlim mərkəzinin təşkil etdiyi \"Excel\" təlim proqramını uğurla başa vurmuşdur.",
    level: "Universitet"
  },
  {
    id: "b2niqhdrxotdATICX8kt",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    certificateURL: "",
    level: "Universitet",
    name: "11 İyun 2025-ci il tarixində KDT MMC-nin nəzdində fəaliyyət göstərən \"MASTERMİND Academy\" tərəfindən təşkil olunan \"Mental Arifmetika nədir? \" adlı təlimdə fəal iştirakına görə təltif olunur."
  },
  {
    id: "bbNmcqL7SYS6vEwx9daN",
    certificateURL: "",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    name: "27 May \" Beyin və Zəka Oyunları, Yaddaş Texnikalarının İncəlikləri \" mövzusu əsasında keçirilən təlimdə iştirakına görə təltif edilir.",
    level: "Universitet"
  },
  {
    id: "puZDF5hzUrnLpvRZUZeg",
    certificateURL: "",
    name: "24 May\" Tədris Prosesində Müəllim və Şagird Münasibətində Strategiyalardan Düzgün İstifadə\" mövzusu əsasında keçirilən tədbirdə iştirakına görə təltif edilir.",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    level: "Universitet"
  },
  {
    id: "qSRUP48oloAfEZN8ZYOR",
    name: "İDEA EDUCATION CENTER MMC-nin nəzdində fəaliyyət \"SOLVITA ACADEMY\" tərəfindən təşkil olunan \'En kötü anlarda en iyi dönüşüm\' adlı rəsmi təlimdə fəal iştirakına görə təltif olunur.",
    level: "Universitet",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    certificateURL: ""
  },
  {
    id: "r8VyK1p9aNH166E09DT5",
    name: "17 May \"Qədim Türk Yazılı Abidələrinin dili\" mövzusu əsasında keçirilən təlimdə iştirakı üçün təltif edilir.",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    level: "Universitet",
    certificateURL: ""
  },
  {
    id: "rMg2S1mQxOVgZ6kgTqLm",
    certificateURL: "",
    level: "Universitet",
    name: "23.05.2025 tarixində EL-AZİZ Təlim Mərkəzinə dəstək olduğu ücün təltif olunur.",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9"
  },
  {
    id: "rdM72ozKGB64xoESVzaV",
    name: "26 May 2025-ci il tarixində ADVENTURE DEVELOPMENT ACADEMY MMC-nin nəzdində fəaliyyət göstərən Dəniz Psixologiya Mərkəzi-nin təşkil etdiyi Mükəmməl Olmaq yoxsa Yetərincə Yaxşı Olmaq? adlı təlimin təşkilinə edilən yardım üçün təltif edilir!",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    certificateURL: "",
    level: "Universitet"
  },
  {
    id: "vFgHWGBbAId4orW5X6Xl",
    certificateURL: "",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    level: "Universitet",
    name: "11 İyun 2025-ci il tarixində KDT MMC-nin nəzdində fəaliyyət göstərən “MASTERMIND Academy” tərəfindən təşkil olunan “Mental Arifmetika nədir?\" adlı təlimdə fəal iştirakına görə təltif olunur."
  },
  {
    id: "yEtV15yEqAiyxzXA9Z4Z",
    certificateURL: "",
    level: "Universitet",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    name: "10 May “ Müəllimə Qarşı Davranış Mədəniyyəti \" mövzusu əsasında keçirilən təlimdə iştirakı üçün təltif edilir."
  },
  {
    id: "yphufFuagU7Nfh0PDXNc",
    studentId: "39ff1ae8-ed14-4652-a695-13ec81cd22b9",
    certificateURL: "",
    name: "KDT MMC NƏZDİNDƏ FƏALİYYƏT GÖSTƏRƏN MASTERMIND ACADEMY TƏRƏFİNDƏN 08.07.2025. KEÇİRİLƏN\"0-DAN,1-Ə QƏDƏR PROQRAMLAŞDIRMA(İT)\" TƏLİMİNDƏ FƏAL İŞTİRAKINIZA GÖRƏ TƏŞƏKKÜR EDİRİK!",
    level: "Universitet"
  },
  {
    id: "1K6owYAxHIOfHJuBHqBR",
    level: "Respublika",
    certificateURL: "",
    name: "Məktəbəqədər təhsildə uşaq fəaliyyətinin təşkili və planlaşdırması",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69"
  },
  {
    id: "3spgc7r1UaAb2mho01Ft",
    certificateURL: "",
    level: "Universitet",
    name: "English Learning Methods",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69"
  },
  {
    id: "5NigG7d9XhZj4gAbKZ8j",
    certificateURL: "",
    name: "Effektiv qərarvermə bacarığının formalaşması",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    level: "Universitet"
  },
  {
    id: "8VHCgOS8i2iMtJDCUL7m",
    level: "Universitet",
    name: "Beynəlxalq Proqramlı Yazıçılıq kursu",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    certificateURL: ""
  },
  {
    id: "8tMlAzFUwJruL73BY4Dy",
    level: "Universitet",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    name: "Şüuraltı zəifləmədə doğru bilinən səhvlər",
    certificateURL: ""
  },
  {
    id: "B14gAOqlr7MFXhQOnUSt",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    name: "Dərsə hazırlıq və idarəetmə",
    certificateURL: "",
    level: "Universitet"
  },
  {
    id: "DfoD9mCjxKeOa7uV9Fpq",
    level: "Universitet",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    name: "Uşaq ədəbiyyatı - Bu günün tələbi",
    certificateURL: ""
  },
  {
    id: "HweBGyiwtK3PsD4QsL0w",
    level: "Respublika",
    name: "Beynəlxalq Proqramlı Yazıçılıq kursu",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    certificateURL: ""
  },
  {
    id: "IdHbgaqN3mofsb4qoGR0",
    name: "İdeal nitq ",
    certificateURL: "",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    level: "Universitet"
  },
  {
    id: "IoCRop3RsFPs7Smvi7Y0",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    certificateURL: "",
    name: "Uşaqlarda emosional zəka və hisslərin idarə olunması ",
    level: "Universitet"
  },
  {
    id: "LxTIhHYkMo7FEuHUWQVg",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    name: "KİNG Education Company Məhdud məsuliyyətli cəmiyyəti",
    level: "Universitet",
    certificateURL: ""
  },
  {
    id: "MYkHFKrwvX78gSilIAhq",
    level: "Universitet",
    name: "Burnout :Tükənmişlik sindiromu və mübarizə strategiyaları",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    certificateURL: ""
  },
  {
    id: "OGKdPhxlzcE6qmlbsG8K",
    name: "Atalar sözləri və Zərb məsəllərin poetik dili",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    level: "Universitet",
    certificateURL: ""
  },
  {
    id: "RpmLV2Qj0jAWzAwjCYbB",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    certificateURL: "",
    level: "Universitet",
    name: "Dövlət vergisi və sahibkarlıq"
  },
  {
    id: "TAc1NMA2bLNBJ6t61pi4",
    name: "Exsel təlim proqramı",
    certificateURL: "",
    level: "Universitet",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69"
  },
  {
    id: "VpLcmdOA56OQGXxHvDP3",
    certificateURL: "",
    level: "Universitet",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    name: "KİNG EDUCATİON COMPANY MMC KÖNÜLLÜ "
  },
  {
    id: "WAWloKoim2Zab1b3yvhz",
    name: "Müəllim Missiyası və Milli Dəyərlər",
    level: "Universitet",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    certificateURL: ""
  },
  {
    id: "bwIH72nX5eexHnad17RD",
    certificateURL: "",
    level: "Universitet",
    name: "Milli kimliyin səsi və sözü :Bəxtiyar Vahabzadə poeziyası ilə Hacıbəyov musiqisinin kəsişməsi",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69"
  },
  {
    id: "ci85syNyz2A9Z0TLnmJg",
    name: "Kitab oxumaq mütaliə etmək bilik və dünyagörüşün inkişafı",
    level: "Universitet",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    certificateURL: ""
  },
  {
    id: "hHBfTS0ykhNyRvGv7XD3",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    level: "Universitet",
    certificateURL: "",
    name: "Zəfər gününün mənəvi dəyəri və tarixi əhəmiyyəti"
  },
  {
    id: "i9iPdjqr35kxE3dysjEV",
    level: "Universitet",
    certificateURL: "",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    name: "“Mən kiməm? ” və nə istədiyimi necə biləcəyəm?"
  },
  {
    id: "iTbfQJio34m67tFwjPK4",
    certificateURL: "",
    name: "Yazmaq sənəti :Qızıl düsturlar",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    level: "Universitet"
  },
  {
    id: "offIyexkSWQWDnxgJdDt",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    level: "Universitet",
    certificateURL: "",
    name: "Effektiv nitq"
  },
  {
    id: "pyMjarO15ea47IVmnFIW",
    name: "“Mən kiməm? ” və nə istədiyimi necə biləcəyəm?",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    level: "Universitet",
    certificateURL: ""
  },
  {
    id: "pyovoetJVfsndTL6YNF8",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69",
    level: "Universitet",
    certificateURL: "",
    name: "Karyerada ingilis dilinin rolu"
  },
  {
    id: "rr2MxKccI6gHgEBgslsE",
    name: "Azərbaycan dili və ədəbiyyatın həyatımızdakı rolu ",
    certificateURL: "",
    level: "Respublika",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69"
  },
  {
    id: "wSZwy77Lqnw9qOAANyfB",
    certificateURL: "",
    level: "Universitet",
    name: "Mederatorluq",
    studentId: "4e2ed7eb-4746-4ee8-8460-eb8d11b09c69"
  },
  {
    id: "1TW1zNXKzc8DcT6kmmbm",
    level: "Beynəlxalq",
    certificateURL: "",
    studentId: "58226ea5-90b4-4278-b57f-9cded7ee0384",
    name: "CCNAv7: Enterprise Networking, Security, and Automation"
  },
  {
    id: "CTC5nUhuOZ6nyaCZgd3A",
    certificateURL: "",
    studentId: "58226ea5-90b4-4278-b57f-9cded7ee0384",
    level: "Beynəlxalq",
    name: "CYBER THREAT INTELLIGENCE 101"
  },
  {
    id: "HEYlXFA8t3riadN1UIbb",
    level: "Beynəlxalq",
    studentId: "58226ea5-90b4-4278-b57f-9cded7ee0384",
    name: "Cisco Siber Güvenliğe Giriş",
    certificateURL: ""
  },
  {
    id: "L3rciFdX8FyAGxSA0PXb",
    name: "Cisco IT Essentials",
    studentId: "58226ea5-90b4-4278-b57f-9cded7ee0384",
    level: "Beynəlxalq",
    certificateURL: ""
  },
  {
    id: "L9OGTZJznOVhd6kLyyQY",
    level: "Beynəlxalq",
    name: "CCNAv7: Introduction to Networks",
    studentId: "58226ea5-90b4-4278-b57f-9cded7ee0384",
    certificateURL: ""
  },
  {
    id: "aFDiplRxQKsCZ1NR23hx",
    name: "NDG Linux Unhatched",
    studentId: "58226ea5-90b4-4278-b57f-9cded7ee0384",
    level: "Beynəlxalq",
    certificateURL: ""
  },
  {
    id: "g2wuyCOoaxsWYCXoGyUF",
    studentId: "58226ea5-90b4-4278-b57f-9cded7ee0384",
    certificateURL: "",
    name: "CCNAv7: Switching, Routing, and Wireless Essentials",
    level: "Beynəlxalq"
  },
  {
    id: "uDTDKyrhwbB8vdZadNz2",
    name: "Cisco Ethical Hacker",
    certificateURL: "",
    level: "Beynəlxalq",
    studentId: "58226ea5-90b4-4278-b57f-9cded7ee0384"
  },
  {
    id: "TVFKOQMTo0UjuKJ1Db29",
    level: "Universitet",
    certificateURL: "",
    studentId: "582820c1-4734-42a5-81b7-2a3de2ddd158",
    name: "salam"
  },
  {
    id: "Fn7USQbiJsrDAyMLwhwJ",
    name: "IDEA Education Center MMC",
    studentId: "6580b7ce-23b6-4bdc-a169-035501acb3a6",
    level: "Universitet",
    certificateURL: ""
  },
  {
    id: "JQ9VvPgUDZc9BvWZDtyp",
    level: "Respublika",
    studentId: "6580b7ce-23b6-4bdc-a169-035501acb3a6",
    name: "Təkamül Akademiya MMC",
    certificateURL: ""
  },
  {
    id: "MXnpiSvGKsTV81dkpj7R",
    studentId: "6580b7ce-23b6-4bdc-a169-035501acb3a6",
    level: "Universitet",
    name: "Effective methods for learning a foreign language",
    certificateURL: ""
  },
  {
    id: "Q1YNCrzvm6vBfQWF3Xd3",
    name: "Tələbə Elm Cəmiyyəti konfransı",
    studentId: "6580b7ce-23b6-4bdc-a169-035501acb3a6",
    level: "Regional",
    certificateURL: ""
  },
  {
    id: "4Mt9corzeAmUkctYn32o",
    certificateURL: "",
    name: "Mental Well-being 101: Tibb tələbələri üçün Psixi sağlamlıq",
    studentId: "81f7f1b4-0cc8-4ad2-9798-b28dfcbf9d9a",
    level: "Universitet"
  },
  {
    id: "JYQ1raB8AQJHGM6BvOXw",
    studentId: "81f7f1b4-0cc8-4ad2-9798-b28dfcbf9d9a",
    level: "Universitet",
    certificateURL: "",
    name: "Elmmetrik bazalara qeydiyyat"
  },
  {
    id: "MQCB9wTGiCbKfVvzjqBN",
    certificateURL: "",
    studentId: "81f7f1b4-0cc8-4ad2-9798-b28dfcbf9d9a",
    level: "Respublika",
    name: "3rd İnternational Azerbaijan Laboratory Medicine Congress &Lab Expo “Blood Culture Course”"
  },
  {
    id: "NI1rnEUerTT9NuttZdBi",
    certificateURL: "",
    studentId: "81f7f1b4-0cc8-4ad2-9798-b28dfcbf9d9a",
    level: "Universitet",
    name: "Nevropsixoloji farmakologiyada yeni müalicə üsulları"
  },
  {
    id: "moxOSXaZyNb06jjfHjD3",
    name: "New professional horizons: Becoming a Physician in the United States ",
    level: "Universitet",
    certificateURL: "",
    studentId: "81f7f1b4-0cc8-4ad2-9798-b28dfcbf9d9a"
  },
  {
    id: "FsXmv2tCgyuWxIiAaiRW",
    certificateURL: "",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    name: "Azərbaycan dili və Ədəbiyyatın həyatımızda rolu",
    level: "Universitet"
  },
  {
    id: "G8FWWSQXuBjw7q7rfJGL",
    certificateURL: "",
    level: "Respublika",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    name: "Danışan zehin: Düşüncə Tərzimizin Nitqə Təsiri"
  },
  {
    id: "GY0qhdo0wm4aiVz5PKjp",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    level: "Universitet",
    name: "Səlis Nitqin Resepti",
    certificateURL: ""
  },
  {
    id: "KWfDe6CpDtRJTzfG9jMf",
    level: "Respublika",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    certificateURL: "",
    name: "\"Elmi İnkişaf: Uğurlar və Çağırışlar\" Gənc Tədqiqatçıların II Respublika Elmi Konfransı"
  },
  {
    id: "Pn42hEWIu7dsM8kaPJnx",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    name: "Milli Kimliyin Səsi və Sözü: Vahabzadə Poeziyası ilə Hacıbəyov Musiqisinin Kəsişməsi",
    level: "Beynəlxalq",
    certificateURL: ""
  },
  {
    id: "hYMsKUPE1F9w9p8FmTI0",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    name: "Ünsiyyətdə Uğurun Sirləri: Nitq və ifadə Bacarıqları",
    certificateURL: "",
    level: "Universitet"
  },
  {
    id: "hu8i01SEQE2dIUaP29Nm",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    name: "NAXÇIVAN MUXTAR RESPUBLİKASINDA QIZLARIN DAVAMLI İNKİŞAFI və iQLiM SAVADLILIĞI: GƏLƏCƏK NƏSiL ÜÇÜN BACARIQLARIN İNKiŞAFI",
    certificateURL: "",
    level: "Universitet"
  },
  {
    id: "kkav8DoDz2k9eZw7xX9e",
    certificateURL: "",
    level: "Universitet",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    name: "Poeziyanın Bəxtiyar zirvəsi"
  },
  {
    id: "nxumyyuXChxkffMapaim",
    level: "Beynəlxalq",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    name: "Atalar Sözləri və Zərb Məsələlərin Poetik Dili",
    certificateURL: ""
  },
  {
    id: "qMK1jJRKCYO1PjAFAhp1",
    name: "7st INTERNATIONAL TRAKYA SCIENTIFIC RESEARCH CONGRESS",
    level: "Universitet",
    studentId: "8c271b08-dc19-4b30-a00d-f67d65cece7b",
    certificateURL: ""
  },
  {
    id: "AnFIWIyHcePk3WBy7B1O",
    studentId: "b25df151-810d-450a-aea4-8351404de311",
    level: "Universitet",
    name: "“Elevate 101: Project Managment Forum”",
    certificateURL: ""
  }
];

export const studentOrgUpdates: StudentOrgUpdate[] = [];

export const news: News[] = [
  {
    id: "dfd1cda5-b3e8-44de-b81b-b1760648b73a",
    createdAt: "2025-11-24T12:31:27.631Z",
    content: "<article>\n  <h2>Naxçıvan Dövlət Universitetinin tələbələri üçün yeni rəqəmsal platforma istifadəyə verildi</h2>\n\n  <p>\n    Naxçıvan Dövlət Universitetinin tələbələri üçün hazırlanan\n    <strong>İstedadMərkəzi.net</strong> platforması rəsmi olaraq istifadəyə verilib.\n    Platforma tələbələrin akademik və şəxsi inkişaf göstəricilərini bir sistemdə\n    cəmləşdirərək daha şəffaf və funksional mühit yaradır.\n  </p>\n\n  <p>Yeni platforma tələbələrə aşağıdakı imkanları təqdim edir:</p>\n\n  <ul>\n    <li>\n      <strong>Profil sistemi</strong> — tələbənin bütün məlumatları vahid paneldə;\n    </li>\n    <li>\n      <strong>Sertifikat və layihə bölməsi</strong> — tələbələrin nailiyyətlərinin\n      rəqəmsal portfel şəklində saxlanması;\n    </li>\n    <li>\n      <strong>İstedad Puanı (AI əsaslı)</strong> — tələbənin aktivliyinə və\n      göstəricilərinə görə formalaşan yenilikçi bal sistemi;\n    </li>\n    <li>\n      <strong>Tələbə təşkilatlarının seçim və idarəetmə modulu</strong> — TEC, TGT,\n      THİK və digər qurumların tələbələrlə daha çevik işləməsi;\n    </li>\n    <li>\n      <strong>Rəhbərlik üçün analitika paneli</strong> — tələbələrin fəaliyyətinin\n      izlənməsi və qiymətləndirilməsi.\n    </li>\n  </ul>\n\n  <p>\n    Platforma üzərində hazırda <strong>Yapay Zəka modulu</strong> inteqrasiya edilir və\n    bu modul tələbələrin təqdim etdiyi məlumatları ümumi inkişaf meyarlarına uyğun\n    şəkildə analiz edəcək. Bu səbəbdən bəzi bölmələr mərhələli şəkildə yenilənir.\n  </p>\n\n  <p>\n    <strong>İstedadMərkəzi.net</strong> yaxın günlərdə universitetin bütün tələbə\n    təşkilatları ilə inteqrasiya olunaraq tam funksional fəaliyyətə başlayacaq.\n  </p>\n</article>\n",
    slug: "istedadmrkzinet-ndu-tlblri-ucun-yeni-rqmsal-platforma-istifady-verildi",
    coverImageUrl: "https://istedadmerkezi.net/banner.jpg",
    title: "İstedadMərkəzi.net — NDU tələbələri üçün yeni rəqəmsal platforma istifadəyə verildi",
    authorId: "admin_user",
    authorName: "Hüseyn Tahirov"
  }
];

export const allUsers: AppUser[] = [
    adminUser,
    ...students,
    ...studentOrganizations
];
