/**

- TanStack Libraries Integration Guide
-
- This file demonstrates common patterns for using each TanStack library
- in this project. Uncomment examples and adapt them to your needs.
  */

// ============================================================================
// TANSTACK ROUTER - File-Based Routing
// ============================================================================

/*
// Create a new route at src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
component: About,
})

function About() {
return <div>About Page</div>
}

// Dynamic routes: src/routes/blog.$postId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/$postId')({
component: BlogPost,
})

function BlogPost() {
const { postId } = Route.useParams()
return <div>Post {postId}</div>
}

// Navigate with type-safe Link:
import { Link } from '@tanstack/react-router'

<Link to="/blog/$postId" params={{ postId: '123' }}>
  View Post
</Link>

// Or with useNavigate hook:
import { useNavigate } from '@tanstack/react-router'

const navigate = useNavigate()
navigate({ to: '/blog/$postId', params: { postId: '123' } })
*/

// ============================================================================
// TANSTACK QUERY - Server State Management & Data Fetching
// ============================================================================

/*
// Basic Query (read):
import { useQuery } from '@tanstack/react-query'

function MyComponent() {
const { data, isLoading, error } = useQuery({
queryKey: ['todos'],
queryFn: async () => {
const res = await fetch('/api/todos')
return res.json()
},
})

if (isLoading) return <div>Loading...</div>
if (error) return <div>Error: {error.message}</div>
return <ul>{data.map(todo => <li key={todo.id}>{todo.title}</li>)}</ul>
}

// Suspense Query (simpler):
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

function MyComponent() {
return (
<Suspense fallback={<div>Loading...</div>}>
<TodoList />
</Suspense>
)
}

function TodoList() {
const { data: todos } = useSuspenseQuery({
queryKey: ['todos'],
queryFn: async () => {
const res = await fetch('/api/todos')
return res.json()
},
})

return <ul>{todos.map(todo => <li key={todo.id}>{todo.title}</li>)}</ul>
}

// Mutation (write):
import { useMutation, useQueryClient } from '@tanstack/react-query'

function MyComponent() {
const queryClient = useQueryClient()
const mutation = useMutation({
mutationFn: async (newTodo) => {
const res = await fetch('/api/todos', {
method: 'POST',
body: JSON.stringify(newTodo),
})
return res.json()
},
onSuccess: () => {
// Invalidate query to refetch
queryClient.invalidateQueries({ queryKey: ['todos'] })
},
})

return (
<button onClick={() => mutation.mutate({ title: 'New Todo' })}>
{mutation.isPending ? 'Creating...' : 'Create Todo'}
</button>
)
}

// Dependent Queries:
function MyComponent({ postId }) {
const { data: post } = useQuery({
queryKey: ['post', postId],
queryFn: async () => {
const res = await fetch(`/api/posts/${postId}`)
return res.json()
},
})

// Only fetch comments after post is loaded
const { data: comments } = useQuery({
queryKey: ['comments', postId],
queryFn: async () => {
const res = await fetch(`/api/posts/${postId}/comments`)
return res.json()
},
enabled: !!post, // Only run when post exists
})

return (
<div>
<h1>{post?.title}</h1>
{comments?.map(comment => <p key={comment.id}>{comment.text}</p>)}
</div>
)
}

// Paginated Queries:
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

function MyComponent() {
const [page, setPage] = useState(1)

const { data, isPreviousData } = useQuery({
queryKey: ['todos', page],
queryFn: async () => {
const res = await fetch(`/api/todos?page=${page}`)
return res.json()
},
// Keep previous data while fetching new page
placeholderData: (previousData) => previousData,
})

return (
<div>
{data?.items.map(todo => <div key={todo.id}>{todo.title}</div>)}
<button onClick={() => setPage(p => p + 1)} disabled={isPreviousData}>
Next Page
</button>
</div>
)
}
*/

// ============================================================================
// TANSTACK START - Full-Stack SSR Framework
// ============================================================================

