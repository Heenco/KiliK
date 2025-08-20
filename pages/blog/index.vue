<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main class="container mx-auto px-4 pt-20 py-8 flex-1">
      <!-- Hero Section -->
      <section class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Property Insights Blog
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Expert insights and comprehensive guides for smart property decisions. 
          Stay informed with the latest analysis tools and market intelligence.
        </p>
      </section>

      <!-- Blog Grid -->
      <section class="mb-16">
        <!-- Categories Filter -->
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <button 
            @click="selectedCategory = null"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedCategory === null 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            ]"
          >
            All Posts
          </button>
          <button 
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedCategory === category 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <!-- Debug info (remove in production) -->
        <div v-if="!filteredPosts || filteredPosts.length === 0" class="text-center py-8 text-muted-foreground">
          <p v-if="loading">Loading blog posts...</p>
          <p v-else-if="error">Error loading blog posts: {{ error }}</p>
          <p v-else>No blog posts found{{ selectedCategory ? ` in ${selectedCategory}` : '' }}.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
            v-for="post in filteredPosts" 
            :key="post.slug"
            class="group bg-card/50 backdrop-blur rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            @click="navigateToPost(post.slug)"
          >
            <!-- Image -->
            <div class="aspect-video overflow-hidden">
              <img 
                :src="post.image" 
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <!-- Content -->
            <div class="p-6">
              <!-- Category Badge -->
              <div class="mb-3">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="post.categoryClass"
                >
                  <component :is="iconMap[post.icon]" class="w-4 h-4 mr-2" />
                  {{ post.category }}
                </span>
              </div>

              <!-- Title -->
              <h3 class="font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {{ post.title }}
              </h3>

              <!-- Description -->
              <p class="text-muted-foreground text-sm line-clamp-3 mb-4">
                {{ post.description }}
              </p>

              <!-- Meta Info -->
              <div class="flex items-center justify-between text-sm text-muted-foreground">
                <span>{{ post.readTime }} min read</span>
                <span>{{ post.date }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="bg-card/50 backdrop-blur rounded-lg border border-border p-8 text-center">
        <h2 class="text-2xl font-bold text-card-foreground mb-4">
          Stay Updated with Property Insights
        </h2>
        <p class="text-muted-foreground mb-6 max-w-md mx-auto">
          Get the latest property analysis tips, market insights, and expert advice delivered to your inbox.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input 
            v-model="email"
            type="email" 
            placeholder="Enter your email"
            class="flex-1"
          />
          <Button 
            @click="subscribeNewsletter"
            :disabled="isSubscribing || !email"
            class="sm:w-auto"
          >
            <component :is="isSubscribing ? 'div' : 'MailIcon'" class="w-4 h-4 mr-2" />
            {{ isSubscribing ? 'Subscribing...' : 'Subscribe' }}
          </Button>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="py-4 bg-card text-center text-muted-foreground text-sm border-t border-border">
      © {{ new Date().getFullYear() }} CliQ Property Insights
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/ui/Header.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ChevronRightIcon, 
  ShieldCheckIcon, 
  DropletIcon, 
  HeartPulseIcon, 
  GraduationCapIcon,
  CarIcon,
  MailIcon
} from 'lucide-vue-next'
import { useBlog } from '@/composables/useBlog'

// Set page metadata
useHead({
  title: 'Property Insights Blog - CliQ Property',
  meta: [
    {
      name: 'description',
      content: 'Expert insights and comprehensive guides for smart property decisions. Stay informed with the latest analysis tools and market intelligence.'
    }
  ]
})

const router = useRouter()
const email = ref('')
const isSubscribing = ref(false)
const selectedCategory = ref(null)

// Use the blog composable
const { blogPosts, loading, error, getPublishedPosts } = useBlog()

// Load blog posts on component mount
onMounted(async () => {
  await getPublishedPosts()
})

