import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';
import Quiz from '../models/Quiz.js';
import QuizQuestion from '../models/QuizQuestion.js';
import Tutorial from '../models/Tutorial.js';

dotenv.config();

const quizData = [
  {
    tutorialSlug: 'getting-started-with-react',
    title: 'React Fundamentals Quiz',
    description: 'Test your understanding of React fundamentals including components, props, state, and JSX.',
    passingScore: 70,
    timeLimit: 15,
    published: true,
    questions: [
      {
        question: 'What is React?',
        type: 'multiple-choice' as const,
        options: [
          'A JavaScript library for building user interfaces',
          'A database management system',
          'A CSS framework',
          'A server-side programming language'
        ],
        correctAnswer: 'A JavaScript library for building user interfaces',
        explanation: 'React is a JavaScript library developed by Facebook for building user interfaces, especially for single-page applications.',
        points: 1,
        order: 1
      },
      {
        question: 'What is JSX?',
        type: 'multiple-choice' as const,
        options: [
          'A JavaScript syntax extension',
          'A database query language',
          'A CSS preprocessor',
          'A server framework'
        ],
        correctAnswer: 'A JavaScript syntax extension',
        explanation: 'JSX stands for JavaScript XML. It allows you to write HTML-like syntax in JavaScript.',
        points: 1,
        order: 2
      },
      {
        question: 'Can you use React without JSX?',
        type: 'true-false' as const,
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Yes, you can use React without JSX, but JSX makes React code more readable and easier to write.',
        points: 1,
        order: 3
      },
      {
        question: 'What are props in React?',
        type: 'multiple-choice' as const,
        options: [
          'Properties passed from parent to child components',
          'CSS styling properties',
          'Database properties',
          'Server configuration properties'
        ],
        correctAnswer: 'Properties passed from parent to child components',
        explanation: 'Props (short for properties) are used to pass data from parent components to child components in React.',
        points: 1,
        order: 4
      },
      {
        question: 'State in React is immutable.',
        type: 'true-false' as const,
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'State should never be modified directly. Always use setState or the state setter function from useState.',
        points: 1,
        order: 5
      },
      {
        question: 'Which hook is used to manage state in functional components?',
        type: 'multiple-choice' as const,
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 'useState',
        explanation: 'The useState hook is the primary way to add state to functional components.',
        points: 1,
        order: 6
      },
      {
        question: 'React components must start with a capital letter.',
        type: 'true-false' as const,
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'React treats components starting with lowercase letters as DOM tags, so component names must start with uppercase.',
        points: 1,
        order: 7
      },
      {
        question: 'What does the Virtual DOM do?',
        type: 'multiple-choice' as const,
        options: [
          'Improves performance by minimizing direct DOM manipulations',
          'Stores application data',
          'Handles routing',
          'Manages server requests'
        ],
        correctAnswer: 'Improves performance by minimizing direct DOM manipulations',
        explanation: 'The Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize rendering performance.',
        points: 1,
        order: 8
      }
    ]
  },
  {
    tutorialSlug: 'typescript-for-beginners',
    title: 'TypeScript Fundamentals Quiz',
    description: 'Assess your knowledge of TypeScript basics including types, interfaces, functions, and generics.',
    passingScore: 70,
    timeLimit: 15,
    published: true,
    questions: [
      {
        question: 'What is TypeScript?',
        type: 'multiple-choice' as const,
        options: [
          'A superset of JavaScript with static typing',
          'A JavaScript framework',
          'A database language',
          'A CSS preprocessor'
        ],
        correctAnswer: 'A superset of JavaScript with static typing',
        explanation: 'TypeScript is a strongly typed programming language that builds on JavaScript.',
        points: 1,
        order: 1
      },
      {
        question: 'TypeScript code runs directly in the browser.',
        type: 'true-false' as const,
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'TypeScript must be transpiled to JavaScript before it can run in the browser.',
        points: 1,
        order: 2
      },
      {
        question: 'Which of these is a valid TypeScript type?',
        type: 'multiple-choice' as const,
        options: ['string', 'text', 'char', 'varchar'],
        correctAnswer: 'string',
        explanation: 'TypeScript has basic types including string, number, boolean, and more.',
        points: 1,
        order: 3
      },
      {
        question: 'What is an interface in TypeScript?',
        type: 'multiple-choice' as const,
        options: [
          'A way to define the structure of an object',
          'A type of function',
          'A CSS styling method',
          'A database schema'
        ],
        correctAnswer: 'A way to define the structure of an object',
        explanation: 'Interfaces in TypeScript define the shape of an object, specifying which properties and methods it should have.',
        points: 1,
        order: 4
      },
      {
        question: 'You can use JavaScript libraries in TypeScript.',
        type: 'true-false' as const,
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'TypeScript is a superset of JavaScript, so any valid JavaScript code is also valid TypeScript.',
        points: 1,
        order: 5
      },
      {
        question: 'What are generics in TypeScript?',
        type: 'multiple-choice' as const,
        options: [
          'A way to create reusable components that work with multiple types',
          'A type of variable',
          'A CSS class',
          'A database constraint'
        ],
        correctAnswer: 'A way to create reusable components that work with multiple types',
        explanation: 'Generics allow you to write flexible, reusable code that works with different types while maintaining type safety.',
        points: 1,
        order: 6
      },
      {
        question: 'The "any" type disables type checking.',
        type: 'true-false' as const,
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'The any type opts out of type checking, allowing any value to be assigned. It should be avoided when possible.',
        points: 1,
        order: 7
      }
    ]
  },
  {
    tutorialSlug: 'tailwind-css-fundamentals',
    title: 'Tailwind CSS Fundamentals Quiz',
    description: 'Evaluate your understanding of Tailwind CSS utility classes, responsive design, and layout systems.',
    passingScore: 70,
    timeLimit: 12,
    published: true,
    questions: [
      {
        question: 'What is Tailwind CSS?',
        type: 'multiple-choice' as const,
        options: [
          'A utility-first CSS framework',
          'A JavaScript framework',
          'A database system',
          'A testing library'
        ],
        correctAnswer: 'A utility-first CSS framework',
        explanation: 'Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs.',
        points: 1,
        order: 1
      },
      {
        question: 'Tailwind requires writing custom CSS for most styling.',
        type: 'true-false' as const,
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Tailwind provides utility classes for most styling needs, minimizing the need for custom CSS.',
        points: 1,
        order: 2
      },
      {
        question: 'Which class adds padding of 4 units in Tailwind?',
        type: 'multiple-choice' as const,
        options: ['p-4', 'padding-4', 'pad-4', 'space-4'],
        correctAnswer: 'p-4',
        explanation: 'Tailwind uses shorthand utility classes like p-4 for padding, m-4 for margin, etc.',
        points: 1,
        order: 3
      },
      {
        question: 'How do you apply styles for medium screens and above?',
        type: 'multiple-choice' as const,
        options: ['md:class-name', 'medium:class-name', '@media:class-name', 'screen-md:class-name'],
        correctAnswer: 'md:class-name',
        explanation: 'Tailwind uses responsive prefixes like sm:, md:, lg:, xl: to apply styles at different breakpoints.',
        points: 1,
        order: 4
      },
      {
        question: 'Tailwind includes pre-built components like buttons and cards.',
        type: 'true-false' as const,
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Tailwind is a utility-first framework and does not include pre-built components. You build components using utility classes.',
        points: 1,
        order: 5
      },
      {
        question: 'Which utility makes an element flex container?',
        type: 'multiple-choice' as const,
        options: ['flex', 'flexbox', 'display-flex', 'd-flex'],
        correctAnswer: 'flex',
        explanation: 'The "flex" class sets display: flex on an element in Tailwind CSS.',
        points: 1,
        order: 6
      }
    ]
  }
];

