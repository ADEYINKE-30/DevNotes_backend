import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';
import BlogPost from '../models/BlogPost.js';

dotenv.config();

const blogPosts = [
  {
    title: 'Getting Started with React Hooks',
    slug: 'getting-started-with-react-hooks',
    description:
      'Learn how to use React Hooks like useState, useEffect, and useContext to build modern React applications.',
    content: `
# Getting Started with React Hooks

React Hooks revolutionized how we write React components. They allow you to use state and other React features without writing a class.

## useState Hook

The useState hook lets you add state to functional components:

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect Hook

The useEffect hook lets you perform side effects in functional components:

\`\`\`javascript
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

## Custom Hooks

You can also create custom hooks to reuse stateful logic between components.

Hooks make your code more readable and easier to maintain!
    `,
    category: 'React',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    author: 'Sarah Johnson',
    readTime: '8 min read',
    published: true
  },
  {
    title: 'TypeScript Best Practices for 2024',
    slug: 'typescript-best-practices-2024',
    description:
      'Discover the latest TypeScript best practices and patterns that will make your code more maintainable and type-safe.',
    content: `
# TypeScript Best Practices for 2024

TypeScript continues to evolve with powerful features. Here are the best practices you should follow.

## Use Strict Mode

Always enable strict mode in your tsconfig.json:

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

## Prefer Interfaces for Objects

Use interfaces when defining object shapes:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}
\`\`\`

## Use Type Guards

Type guards help TypeScript narrow down types:

\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
\`\`\`

Following these practices will make your TypeScript code more robust!
    `,
    category: 'TypeScript',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    author: 'Michael Chen',
    readTime: '10 min read',
    published: true
  },
  {
    title: 'Mastering Tailwind CSS: Tips and Tricks',
    slug: 'mastering-tailwind-css-tips-tricks',
    description:
      'Level up your Tailwind CSS skills with these advanced tips, tricks, and patterns for building beautiful UIs.',
    content: `
# Mastering Tailwind CSS: Tips and Tricks

Tailwind CSS is more than just utility classes. Let's explore some advanced techniques.

## Custom Color Palette

Extend Tailwind's color palette with your brand colors:

\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#5B21B6',
          secondary: '#7C3AED',
        }
      }
    }
  }
}
\`\`\`

## Component Extraction

Use @apply to extract common patterns:

\`\`\`css
.btn-primary {
  @apply bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700;
}
\`\`\`

## Dark Mode

Tailwind makes dark mode easy:

\`\`\`html
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-gray-900 dark:text-white">Hello</h1>
</div>
\`\`\`

These techniques will help you build production-ready interfaces faster!
    `,
    category: 'CSS',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    author: 'Emily Rodriguez',
    readTime: '7 min read',
    published: true
  },
  {
    title: 'Building RESTful APIs with Node.js and Express',
    slug: 'building-restful-apis-nodejs-express',
    description:
      'A comprehensive guide to building robust and scalable RESTful APIs using Node.js and Express framework.',
    content: `
# Building RESTful APIs with Node.js and Express

Learn how to build professional APIs that scale.

## Project Setup

Initialize your Node.js project:

\`\`\`bash
npm init -y
npm install express mongoose dotenv
\`\`\`

## Basic Server

Create a basic Express server:

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
\`\`\`

## REST Principles

- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Use meaningful resource names
- Return appropriate status codes
- Version your API

## Error Handling

Implement centralized error handling:

\`\`\`javascript
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message
  });
});
\`\`\`

Building great APIs takes practice, but following these principles will set you up for success!
    `,
    category: 'Node.js',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    author: 'David Kim',
    readTime: '12 min read',
    published: true
  },
  {
    title: 'MongoDB Schema Design Patterns',
    slug: 'mongodb-schema-design-patterns',
    description:
      'Learn essential MongoDB schema design patterns and best practices for building scalable database architectures.',
    content: `
# MongoDB Schema Design Patterns

Designing your MongoDB schema correctly is crucial for performance and scalability.

## Embedding vs Referencing

**Embed** when data is always accessed together:

\`\`\`javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  address: {
    street: "123 Main St",
    city: "New York"
  }
}
\`\`\`

**Reference** when data is large or frequently accessed independently:

\`\`\`javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  posts: [ObjectId("post1"), ObjectId("post2")]
}
\`\`\`

## The Subset Pattern

Store frequently accessed data and reference the rest:

\`\`\`javascript
{
  _id: ObjectId("..."),
  title: "Blog Post",
  recentComments: [...], // Last 10 comments
  totalComments: 150,
  commentsRef: ObjectId("comments_collection")
}
\`\`\`

## Indexing

Create indexes for frequently queried fields:

\`\`\`javascript
db.users.createIndex({ email: 1 });
db.posts.createIndex({ category: 1, createdAt: -1 });
\`\`\`

Good schema design makes all the difference in MongoDB!
    `,
    category: 'MongoDB',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    author: 'James Wilson',
    readTime: '9 min read',
    published: true
  },
  {
    title: 'Modern JavaScript ES2024 Features',
    slug: 'modern-javascript-es2024-features',
    description:
      'Explore the latest JavaScript features in ES2024 including new array methods, improved error handling, and more.',
    content: `
# Modern JavaScript ES2024 Features

JavaScript continues to evolve. Let's explore the newest features!

## Array Grouping

Group array elements by a key:

\`\`\`javascript
const fruits = [
  { name: 'apple', color: 'red' },
  { name: 'banana', color: 'yellow' },
  { name: 'cherry', color: 'red' }
];

const grouped = Object.groupBy(fruits, fruit => fruit.color);
// { red: [apple, cherry], yellow: [banana] }
\`\`\`

## Array.prototype.toSorted()

Non-mutating sort:

\`\`\`javascript
const numbers = [3, 1, 4, 1, 5];
const sorted = numbers.toSorted(); // [1, 1, 3, 4, 5]
// Original array unchanged
\`\`\`

## Promise.withResolvers()

New way to create promises:

\`\`\`javascript
const { promise, resolve, reject } = Promise.withResolvers();

// Use resolve/reject from outside
setTimeout(() => resolve('Done!'), 1000);
\`\`\`

## Top-level await

Use await at the top level:

\`\`\`javascript
const data = await fetch('/api/data');
console.log(data);
\`\`\`

Stay updated with the latest JavaScript features to write modern code!
    `,
    category: 'JavaScript',
    image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800',
    author: 'Alex Turner',
    readTime: '6 min read',
    published: true
  },
  {
    title: 'React Performance Optimization Techniques',
    slug: 'react-performance-optimization',
    description:
      'Optimize your React applications with these proven techniques for better performance and user experience.',
    content: `
# React Performance Optimization Techniques

Make your React apps blazing fast!

## React.memo()

Prevent unnecessary re-renders:

\`\`\`javascript
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});
\`\`\`

## useMemo Hook

Memoize expensive calculations:

\`\`\`javascript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
\`\`\`

## useCallback Hook

Memoize callback functions:

\`\`\`javascript
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
\`\`\`

## Code Splitting

Split your code into smaller bundles:

\`\`\`javascript
const LazyComponent = React.lazy(() => import('./Component'));

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
\`\`\`

## Virtualization

Render only visible items in long lists:

\`\`\`javascript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={50}
>
  {Row}
</FixedSizeList>
\`\`\`

Performance optimization is an ongoing process!
    `,
    category: 'React',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800',
    author: 'Sarah Johnson',
    readTime: '11 min read',
    published: true
  },
  {
    title: 'Express.js Middleware: Complete Guide',
    slug: 'expressjs-middleware-complete-guide',
    description:
      'Understanding Express.js middleware: built-in, third-party, and custom middleware patterns for building robust applications.',
    content: `
# Express.js Middleware: Complete Guide

Middleware is the backbone of Express applications.

## What is Middleware?

Middleware functions have access to the request and response objects:

\`\`\`javascript
app.use((req, res, next) => {
  console.log('Request received');
  next(); // Pass control to next middleware
});
\`\`\`

## Built-in Middleware

Express provides several built-in middleware:

\`\`\`javascript
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files
\`\`\`

## Third-party Middleware

Popular middleware packages:

\`\`\`javascript
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
\`\`\`

## Custom Middleware

Create your own middleware:

\`\`\`javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Verify token
  req.user = verifyToken(token);
  next();
};

app.use('/api/protected', authMiddleware);
\`\`\`

## Error Handling Middleware

Handle errors gracefully:

\`\`\`javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message
  });
});
\`\`\`

Master middleware to build powerful Express applications!
    `,
    category: 'Node.js',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    author: 'David Kim',
    readTime: '10 min read',
    published: true
  },
  {
    title: 'Web Development Trends in 2024',
    slug: 'web-development-trends-2024',
    description:
      'Stay ahead of the curve with the latest web development trends, tools, and technologies shaping the industry in 2024.',
    content: `
# Web Development Trends in 2024

The web development landscape is evolving rapidly. Here's what's trending!

## AI-Powered Development

AI tools are transforming how we code:

- GitHub Copilot for code suggestions
- ChatGPT for debugging and learning
- AI-powered testing tools

## Server Components

React Server Components are changing frontend development:

\`\`\`javascript
// Server Component
async function BlogPost({ id }) {
  const post = await db.posts.findById(id);
  return <article>{post.content}</article>;
}
\`\`\`

## Edge Computing

Deploy closer to your users:

\`\`\`javascript
export default async function handler(req) {
  // Runs at the edge, closer to users
  return new Response('Hello from the edge!');
}
\`\`\`

## TypeScript Dominance

TypeScript is now the default for new projects:

- Better tooling and IDE support
- Catch errors before runtime
- Improved code documentation

## Web Components

Native web components are gaining traction:

\`\`\`javascript
class MyButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<button>Click me</button>';
  }
}

customElements.define('my-button', MyButton);
\`\`\`

## Jamstack Evolution

Jamstack is maturing with better tools:

- Next.js App Router
- Astro
- Remix

Stay curious and keep learning!
    `,
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    author: 'Emily Rodriguez',
    readTime: '8 min read',
    published: true
  },
  {
    title: 'Testing React Applications: Best Practices',
    slug: 'testing-react-applications-best-practices',
    description:
      'Learn how to write effective tests for React applications using Jest, React Testing Library, and modern testing practices.',
    content: `
# Testing React Applications: Best Practices

Quality tests lead to quality code!

## Testing Library Philosophy

Test your components the way users interact with them:

\`\`\`javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('button click increments counter', () => {
  render(<Counter />);
  
  const button = screen.getByRole('button', { name: /increment/i });
  fireEvent.click(button);
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
\`\`\`

## Unit Tests

Test individual components:

\`\`\`javascript
test('renders user name', () => {
  render(<UserCard name="John Doe" />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
\`\`\`

## Integration Tests

Test component interactions:

\`\`\`javascript
test('form submission', async () => {
  render(<LoginForm />);
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'user@example.com' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  await screen.findByText('Login successful');
});
\`\`\`

## Mock API Calls

Use MSW to mock API requests:

\`\`\`javascript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ name: 'John' }));
  })
);
\`\`\`

## Test Coverage

Aim for meaningful coverage:

- Critical user paths
- Error scenarios
- Edge cases

Don't chase 100% coverage—focus on testing what matters!
    `,
    category: 'Testing',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    author: 'Michael Chen',
    readTime: '9 min read',
    published: true
  }
];

const seedBlogPosts = async (): Promise<void> => {
  try {
    console.log('🌱 Starting blog posts seed...');

    await connectDatabase();
    console.log('✓ Connected to database');

    // Clear existing blog posts
    await BlogPost.deleteMany({});
    console.log('✓ Cleared existing blog posts');

    // Create blog posts
    for (const postData of blogPosts) {
      await BlogPost.create(postData);
      console.log(`✓ Created blog post: ${postData.title}`);
    }

    console.log(`\n✓ Successfully seeded ${blogPosts.length} blog posts`);
    console.log('✓ Blog posts seed complete!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding blog posts:', error);
    process.exit(1);
  }
};

seedBlogPosts();
