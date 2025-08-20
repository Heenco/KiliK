<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main class="container mx-auto px-4 pt-20 py-8 flex-1">
      <!-- Debug Info (remove in production) -->
      <div v-if="!displayPost" class="text-center py-8 mb-8 bg-muted/50 rounded-lg">
        <p class="text-muted-foreground">
          {{ postError ? `Error loading post: ${postError}` : 'Loading blog post...' }}
        </p>
        <p class="text-sm text-muted-foreground mt-2">
          Searching for slug: "{{ route.params.slug }}"
        </p>
      </div>
      
      <div v-if="displayPost" class="max-w-4xl mx-auto">
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <NuxtLink to="/" class="hover:text-foreground transition-colors">Home</NuxtLink>
          <ChevronRightIcon class="w-4 h-4" />
          <NuxtLink to="/blog" class="hover:text-foreground transition-colors">Blog</NuxtLink>
          <ChevronRightIcon class="w-4 h-4" />
          <span class="text-foreground">{{ displayPost.title }}</span>
        </nav>

        <!-- Article Header -->
        <header class="mb-8">
          <!-- Category Badge -->
          <div class="mb-4">
            <span 
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="displayPost.categoryClass"
            >
              <component :is="iconMap[displayPost.icon]" class="w-4 h-4 mr-2" />
              {{ displayPost.category }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-4xl font-bold text-foreground mb-4">{{ displayPost.title }}</h1>

          <!-- Meta Info -->
          <div class="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
            <span>{{ displayPost.readTime }} min read</span>
            <span>Published {{ displayPost.date }}</span>
            <span>By CliQ Property Team</span>
          </div>

          <!-- Featured Image -->
          <div class="aspect-video rounded-lg overflow-hidden mb-8">
            <img 
              :src="displayPost.image" 
              :alt="displayPost.title"
              class="w-full h-full object-cover"
            />
          </div>
        </header>

        <!-- Article Content -->
        <article class="prose prose-lg max-w-none dark:prose-invert">
          <div class="bg-card/50 backdrop-blur rounded-lg border border-border p-8 mb-8">
            <h2 class="text-2xl font-bold text-card-foreground mb-4">Overview</h2>
            <p class="text-muted-foreground text-lg leading-relaxed">{{ displayPost.description }}</p>
          </div>

          <!-- Render the actual markdown content if available, otherwise show fallback -->
          <div v-if="post && post.html">
            <div v-html="post.html" class="prose prose-lg max-w-none dark:prose-invert"></div>
          </div>
          <div v-else>
            <!-- Fallback content -->
            <div v-if="displayPost.slug === 'neighborhood-safety-evaluation'">
              <h2>Understanding Crime Statistics</h2>
              <p>When evaluating a neighborhood, crime statistics provide crucial insights into the safety and security of an area. Our comprehensive analysis tools help you access up-to-date crime data to make informed decisions about your potential new home.</p>
              
              <h3>Key Safety Metrics to Consider</h3>
              <ul>
                <li><strong>Property crime rates:</strong> Break-ins, theft, and vandalism statistics</li>
                <li><strong>Violent crime statistics:</strong> Assault, robbery, and other violent incidents</li>
                <li><strong>Police response times:</strong> Average emergency response in the area</li>
                <li><strong>Neighborhood watch programs:</strong> Community safety initiatives</li>
                <li><strong>Street lighting and visibility:</strong> Physical safety infrastructure</li>
              </ul>

              <h3>How to Interpret Safety Data</h3>
              <p>Understanding crime statistics requires context. Compare rates to:</p>
              <ul>
                <li>City-wide averages</li>
                <li>Similar demographic areas</li>
                <li>Historical trends over time</li>
                <li>Seasonal variations</li>
              </ul>

              <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 my-6">
                <h4 class="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">💡 Pro Tip</h4>
                <p class="text-yellow-700 dark:text-yellow-300">Visit the neighborhood at different times of day and week to get a real feel for the area's safety and atmosphere.</p>
              </div>
            </div>
            <div v-else>
              <h2>Content coming soon...</h2>
              <p>This blog post content is being updated. Please check back later for the full article.</p>
            </div>
          </div>

          <h2>Next Steps</h2>
          <p>Ready to apply these insights to your property search? Use our comprehensive analysis tools to evaluate properties based on the factors that matter most to you.</p>
          
          <div class="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
            <h4 class="text-primary font-semibold mb-2">🚀 Get Started</h4>
            <p class="text-foreground mb-4">Try our property analysis tool with a sample address to see these insights in action.</p>
            <NuxtLink to="/" class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Start Property Search
              <ChevronRightIcon class="w-4 h-4 ml-2" />
            </NuxtLink>
          </div>
        </article>

        <!-- Related Posts -->
        <section class="mt-16 border-t border-border pt-8">
          <h3 class="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article 
              v-for="relatedPost in relatedPosts" 
              :key="relatedPost.slug"
              class="group bg-card/50 backdrop-blur rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div class="aspect-video overflow-hidden">
                <img 
                  :src="relatedPost.image" 
                  :alt="relatedPost.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div class="p-4">
                <h4 class="font-semibold text-card-foreground mb-2 line-clamp-2">{{ relatedPost.title }}</h4>
                <p class="text-muted-foreground text-sm line-clamp-2 mb-3">{{ relatedPost.description }}</p>
                <NuxtLink 
                  :to="`/blog/${relatedPost.slug}`"
                  class="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                >
                  Read more
                  <ChevronRightIcon class="w-4 h-4 ml-1" />
                </NuxtLink>
              </div>
            </article>
          </div>
        </section>
      </div>

      <!-- 404 State -->
      <div v-else class="text-center py-16">
        <h1 class="text-4xl font-bold text-foreground mb-4">Post Not Found</h1>
        <p class="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
        <NuxtLink 
          to="/blog"
          class="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Blog
          <ChevronRightIcon class="w-4 h-4 ml-2" />
        </NuxtLink>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-4 bg-card text-center text-muted-foreground text-sm border-t border-border">
      © {{ new Date().getFullYear() }} CliQ Property Insights
    </footer>
  </div>
</template>

<script setup>
import { computed, watchEffect, watch, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/ui/Header.vue'
import { ChevronRightIcon, ShieldCheckIcon, DropletIcon, HeartPulseIcon, GraduationCapIcon, CarIcon } from 'lucide-vue-next'
import { useBlog } from '@/composables/useBlog'

const route = useRoute()
const router = useRouter()

const iconMap = {
  'ShieldCheckIcon': ShieldCheckIcon,
  'DropletIcon': DropletIcon,
  'HeartPulseIcon': HeartPulseIcon,
  'GraduationCapIcon': GraduationCapIcon,
  'CarIcon': CarIcon,
  'ChevronRightIcon': ChevronRightIcon
}

// Use the blog composable
const { getPostBySlug, getRelatedPosts, loading, error } = useBlog()

const post = ref(null)
const relatedPosts = ref([])
const postError = ref(null)

// Load post and related posts
onMounted(async () => {
  try {
    console.log('Looking for post with slug:', route.params.slug)
    
    // Get the specific post
    const foundPost = await getPostBySlug(route.params.slug)
    post.value = foundPost
    
    if (foundPost) {
      // Get related posts
      const related = await getRelatedPosts(route.params.slug, 2)
      relatedPosts.value = related
    } else {
      postError.value = 'Post not found'
    }
  } catch (err) {
    console.error('Error loading post:', err)
    postError.value = err.message
  }
})

// Debug logging
watch(post, (newPost) => {
  console.log('Post loaded:', newPost)
  console.log('Route slug:', route.params.slug)
  console.log('Post error:', postError.value)
}, { immediate: true })

// Fallback data for each post
const fallbackData = {
  'neighborhood-safety-evaluation': {
    _path: '/blog/neighborhood-safety-evaluation',
    slug: 'neighborhood-safety-evaluation',
    title: 'Evaluate Neighborhood Safety',
    description: 'Access comprehensive, up-to-date crime statistics to assess the safety of the area. Choose secure locations and make confident decisions knowing the security level of your potential new neighborhood.',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&auto=format',
    category: 'Safety',
    categoryClass: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    icon: 'ShieldCheckIcon',
    readTime: 5,
    date: '2024-12-15',
    published: true
  },
  'flood-risk-assessment': {
    _path: '/blog/flood-risk-assessment',
    slug: 'flood-risk-assessment',
    title: 'Assess Flood Risk Levels',
    description: 'Evaluate flood risk levels for properties using detailed historical data to avoid future surprises. Protect your investment by selecting homes in areas less prone to flooding to safeguard your property.',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&auto=format',
    category: 'Risk Assessment',
    categoryClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    icon: 'DropletIcon',
    readTime: 7,
    date: '2024-12-12',
    published: true
  },
  'healthcare-facilities-proximity': {
    _path: '/blog/healthcare-facilities-proximity',
    slug: 'healthcare-facilities-proximity',
    title: 'Locate Nearby Healthcare Facilities',
    description: 'Ensure you and your family have quick access to medical care when needed. Understand the proximity and response times of emergency services for added peace of mind.',
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop&auto=format',
    category: 'Healthcare',
    categoryClass: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    icon: 'HeartPulseIcon',
    readTime: 4,
    date: '2024-12-10',
    published: true
  },
  'schools-and-shopping-access': {
    _path: '/blog/schools-and-shopping-access',
    slug: 'schools-and-shopping-access',
    title: 'Find Nearby Schools and Shops',
    description: 'Discover educational institutions and shopping centers close to your potential home. Explore dining and entertainment options to identify local restaurants, cafes, and entertainment venues to suit your lifestyle.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&auto=format',
    category: 'Amenities',
    categoryClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    icon: 'GraduationCapIcon',
    readTime: 6,
    date: '2024-12-08',
    published: true
  },
  'transportation-accessibility': {
    _path: '/blog/transportation-accessibility',
    slug: 'transportation-accessibility',
    title: 'Explore Multiple Travel Modes',
    description: 'Assess accessibility using walking, cycling, driving, or public transit. Plan your commute and see travel times to key locations based on your preferred mode of travel.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop&auto=format',
    category: 'Transportation',
    categoryClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    icon: 'CarIcon',
    readTime: 8,
    date: '2024-12-05',
    published: true
  },
  'property-investment-tips': {
    _path: '/blog/property-investment-tips',
    slug: 'property-investment-tips',
    title: 'Smart Property Investment Strategies',
    description: 'Learn proven strategies for property investment success. Discover how to analyze market trends, calculate returns, and make informed decisions that maximize your investment potential.',
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=600&fit=crop&auto=format',
    category: 'Investment',
    categoryClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    icon: 'ChevronRightIcon',
    readTime: 10,
    date: '2024-12-03',
    published: true
  }
}

// Use fallback if content doesn't load
const displayPost = computed(() => {
  if (post.value) {
    return post.value
  }
  console.log('Using fallback data for:', route.params.slug)
  return fallbackData[route.params.slug] || null
})

// dynamic metadata
watchEffect(() => {
  if (displayPost.value) {
    useHead({
      title: `${displayPost.value.title} - CliQ Property Blog`,
      meta: [
        { name: 'description', content: displayPost.value.description }
      ]
    })
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose {
  color: hsl(var(--foreground));
}

.prose h2 {
  color: hsl(var(--foreground));
  font-size: 1.5em;
  font-weight: 700;
  margin-top: 2em;
  margin-bottom: 1em;
}

.prose h3 {
  color: hsl(var(--foreground));
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}

.prose h4 {
  color: hsl(var(--foreground));
  font-size: 1.1em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.prose p {
  margin-bottom: 1.25em;
  line-height: 1.75;
}

.prose ul {
  margin: 1.25em 0;
  padding-left: 1.625em;
}

.prose li {
  margin: 0.5em 0;
}

.prose strong {
  color: hsl(var(--foreground));
  font-weight: 600;
}
</style>
