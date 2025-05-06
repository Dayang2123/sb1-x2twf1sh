export interface Content {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'failed';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  publishedPlatforms?: string[];
  sections?: ContentSection[];
  images?: ContentImage[];
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
}

export interface ContentImage {
  id: string;
  alt: string;
  url: string;
  sectionId?: string;
}

export interface PlatformAccount {
  id: string;
  platformName: string;
  username: string;
  isConnected: boolean;
  avatarUrl: string;
}

interface MockData {
  contents: Content[];
  platformAccounts: PlatformAccount[];
}

export const mockData: MockData = {
  contents: [
    {
      id: '1',
      title: '10 Effective Ways to Improve Productivity',
      content: '# Introduction\n\nProductivity is essential in today\'s fast-paced world. This article explores effective strategies to enhance your productivity and achieve more in less time.\n\n## Time Management\n\nEffective time management is the cornerstone of productivity. Try techniques like the Pomodoro method or time blocking to organize your day efficiently.\n\n## Eliminate Distractions\n\nMinimize interruptions by turning off notifications and creating a dedicated workspace.\n\n## Prioritize Tasks\n\nFocus on high-impact activities first using methods like the Eisenhower Matrix.',
      status: 'published',
      createdAt: '2023-11-15T10:30:00Z',
      updatedAt: '2023-11-16T14:20:00Z',
      publishedAt: '2023-11-16T15:00:00Z',
      publishedPlatforms: ['Medium', 'WordPress'],
      sections: [
        { id: 's1', title: 'Introduction', content: 'Productivity is essential in today\'s fast-paced world.' },
        { id: 's2', title: 'Time Management', content: 'Effective time management is the cornerstone of productivity.' },
        { id: 's3', title: 'Eliminate Distractions', content: 'Minimize interruptions by turning off notifications and creating a dedicated workspace.' },
        { id: 's4', title: 'Prioritize Tasks', content: 'Focus on high-impact activities first using methods like the Eisenhower Matrix.' }
      ],
      images: [
        { id: 'img1', alt: 'Productivity desk setup', url: 'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg' },
        { id: 'img2', alt: 'Time management', url: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg' }
      ]
    },
    {
      id: '2',
      title: 'The Future of Artificial Intelligence',
      content: 'Artificial Intelligence is revolutionizing various sectors, from healthcare to transportation. This article explores the current state and future prospects of AI technology.',
      status: 'draft',
      createdAt: '2023-11-18T09:15:00Z',
      updatedAt: '2023-11-19T11:40:00Z',
      sections: [
        { id: 's1', title: 'Current AI Landscape', content: 'An overview of today\'s AI capabilities and implementations.' },
        { id: 's2', title: 'AI in Healthcare', content: 'How AI is transforming diagnosis, treatment, and patient care.' },
        { id: 's3', title: 'Ethical Considerations', content: 'Addressing the moral implications of advanced AI systems.' }
      ],
      images: [
        { id: 'img1', alt: 'AI concept illustration', url: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg' }
      ]
    },
    {
      id: '3',
      title: 'Sustainable Living: Small Changes, Big Impact',
      content: 'Learn how minor adjustments to daily habits can contribute significantly to environmental conservation.',
      status: 'draft',
      createdAt: '2023-11-20T13:45:00Z',
      updatedAt: '2023-11-20T16:30:00Z'
    }
  ],
  platformAccounts: [
    {
      id: 'p1',
      platformName: 'Medium',
      username: 'contentcreator',
      isConnected: true,
      avatarUrl: 'https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg'
    },
    {
      id: 'p2',
      platformName: 'WordPress',
      username: 'creator_blog',
      isConnected: true,
      avatarUrl: 'https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg'
    },
    {
      id: 'p3',
      platformName: 'LinkedIn',
      username: 'professional_writer',
      isConnected: false,
      avatarUrl: 'https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg'
    },
    {
      id: 'p4',
      platformName: 'Twitter',
      username: '@content_writer',
      isConnected: false,
      avatarUrl: 'https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg'
    }
  ]
};

// Helper function to generate a new unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Create a new empty content item
export const createNewContent = (): Content => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: 'Untitled Content',
    content: '',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    sections: [],
    images: []
  };
};