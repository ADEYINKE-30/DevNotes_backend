import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';
import Tutorial from '../models/Tutorial.js';
import Lesson from '../models/Lesson.js';

dotenv.config();

const tutorials = [
  {
    title: 'Getting Started with React',
    slug: 'getting-started-with-react',
    description:
      'Learn the fundamentals of React including components, props, state, and hooks. Build your first React application step by step.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    category: 'React',
    tags: ['React', 'JavaScript', 'Frontend', 'Beginner'],
    difficulty: 'Beginner' as const,
    duration: '2 hours 30 minutes',
    instructor: 'Sarah Johnson',
    published: true,
    featured: true,
    publishedAt: new Date(),
    lessons: [
      {
        title: 'What is React?',
        description:
          'Introduction to React, its benefits, and why it is popular for building modern web applications.',
        videoUrl: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
        duration: '12:30',
        order: 1,
        content:
          'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and manage application state efficiently.',
        resources: [
          {
            title: 'React Official Documentation',
            url: 'https://react.dev'
          }
        ]
      },
      {
        title: 'Setting Up React',
        description: 'Learn how to set up a React development environment using Vite.',
        videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
        duration: '15:45',
        order: 2,
        content:
          'We will use Vite to create a modern React application with fast refresh and optimized build.',
        resources: [
          {
            title: 'Vite Documentation',
            url: 'https://vitejs.dev'
          }
        ]
      },
      {
        title: 'JSX Fundamentals',
        description: 'Understanding JSX syntax and how to write React components.',
        videoUrl: 'https://www.youtube.com/watch?v=yKV1IGahXqA',
        duration: '18:20',
        order: 3,
        content:
          'JSX is a syntax extension for JavaScript that looks similar to HTML and makes it easier to write React components.'
      },
      {
        title: 'Components and Props',
        description: 'Learn about React components and how to pass data using props.',
        videoUrl: 'https://www.youtube.com/watch?v=m7OWXtbiXX8',
        duration: '22:15',
        order: 4,
        content:
          'Components are the building blocks of React applications. Props allow you to pass data from parent to child components.'
      },
      {
        title: 'State and Hooks',
        description: 'Introduction to React state and the useState hook.',
        videoUrl: 'https://www.youtube.com/watch?v=-MlNBTSg_Ww',
        duration: '25:40',
        order: 5,
        content:
          'State allows components to have dynamic data. The useState hook is the most common way to add state to functional components.'
      },
      {
        title: 'Building a Small React App',
        description: 'Put everything together by building a complete React application.',
        videoUrl: 'https://www.youtube.com/watch?v=b9eMGE7QtTk',
        duration: '35:00',
        order: 6,
        content:
          'We will build a task management app that demonstrates components, props, state, and event handling.',
        resources: [
          {
            title: 'Project Repository',
            url: 'https://github.com/example/react-task-app'
          }
        ]
      }
    ]
  },
  {
    title: 'TypeScript for Beginners',
    slug: 'typescript-for-beginners',
    description:
      'Master TypeScript fundamentals including types, interfaces, generics, and how to use TypeScript with React.',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    category: 'TypeScript',
    tags: ['TypeScript', 'JavaScript', 'Programming', 'Beginner'],
    difficulty: 'Beginner' as const,
    duration: '3 hours',
    instructor: 'Michael Chen',
    published: true,
    featured: true,
    publishedAt: new Date(),
    lessons: [
      {
        title: 'Introduction to TypeScript',
        description: 'What is TypeScript and why should you use it?',
        videoUrl: 'https://www.youtube.com/watch?v=d56mG7DezGs',
        duration: '14:20',
        order: 1,
        content:
          'TypeScript is a superset of JavaScript that adds static typing, making your code more reliable and easier to maintain.',
        resources: [
          {
            title: 'TypeScript Official Documentation',
            url: 'https://www.typescriptlang.org/docs/'
          }
        ]
      },
      {
        title: 'Basic Types',
        description: 'Learn about primitive types, arrays, tuples, and enums.',
        videoUrl: 'https://www.youtube.com/watch?v=ahCwqrYpIuM',
        duration: '20:15',
        order: 2,
        content:
          'TypeScript provides several basic types including string, number, boolean, array, tuple, and enum.'
      },
      {
        title: 'Interfaces',
        description: 'How to define object shapes using interfaces.',
        videoUrl: 'https://www.youtube.com/watch?v=VbW6vWTaHOY',
        duration: '22:30',
        order: 3,
        content:
          'Interfaces define the structure of objects and can be used to enforce type contracts in your code.'
      },
      {
        title: 'Functions',
        description: 'Typing functions, parameters, and return values.',
        videoUrl: 'https://www.youtube.com/watch?v=xkEkUhK-j8E',
        duration: '18:45',
        order: 4,
        content:
          'Learn how to add types to function parameters and return values for better type safety.'
      },
      {
        title: 'Generics',
        description: 'Understanding and using TypeScript generics.',
        videoUrl: 'https://www.youtube.com/watch?v=nePDL5lQSE4',
        duration: '25:10',
        order: 5,
        content:
          'Generics allow you to create reusable components that work with multiple types while maintaining type safety.'
      },
      {
        title: 'TypeScript with React',
        description: 'Using TypeScript in React applications.',
        videoUrl: 'https://www.youtube.com/watch?v=ydkQlJhodio',
        duration: '30:00',
        order: 6,
        content:
          'Learn how to use TypeScript with React components, props, state, and hooks.',
        resources: [
          {
            title: 'React TypeScript Cheatsheet',
            url: 'https://react-typescript-cheatsheet.netlify.app/'
          }
        ]
      }
    ]
  },
  {
    title: 'Tailwind CSS Fundamentals',
    slug: 'tailwind-css-fundamentals',
    description:
      'Learn how to build beautiful, responsive user interfaces quickly using Tailwind CSS utility classes.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    category: 'CSS',
    tags: ['Tailwind CSS', 'CSS', 'Frontend', 'Styling', 'Beginner'],
    difficulty: 'Beginner' as const,
    duration: '2 hours',
    instructor: 'Emily Rodriguez',
    published: true,
    featured: false,
    publishedAt: new Date(),
    lessons: [
      {
        title: 'Introduction to Tailwind CSS',
        description: 'What is Tailwind CSS and why use a utility-first framework?',
        videoUrl: 'https://www.youtube.com/watch?v=pfaSUYaSgRo',
        duration: '10:30',
        order: 1,
        content:
          'Tailwind CSS is a utility-first CSS framework that lets you build custom designs without leaving your HTML.',
        resources: [
          {
            title: 'Tailwind CSS Documentation',
            url: 'https://tailwindcss.com/docs'
          }
        ]
      },
      {
        title: 'Utility Classes',
        description: 'Understanding Tailwind utility classes for spacing, colors, and typography.',
        videoUrl: 'https://www.youtube.com/watch?v=UBOj6rqRUME',
        duration: '22:15',
        order: 2,
        content:
          'Learn how to use utility classes for padding, margin, colors, fonts, and more.'
      },
      {
        title: 'Responsive Design',
        description: 'Building responsive layouts with Tailwind breakpoints.',
        videoUrl: 'https://www.youtube.com/watch?v=hX1zUdj4Dw4',
        duration: '18:40',
        order: 3,
        content:
          'Tailwind provides responsive modifiers that make it easy to build adaptive layouts.'
      },
      {
        title: 'Flexbox with Tailwind',
        description: 'Using Flexbox utilities to create flexible layouts.',
        videoUrl: 'https://www.youtube.com/watch?v=4Zx78qMq1FY',
        duration: '20:30',
        order: 4,
        content:
          'Master Flexbox with Tailwind utility classes for building flexible and responsive layouts.'
      },
      {
        title: 'Grid with Tailwind',
        description: 'Creating grid layouts using Tailwind grid utilities.',
        videoUrl: 'https://www.youtube.com/watch?v=c13gpBrnGEw',
        duration: '19:20',
        order: 5,
        content:
          'Learn how to use CSS Grid with Tailwind to create complex, responsive layouts.'
      },
      {
        title: 'Building a Responsive Interface',
        description: 'Putting it all together to build a complete responsive interface.',
        videoUrl: 'https://www.youtube.com/watch?v=dFgzHOX84xQ',
        duration: '28:45',
        order: 6,
        content:
          'Build a real-world landing page using all the Tailwind concepts you have learned.',
        resources: [
          {
            title: 'Project Files',
            url: 'https://github.com/example/tailwind-landing-page'
          }
        ]
      }
    ]
  },
  {
    title: 'Node.js and Express Backend Development',
    slug: 'nodejs-express-backend',
    description:
      'Build scalable backend APIs with Node.js and Express. Learn routing, middleware, database integration, and authentication.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    category: 'Backend',
    tags: ['Node.js', 'Express', 'Backend', 'API', 'Intermediate'],
    difficulty: 'Intermediate' as const,
    duration: '4 hours',
    instructor: 'David Kim',
    published: true,
    featured: false,
    publishedAt: new Date(),
    lessons: [
      {
        title: 'Introduction to Node.js and Express',
        description: 'Overview of Node.js runtime and Express framework.',
        videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
        duration: '15:00',
        order: 1,
        content:
          'Node.js allows you to run JavaScript on the server. Express is a minimal web framework for Node.js.'
      },
      {
        title: 'Setting Up Your First Server',
        description: 'Create a basic Express server and understand routing.',
        videoUrl: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
        duration: '20:30',
        order: 2,
        content: 'Learn how to set up an Express server and create your first routes.'
      },
      {
        title: 'Middleware in Express',
        description: 'Understanding and creating custom middleware functions.',
        videoUrl: 'https://www.youtube.com/watch?v=lY6icfhap2o',
        duration: '25:15',
        order: 3,
        content:
          'Middleware functions have access to request and response objects and can modify them.'
      },
      {
        title: 'RESTful API Design',
        description: 'Best practices for designing RESTful APIs.',
        videoUrl: 'https://www.youtube.com/watch?v=0oXYLzuucwE',
        duration: '22:40',
        order: 4,
        content: 'Learn REST principles and how to structure your API endpoints.'
      },
      {
        title: 'Database Integration with MongoDB',
        description: 'Connect Express to MongoDB using Mongoose.',
        videoUrl: 'https://www.youtube.com/watch?v=DZBGEVgL2eE',
        duration: '30:20',
        order: 5,
        content: 'Learn how to use Mongoose ODM to interact with MongoDB.'
      },
      {
        title: 'Authentication and Authorization',
        description: 'Implement JWT-based authentication in your API.',
        videoUrl: 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
        duration: '35:15',
        order: 6,
        content: 'Secure your API with JSON Web Tokens and role-based access control.'
      }
    ]
  },
  {
    title: 'Advanced React Patterns',
    slug: 'advanced-react-patterns',
    description:
      'Master advanced React concepts including custom hooks, context API, performance optimization, and modern patterns.',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800',
    category: 'React',
    tags: ['React', 'Advanced', 'Hooks', 'Performance'],
    difficulty: 'Advanced' as const,
    duration: '5 hours',
    instructor: 'Sarah Johnson',
    published: true,
    featured: true,
    publishedAt: new Date(),
    lessons: [
      {
        title: 'Custom Hooks',
        description: 'Learn how to create reusable custom hooks.',
        videoUrl: 'https://www.youtube.com/watch?v=6ThXsUwLWvc',
        duration: '28:30',
        order: 1,
        content: 'Custom hooks let you extract component logic into reusable functions.'
      },
      {
        title: 'Context API and State Management',
        description: 'Managing global state with React Context.',
        videoUrl: 'https://www.youtube.com/watch?v=5LrDIWkK_Bc',
        duration: '32:15',
        order: 2,
        content:
          'Learn how to use Context API to avoid prop drilling and manage application state.'
      },
      {
        title: 'Performance Optimization',
        description: 'Techniques for optimizing React application performance.',
        videoUrl: 'https://www.youtube.com/watch?v=uojLJFt9SzY',
        duration: '40:20',
        order: 3,
        content:
          'Learn about React.memo, useMemo, useCallback, and other optimization techniques.'
      },
      {
        title: 'Error Boundaries',
        description: 'Handling errors gracefully in React applications.',
        videoUrl: 'https://www.youtube.com/watch?v=DNYXgtZBRPE',
        duration: '22:30',
        order: 4,
        content:
          'Error boundaries catch JavaScript errors in component trees and display fallback UIs.'
      },
      {
        title: 'Code Splitting and Lazy Loading',
        description: 'Improve load times with code splitting.',
        videoUrl: 'https://www.youtube.com/watch?v=JU6sl_yyZqs',
        duration: '25:45',
        order: 5,
        content: 'Learn how to split your code and load components on demand.'
      },
      {
        title: 'Advanced Patterns Project',
        description: 'Build a complex application using advanced React patterns.',
        videoUrl: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
        duration: '50:40',
        order: 6,
        content:
          'Apply everything you have learned to build a production-ready React application.'
      }
    ]
  }
];

const seedTutorials = async (): Promise<void> => {
  try {
    console.log('🌱 Starting tutorial seed...');

    await connectDatabase();
    console.log('✓ Connected to database');

    // Clear existing tutorials and lessons
    await Lesson.deleteMany({});
    await Tutorial.deleteMany({});
    console.log('✓ Cleared existing tutorials and lessons');

    for (const tutorialData of tutorials) {
      const { lessons: lessonData, ...tutorialFields } = tutorialData;

      // Create tutorial
      const tutorial = await Tutorial.create(tutorialFields);
      console.log(`✓ Created tutorial: ${tutorial.title}`);

      // Create lessons
      for (const lesson of lessonData) {
        await Lesson.create({
          ...lesson,
          tutorial: tutorial._id
        });
      }
      console.log(`  ✓ Created ${lessonData.length} lessons`);
    }

    console.log(`\n✓ Successfully seeded ${tutorials.length} tutorials`);
    console.log('✓ Tutorial seed complete!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding tutorials:', error);
    process.exit(1);
  }
};

seedTutorials();
