import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default defineEventHandler(async (event) => {
  try {
    console.log('API: Featured blog posts requested')
    const contentDir = path.resolve('./content/blog')
    console.log('API: Content directory:', contentDir)
    
    // Check if directory exists
    if (!fs.existsSync(contentDir)) {
      console.log('API: Content directory does not exist')
      return []
    }
    
    const files = fs.readdirSync(contentDir)
    console.log('API: Found files:', files)
    
    const posts = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        try {
          const filePath = path.join(contentDir, file)
          const content = fs.readFileSync(filePath, 'utf-8')
          const { data: frontmatter } = matter(content)
          
          const post = {
            slug: frontmatter.slug || file.replace('.md', ''),
            title: frontmatter.title || 'Untitled',
            description: frontmatter.description || '',
            image: frontmatter.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&auto=format',
            category: frontmatter.category || 'General',
            categoryClass: getCategoryClass(frontmatter.category),
            readTime: frontmatter.readTime || 5,
            date: frontmatter.date || new Date().toISOString().split('T')[0],
            published: frontmatter.published !== false
          }
          
          console.log('API: Processed post:', post.title, 'Published:', post.published)
          return post
        } catch (err) {
          console.error(`Error parsing ${file}:`, err)
          return null
        }
      })
      .filter(post => post && post.published)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    
    console.log('API: Total published posts:', posts.length)
    
    // Return featured posts (first 3)
    const featured = posts.slice(0, 3)
    console.log('API: Returning featured posts:', featured.length)
    return featured
    
  } catch (error) {
    console.error('Error in blog API:', error)
    return []
  }
})

function getCategoryClass(category) {
  const classes = {
    'Safety': 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    'Risk Assessment': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    'Investment': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    'Market Analysis': 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    'Legal': 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
  }
  
  return classes[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
}