// Fallback data if content doesn't load
const fallbackPosts = [
  {
    _path: '/blog/neighborhood-safety-evaluation',
    slug: 'neighborhood-safety-evaluation',
    title: 'Evaluate Neighborhood Safety',
    description: 'Access comprehensive, up-to-date crime statistics to assess the safety of the area.',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&auto=format',
    category: 'Safety',
    categoryClass: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    icon: 'ShieldCheckIcon',
    readTime: 5,
    date: '2024-12-15',
    published: true
  },
  {
    _path: '/blog/flood-risk-assessment',
    slug: 'flood-risk-assessment',
    title: 'Assess Flood Risk Levels',
    description: 'Evaluate flood risk levels for properties using detailed historical data.',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&auto=format',
    category: 'Risk Assessment',
    categoryClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    icon: 'DropletIcon',
    readTime: 7,
    date: '2024-12-12',
    published: true
  },
  {
    _path: '/blog/healthcare-facilities-proximity',
    slug: 'healthcare-facilities-proximity',
    title: 'Locate Nearby Healthcare Facilities',
    description: 'Ensure you and your family have quick access to medical care when needed.',
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop&auto=format',
    category: 'Healthcare',
    categoryClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    icon: 'HeartPulseIcon',
    readTime: 4,
    date: '2024-12-10',
    published: true
  },
  {
    _path: '/blog/schools-and-shopping-access',
    slug: 'schools-and-shopping-access',
    title: 'Find Nearby Schools and Shops',
    description: 'Discover educational institutions and shopping centers close to your potential home.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&auto=format',
    category: 'Amenities',
    categoryClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    icon: 'GraduationCapIcon',
    readTime: 6,
    date: '2024-12-08',
    published: true
  },
  {
    _path: '/blog/transportation-accessibility',
    slug: 'transportation-accessibility',
    title: 'Explore Multiple Travel Modes',
    description: 'Assess accessibility using walking, cycling, driving, or public transit.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop&auto=format',
    category: 'Transportation',
    categoryClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    icon: 'CarIcon',
    readTime: 8,
    date: '2024-12-05',
    published: true
  },
  {
    _path: '/blog/property-investment-tips',
    slug: 'property-investment-tips',
    title: 'Smart Property Investment Strategies',
    description: 'Learn proven strategies for property investment success.',
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=600&fit=crop&auto=format',
    category: 'Investment',
    categoryClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    icon: 'ChevronRightIcon',
    readTime: 10,
    date: '2024-12-03',
    published: true
  }
]

// Use fallback if no posts loaded
const displayPosts = computed(() => {
  if (loading.value) return null
  if (error.value) return null
  if (blogPosts.value && blogPosts.value.length > 0) {
    return blogPosts.value
  }
  console.log('Using fallback posts')
  return fallbackPosts
})

// Get unique categories
const categories = computed(() => {
  const posts = displayPosts.value || []
  const uniqueCategories = [...new Set(posts.map(post => post.category))].filter(Boolean)
  return uniqueCategories.sort()
})

// Filter posts by selected category
const filteredPosts = computed(() => {
  const posts = displayPosts.value || []
  if (!selectedCategory.value) {
    return posts
  }
  return posts.filter(post => post.category === selectedCategory.value)
})

// Debug output
console.log('Blog posts loaded:', blogPosts.value)
console.log('Blog error:', error.value)

// Icon mapping for dynamic icon display
const iconMap = {
  'ShieldCheckIcon': ShieldCheckIcon,
  'DropletIcon': DropletIcon,
  'HeartPulseIcon': HeartPulseIcon,
  'GraduationCapIcon': GraduationCapIcon,
  'CarIcon': CarIcon,
  'ChevronRightIcon': ChevronRightIcon,
  'MailIcon': MailIcon
}

const navigateToPost = (slug) => {
  router.push(`/blog/${slug}`)
}

// Debug function to check what data we're getting
const debugBlogPosts = () => {
  console.log('Blog posts data:', blogPosts.value)
  if (blogPosts.value) {
    console.log('Number of posts:', blogPosts.value.length)
    console.log('First post:', blogPosts.value[0])
  }
}

const subscribeNewsletter = async () => {
  if (!email.value) return
  
  isSubscribing.value = true
  
  // Simulate newsletter subscription
  setTimeout(() => {
    alert('Thank you for subscribing to our newsletter!')
    email.value = ''
    isSubscribing.value = false
  }, 1500)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>