const seedQuizzes = async (): Promise<void> => {
  try {
    console.log('🌱 Starting quiz seed...');

    await connectDatabase();
    console.log('✓ Connected to database');

    // Clear existing quizzes and questions
    await QuizQuestion.deleteMany({});
    await Quiz.deleteMany({});
    console.log('✓ Cleared existing quizzes and questions');

    let totalQuizzes = 0;
    let totalQuestions = 0;

    for (const quizInfo of quizData) {
      // Find tutorial by slug
      const tutorial = await Tutorial.findOne({ slug: quizInfo.tutorialSlug });
      
      if (!tutorial) {
        console.log(`⚠️  Tutorial not found: ${quizInfo.tutorialSlug}, skipping...`);
        continue;
      }

      const { questions: questionData, tutorialSlug, ...quizFields } = quizInfo;

      // Create quiz
      const quiz = await Quiz.create({
        ...quizFields,
        tutorial: tutorial._id,
        publishedAt: quizInfo.published ? new Date() : undefined
      });

      console.log(`✓ Created quiz: ${quiz.title}`);
      totalQuizzes++;

      // Create questions
      for (const question of questionData) {
        await QuizQuestion.create({
          ...question,
          quiz: quiz._id
        });
        totalQuestions++;
      }
      console.log(`  ✓ Created ${questionData.length} questions`);
    }

    console.log(`\n✓ Successfully seeded ${totalQuizzes} quizzes with ${totalQuestions} questions`);
    console.log('✓ Quiz seed complete!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
    process.exit(1);
  }
};

seedQuizzes();
