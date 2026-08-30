import { DocumentItem, StudyTopic, UpcomingEvent, UserProfile, QuizQuestion } from '../types';

export const INITIAL_USER: UserProfile = {
  username: 'Alex Rivera',
  email: 'alex.rivera@university.edu',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWX2I2_GG_mnV_jS9H9vqPoM-te7PrsVBZl8kICdZycCdVBcaNkZSDPGTeuMuUyUX9G3Ke29rFwdNShSy_CnAR2yjfQkAKlcEXR7QZzp5Azh6NI3pGjqt1psPmEWwDtrtlk8tL9vRgLx2God9xTUKftgmkAymXlxF7c6fXX-iDZ8ZumKtRW_wiIwuE_ISyBL3Ajxc2QM3MKd-VQstOZWArudQ9MoWWcilHL76S3fxjgcZu0Vp9P-Sb',
  isLoggedIn: true,
};

export const USER_STUDENT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdnXOaoLArzJl6BLUYYTkR-Dy_5x4s9VcJBPiH4u-DhZGfQItb2dbi3nCqXg-oZfS459F8qtOl0AT5vbyeJMDal8I4kBfrt3BFlLnmcaMAlxuCvE7RUUpq4bHzpMqRYjtwQ0lzZTEB5gUhGTD7WWSl6wI1K8axlnS0-A1zYxcZSwgFq3QTe93J5at2XRQF6lzZTp-HJMky6f0Q7qe-nBGQcWos415NPuI7inn1y3LbLSoY3bnW33jg';

export const ROBOT_AI_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyUUHJ5aOycd-IPBG3quBUcMU52s5TYqvESqdJv6qxemuMEQkGe379x7kA2sxPiHR-Dq5MQcO9MvR-snehE0EraIDpF3wFSoWdGCTf40KhSfUBVGwhgjWk2qDwt1zdsgFPT9lSKYfwMfF_56w5dNfkU6o-FkH5SiWbL5_LzQMJcneYrIyth3lG90LlHnYrAVxPdVY6xY2ANrR8-XMKFbFWjYRUs9vO4V3QeHMBQ6e-nc-7Kkk0P8cB';

export const LOGIN_BG_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLTit9PFRZu8uw57u4wDMQVHbLAVa0W2I6tw1J2ChNngoZhz_F1Jxd4DmkyMXDzjKK-v4jjbBgH3Dm9BEdh5aMZt7ctbGSNIjUlU5SiwtYCVXEpaOh8YnkadXME6DFncVxXwlbhTGOpwsWZ-LFBYwodg2JnL4v_l_AqOVGTibsnSQWdfJ50gJLliey2_P74j8OVSoPvrtCPadJwWDgwFQRlTIv1Pl3wkHhWKQ3kWjR3GXAptg9oNUVReeQ4zPQq6LqZg';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-algo',
    title: 'Introduction to Algorithms',
    fileType: 'PDF',
    timeAgo: '2 days ago',
    status: 'processed',
    pages: 38,
    parsedAtText: 'Parsed 2 days ago',
    topics: ['Dijkstra', 'Graph Search', 'Dynamic Programming', 'Greedy Algorithms', 'Complexity'],
    summary: 'Core principles of algorithmic design and asymptotic analysis, covering graph algorithms, shortest path heuristics, and optimization strategies.',
    iconType: 'description',
    chunks: [
      {
        id: 'c1',
        page: 4,
        chunk: 1,
        text: "Asymptotic notation provides a mathematical framework for categorizing algorithm efficiency as input size approaches infinity (Big-O, Omega, Theta)."
      },
      {
        id: 'c2',
        page: 18,
        chunk: 2,
        text: "Dijkstra's algorithm solves the single-source shortest path problem on weighted graphs with non-negative edge weights using a priority queue in O((V + E) log V) time."
      }
    ]
  },
  {
    id: 'doc-micro',
    title: 'Microeconomics Notes - Midterm Review',
    fileType: 'DOCX',
    timeAgo: 'Just now',
    status: 'processing',
    pages: 22,
    parsedAtText: 'Parsing document structures...',
    topics: ['Supply & Demand', 'Elasticity', 'Consumer Surplus', 'Deadweight Loss', 'Monopoly'],
    summary: 'Comprehensive notes reviewing supply and demand equilibrium, price elasticity of demand, taxation effects, and competitive market structures.',
    iconType: 'menu_book',
    progress: 78,
    chunks: [
      {
        id: 'm1',
        page: 3,
        chunk: 1,
        text: 'Price elasticity of demand measures responsiveness of quantity demanded to changes in price: %ΔQ / %ΔP.'
      }
    ]
  },
  {
    id: 'doc-history',
    title: 'History 101 - Lecture 4 Transcript',
    fileType: 'TXT',
    timeAgo: '1 week ago',
    status: 'processed',
    pages: 15,
    parsedAtText: 'Parsed 1 week ago',
    topics: ['Industrial Revolution', 'Urban Migration', 'Labor Movements', 'Technological Shifts'],
    summary: 'Transcript covering the social, economic, and political transformations following the steam engine breakthrough in 19th century Europe.',
    iconType: 'article',
    chunks: [
      {
        id: 'h1',
        page: 2,
        chunk: 1,
        text: 'The transition from agrarian economies to mechanized manufacturing led to unprecedented urban migration.'
      }
    ]
  },
  {
    id: 'doc-ds',
    title: 'Data Structures 101',
    fileType: 'PDF',
    timeAgo: '2 hours ago',
    status: 'processed',
    pages: 45,
    parsedAtText: 'Parsed 2 hours ago',
    topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Big O'],
    summary: 'A comprehensive overview of fundamental data structures in computer science, focusing on implementation details, time complexity, and practical applications in algorithm design.',
    iconType: 'description',
    chunks: [
      {
        id: 'ds1',
        page: 12,
        chunk: 3,
        text: 'Arrays allocate a single contiguous block of memory indexed by offset O(1), while Linked Lists allocate nodes dynamically across arbitrary memory locations connected by memory pointers.'
      },
      {
        id: 'ds2',
        page: 24,
        chunk: 1,
        text: 'Binary Search Trees provide average O(log n) lookup, insertion, and deletion provided the tree remains balanced (e.g. via AVL or Red-Black rotations).'
      }
    ]
  }
];

