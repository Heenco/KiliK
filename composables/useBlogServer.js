// Server-side blog composable that avoids browser Buffer issues
export async function useBlogServer() {
  // Use Nuxt's server-side capabilities
  const { data: posts } = await $fetch('/api/blog/featured')
  
  return {
    featuredPosts: posts || []
  }
}

// Alternative: Use asyncData for server-side rendering
export async function getBlogPosts() {
  try {
    // This runs on the server, so Node.js APIs are available
    if (process.server) {
      const matter = await import('gray-matter')
      const fs = await import('fs')
      const path = await import('path')
      
      const contentDir = path.resolve('./content/blog')
      const files = fs.readdirSync(contentDir)
      
      const posts = files
        .filter(file => file.endsWith('.md'))
        .map(file => {
          const content = fs.readFileSync(path.join(contentDir, file), 'utf-8')
          const { data: frontmatter } = matter.default(content)
          
          return {
            ...frontmatter,
            slug: file.replace('.md', ''),
            published: frontmatter.published !== false
          }
        })
        .filter(post => post.published)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
      
      return posts.slice(0, 3) // Get first 3 for featured
    }
    
    return []
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return []
  }
}