/*
// Create a server-side loader in a route:
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'

const fetchUserData = createServerFn('GET /api/user/$id', async (userId) => {
  // This runs on the server
  const res = await fetch(`https://api.example.com/users/${userId}`)
return res.json()
})

export const Route = createFileRoute('/user/$userId')({
loader: ({ params }) => fetchUserData({ userId: params.userId }),
component: UserPage,
})

function UserPage() {
const { userId } = Route.useParams()
const data = Route.useLoaderData()

return <div>{data.name}</div>
}

// Form Actions (mutations on the server):
import { createServerFn } from '@tanstack/start'

const createTodo = createServerFn('POST /api/todos', async (newTodo) => {
// Server-side mutation
const res = await fetch('https://api.example.com/todos', {
method: 'POST',
body: JSON.stringify(newTodo),
})
return res.json()
})

function CreateTodoForm() {
return (
<form action={createTodo} method="post">
<input name="title" placeholder="Todo title" />
<button type="submit">Create</button>
</form>
)
}
*/

// ============================================================================
// TANSTACK DEVTOOLS - Debugging & Inspection
// ============================================================================

/*
// Devtools are already configured in src/routes/__root.tsx
// They appear in the bottom-right corner of the page.

// Manually open devtools with a hook:
import { useDevtools } from '@tanstack/react-query-devtools'

function MyComponent() {
const devtools = useDevtools()

return (
<button onClick={() => devtools.open()}>
Open Query Devtools
</button>
)
}
*/

// ============================================================================
// TANSTACK CLI & ROUTER CLI - Code Generation
// ============================================================================

/*
// Generate new route structure:
// Run: npx tsr generate
//
// Or scaffold a new action with the CLI:
// npx @tanstack/cli@latest create path/name --agent

// Watch mode during development:
// Routes auto-regenerate on save.
// Check package.json's "dev" script.
*/

// ============================================================================
// ROUTER CONTEXT & QUERY CLIENT ACCESS
// ============================================================================

/*
// Access QueryClient in any route component:
import { useRouter } from '@tanstack/react-router'

function MyComponent() {
const router = useRouter()
const queryClient = router.context.queryClient

// Manually invalidate or update cache
queryClient.invalidateQueries({ queryKey: ['todos'] })
queryClient.setQueryData(['user'], { name: 'John' })
}

// Passing context through Router:
// Done in src/router.tsx via getContext() and MyRouterContext interface
*/

// ============================================================================
// COMMON PATTERNS
// ============================================================================

/*
// 1. Optimistic Updates (UI updates before server confirms)
const mutation = useMutation({
mutationFn: updateTodo,
onMutate: async (newTodo) => {
// Cancel outgoing queries
await queryClient.cancelQueries({ queryKey: ['todos'] })

    // Snapshot old data
    const previousData = queryClient.getQueryData(['todos'])

    // Optimistically update UI
    queryClient.setQueryData(['todos'], (old) => [
      ...old,
      newTodo
    ])

    // Return rollback function
    return { previousData }

},
onError: (err, newTodo, context) => {
// Rollback on error
queryClient.setQueryData(['todos'], context.previousData)
},
})

// 2. Infinite Queries (pagination/scroll)
import { useInfiniteQuery } from '@tanstack/react-query'

const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
queryKey: ['posts'],
queryFn: ({ pageParam = 0 }) =>
fetch(`/api/posts?offset=${pageParam}`).then(r => r.json()),
getNextPageParam: (lastPage) => lastPage.nextOffset,
})

// 3. Parallel Queries
const query1 = useQuery({ queryKey: ['q1'], queryFn: fn1 })
const query2 = useQuery({ queryKey: ['q2'], queryFn: fn2 })

// 4. Prefetching (warm up cache before route navigation)
const navigate = useNavigate()
const queryClient = useQueryClient()

const goToBlog = (id) => {
queryClient.prefetchQuery({
queryKey: ['post', id],
queryFn: () => fetchPost(id),
})
navigate({ to: '/blog/$postId', params: { postId: id } })
}
*/

// ============================================================================
// TESTING TIPS
// ============================================================================

/*
// Mock queries in tests:
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

const createTestQueryClient = () =>
new QueryClient({
defaultOptions: {
queries: { retry: false },
mutations: { retry: false },
},
})

const wrapper = ({ children }) => (
<QueryClientProvider client={createTestQueryClient()}>
{children}
</QueryClientProvider>
)

test('renders data', () => {
render(<MyComponent />, { wrapper })
// ...
})

// Mock server responses (MSW recommended):
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const server = setupServer(
http.get('/api/todos', () => HttpResponse.json([{ id: 1, title: 'Test' }]))
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
*/

export {}