export const INITIAL_STUDY_TOPICS: StudyTopic[] = [
  {
    id: 'topic-recursion',
    priority: 1,
    title: 'Recursion',
    subtitle: 'Critical gap detected in recent quizzes.',
    mastery: 25,
    colorCategory: 'error',
    statusIcon: 'warning',
    aiRecommendation: 'Review chapter 4 and complete a targeted quiz to improve your score on base cases.',
    documentSource: 'Data Structures 101',
    chapter: 'Chapter 4: Recursive Invariants'
  },
  {
    id: 'topic-linked-lists',
    priority: 2,
    title: 'Linked Lists',
    subtitle: 'Needs reinforcement on pointer manipulation.',
    mastery: 60,
    colorCategory: 'warning',
    statusIcon: 'lightbulb',
    aiRecommendation: 'Practice reversing a linked list. Focus on edge cases like empty lists.',
    documentSource: 'Data Structures 101',
    chapter: 'Chapter 2: Singly & Doubly Linked Lists'
  },
  {
    id: 'topic-binary-trees',
    priority: 3,
    title: 'Binary Trees',
    subtitle: 'Solid foundation, ready for advanced concepts.',
    mastery: 85,
    colorCategory: 'success',
    statusIcon: 'check_circle',
    aiRecommendation: 'Attempt the advanced problem set on tree balancing algorithms.',
    documentSource: 'Data Structures 101',
    chapter: 'Chapter 6: Self-Balancing Binary Trees'
  }
];

export const INITIAL_UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: 'ev-1',
    month: 'Oct',
    day: '12',
    title: 'Data Structures Midterm',
    inDays: 'In 3 days',
    type: 'exam'
  },
  {
    id: 'ev-2',
    month: 'Oct',
    day: '18',
    title: 'Algorithm Quiz 4',
    inDays: 'In 9 days',
    type: 'quiz'
  }
];

export const SAMPLE_QUIZZES: Record<string, QuizQuestion[]> = {
  'Data Structures 101': [
    {
      id: 'q1',
      question: 'What is the primary memory difference between an Array and a Linked List?',
      options: [
        'Arrays require contiguous memory blocks, while Linked Lists store elements in non-contiguous memory connected via pointers.',
        'Linked Lists allocate fixed contiguous memory during compilation time.',
        'Arrays only support string data types in low-level memory.',
        'There is no difference; modern OS virtual memory manages both identically.'
      ],
      correctIndex: 0,
      explanation: 'Arrays must occupy a continuous physical address space, while linked list nodes can reside anywhere in heap memory and refer to each other using pointers.',
      source: 'Page 12, Chunk 3'
    },
    {
      id: 'q2',
      question: 'What is the worst-case time complexity for searching an element in an unbalanced Binary Search Tree (BST)?',
      options: [
        'O(1)',
        'O(log n)',
        'O(n)',
        'O(n log n)'
      ],
      correctIndex: 2,
      explanation: 'In the worst case (e.g., when elements are inserted in sorted order), a BST degenerates into a linear linked list with O(n) search time.',
      source: 'Page 28, Chunk 1'
    },
    {
      id: 'q3',
      question: 'In recursion, what critical component prevents infinite call stack overflows?',
      options: [
        'A global garbage collector',
        'A base case condition that terminates further recursive invocations',
        'A while loop wrapping the recursive call',
        'Dynamic pointer casting'
      ],
      correctIndex: 1,
      explanation: 'A base case defines the condition under which the function returns without making further recursive calls, unwinding the call stack.',
      source: 'Page 16, Chunk 4'
    }
  ],
  'Recursion': [
    {
      id: 'rq1',
      question: 'What happens if a recursive function lacks a valid base case?',
      options: [
        'It returns 0 by default',
        'The call stack exceeds maximum limit causing a Stack Overflow error',
        'It automatically compiles as an iterative loop',
        'The CPU enters sleep mode'
      ],
      correctIndex: 1,
      explanation: 'Every recursive call places a new activation frame onto the call stack. Without a terminating base case, memory runs out.',
      source: 'Data Structures 101 - Chapter 4'
    },
    {
      id: 'rq2',
      question: 'What is "Tail Recursion" optimization?',
      options: [
        'When the recursive call is the very last operation performed before returning, allowing stack frame reuse.',
        'When recursion executes backwards from the end of an array.',
        'A technique that only works for trees.',
        'Removing recursion using an auxiliary stack.'
      ],
      correctIndex: 0,
      explanation: 'With tail recursion, the compiler can optimize the call into a jump/loop without allocating additional stack frames.',
      source: 'Data Structures 101 - Chapter 4'
    }
  ]
};
