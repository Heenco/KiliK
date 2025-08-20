import { ref, computed } from 'vue'
import matter from 'gray-matter'
import { marked } from 'marked'

// Configure marked for better HTML output
marked.setOptions({
  breaks: true,
  gfm: true
})

const blogPosts = ref([])
const loading = ref(false)
const error = ref(null)

export function useBlog() {
  
  // Load all blog posts
  const loadBlogPosts = async () => {
    if (blogPosts.value.length > 0) {
      return blogPosts.value // Return cached posts
    }

    loading.value = true
    error.value = null

    try {
      // Use Vite's import.meta.glob to get all markdown files
      const modules = import.meta.glob('/src/content/blog/*.md', { as: 'raw', eager: true })
      
      const posts = []

      for (const [path, content] of Object.entries(modules)) {
        try {
          // Parse frontmatter and content
          const { data: frontmatter, content: markdown } = matter(content)
          
          // Extract filename for slug if not provided
          const filename = path.split('/').pop().replace('.md', '')
          
          // Create post object
          const post = {
            ...frontmatter,
            slug: frontmatter.slug || filename,
            content: markdown,
            html: marked(markdown),
            path,
            // Ensure published is boolean
            published: frontmatter.published !== false
          }
          
          posts.push(post)
        } catch (err) {
          console.error(`Error parsing ${path}:`, err)
        }
      }

      // Sort posts by date (newest first)
      posts.sort((a, b) => new Date(b.date) - new Date(a.date))
      
      blogPosts.value = posts
      return posts

    } catch (err) {
      error.value = err
      console.error('Error loading blog posts:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Get all published posts
  const getPublishedPosts = async () => {
    const posts = await loadBlogPosts()
    return posts.filter(post => post.published)
  }

  // Get a single post by slug
  const getPostBySlug = async (slug) => {
    const posts = await loadBlogPosts()
    return posts.find(post => post.slug === slug)
  }

  // Get posts by category
  const getPostsByCategory = async (category) => {
    const posts = await loadBlogPosts()
    return posts.filter(post => 
      post.published && 
      post.category?.toLowerCase() === category.toLowerCase()
    )
  }

  // Get related posts (same category, excluding current post)
  const getRelatedPosts = async (currentSlug, limit = 3) => {
    const posts = await loadBlogPosts()
    const currentPost = posts.find(post => post.slug === currentSlug)
    
    if (!currentPost) return []
    
    return posts
      .filter(post => 
        post.published && 
        post.slug !== currentSlug && 
        post.category === currentPost.category
      )
      .slice(0, limit)
  }

  // Computed properties
  const publishedPosts = computed(() => 
    blogPosts.value.filter(post => post.published)
  )

  const categories = computed(() => {
    const cats = new Set()
    blogPosts.value.forEach(post => {
      if (post.published && post.category) {
        cats.add(post.category)
      }
    })
    return Array.from(cats).sort()
  })

  const totalPosts = computed(() => publishedPosts.value.length)

  return {
    // State
    blogPosts: publishedPosts,
    loading,
    error,
    
    // Methods
    loadBlogPosts,
    getPublishedPosts,
    getPostBySlug,
    getPostsByCategory,
    getRelatedPosts,
    
    // Computed
    categories,
    totalPosts
  }
}
