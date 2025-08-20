<template>  <header    
    class="fixed top-0 left-0 w-full z-20 flex items-center px-1 py-1.5 border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300"
    :class="{ 'translate-y-0 opacity-100': isVisible, '-translate-y-full opacity-0': !isVisible }"
  ><div class="w-full flex items-center justify-between px-4">      <div class="logo-container">        <NuxtLink to="/" class="font-outfit text-2xl md:text-3xl font-black tracking-tight text-foreground flex items-center relative cursor-pointer">
          <span class="text-shadow logo-text"><span class="text-green-400 font-black">Safe</span>Buy</span>
          <span class="text-xxs absolute -top-1 -right-5 text-muted-foreground tracking-wider font-medium bg-muted px-0.5 py-0.5 rounded-sm beta-tag">BETA</span>
        </NuxtLink>
      </div>        <div class="relative">
        <!-- Always show the dropdown menu, but content changes based on auth status -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="p-2 hover:bg-accent focus:outline-none transition-all duration-200 flex items-center justify-center">
              <div class="flex flex-col space-y-0.5">
                <div class="w-1 h-1 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
                <div class="w-1 h-1 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
                <div class="w-1 h-1 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
              </div>
            </button>
          </DropdownMenuTrigger>          <DropdownMenuContent align="end" class="w-64 mt-2 bg-popover border border-border shadow-xl backdrop-blur dropdown-menu-content">
            <!-- Show user info and sign out button when signed in -->
            <template v-if="user">
              <div class="flex flex-col gap-1 p-4 pb-4 border-b border-border">
                <div class="font-medium text-sm mb-1 text-foreground">{{ user?.user_metadata?.full_name || user?.email }}</div>
                <div class="text-xs text-muted-foreground break-all">{{ user?.email }}</div>
              </div>
                <!-- Navigation Links -->
              <div class="py-2 px-3 border-b border-border">
                <div class="text-xs text-muted-foreground mb-2">Navigation</div>
                <div class="grid grid-cols-2 gap-2">
                  <NuxtLink to="/blog" class="p-2 rounded hover:bg-accent text-foreground text-xs">Blog</NuxtLink>
                  <NuxtLink to="/map" class="p-2 rounded hover:bg-accent text-foreground text-xs">Map</NuxtLink>
                  <NuxtLink to="/analysis" class="p-2 rounded hover:bg-accent text-foreground text-xs">Analysis</NuxtLink>
                  <NuxtLink to="/products" class="p-2 rounded hover:bg-accent text-foreground text-xs">Pricing</NuxtLink>
                </div>
              </div>
              
              <!-- Theme Toggle moved down -->
              <div class="p-3 border-b border-border">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-muted-foreground">Theme</span>
                  <button 
                    @click="toggleTheme"
                    class="p-1 hover:bg-accent/50 rounded transition-all duration-200"
                    :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
                  >
                    <svg v-if="isDarkMode" class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="py-2"></div> <!-- Extra space above sign out button -->
              <DropdownMenuItem as-child class="p-3">
                <Button @click="signOut" class="w-full text-left text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border transition-all duration-300 hover:border-ring hover:shadow-md">Sign Out</Button>
              </DropdownMenuItem>
            </template>
            <!-- Show sign in button when not signed in -->
            <template v-else>
              <div class="flex flex-col gap-1 p-4 pb-4 border-b border-border">
                <div class="font-medium text-sm mb-1 text-foreground">Welcome to KiliK</div>
                <div class="text-xs text-muted-foreground">Sign in to access your account</div>
              </div>
              
              <!-- Navigation Links for non-authenticated users -->
              <div class="py-2 px-3 border-b border-border">
                <div class="text-xs text-muted-foreground mb-2">Explore</div>
                <div class="grid grid-cols-2 gap-2">
                  <NuxtLink to="/blog" class="p-2 rounded hover:bg-accent text-foreground text-xs">Blog</NuxtLink>
                  <NuxtLink to="/products" class="p-2 rounded hover:bg-accent text-foreground text-xs">Pricing</NuxtLink>
                  <NuxtLink to="/index2" class="p-2 rounded hover:bg-accent text-foreground text-xs">Vision</NuxtLink>
                  <NuxtLink to="/" class="p-2 rounded hover:bg-accent text-foreground text-xs">Search</NuxtLink>
                </div>
              </div>
              
              <!-- Theme Toggle moved down -->
              <div class="p-3 border-b border-border">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-muted-foreground">Theme</span>
                  <button 
                    @click="toggleTheme"
                    class="p-1 hover:bg-accent/50 rounded transition-all duration-200"
                    :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
                  >
                    <svg v-if="isDarkMode" class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="py-2"></div> <!-- Extra space above sign in button -->
              <DropdownMenuItem as-child class="p-3">
                <Button @click="signIn" class="w-full text-left text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border transition-all duration-300 hover:border-ring hover:shadow-md">Sign In</Button>
              </DropdownMenuItem>
            </template>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useSupabaseUser, useSupabaseClient, ref, onMounted, onUnmounted } from '#imports'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const user = useSupabaseUser()
const { auth } = useSupabaseClient()

// Theme management
const isDarkMode = ref(false) // Start with light mode

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Store theme preference
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

// Initialize theme on component mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
  isDarkMode.value = savedTheme === 'dark';
  
  // Apply theme to document immediately
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

// Header visibility control
const isVisible = ref(true)
let lastScrollPosition = 0
const scrollThreshold = 50

const handleScroll = () => {
  const currentScrollPosition = window.scrollY
  
  // Determine if we're scrolling up or down
  if (currentScrollPosition < lastScrollPosition) {
    // Scrolling up, show the header
    isVisible.value = true
  } else if (currentScrollPosition > lastScrollPosition && currentScrollPosition > scrollThreshold) {
    // Scrolling down past threshold, hide the header
    isVisible.value = false
  }
  
  lastScrollPosition = currentScrollPosition
}

// Setup scroll event listeners - TEMPORARILY DISABLED FOR TESTING
// onMounted(() => {
//   window.addEventListener('scroll', handleScroll)
// })

// onUnmounted(() => {
//   window.removeEventListener('scroll', handleScroll)
// })

async function signOut() {
  await auth.signOut()
  window.location.href = '/signin'
}

function signIn() {
  window.location.href = '/signin'
}
</script>

<style scoped>
header { z-index: 100; }

.glassmorphism {
  background: rgba(15, 23, 42, 0.45);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-color: rgba(52, 211, 153, 0.1);
}

.logo-container {
  position: relative;
  margin-left: 0;
  padding-left: 0;
}

.font-outfit {
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.03em;
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.logo-text {
  position: relative;
  transition: all 0.3s ease;
}

.text-xxs {
  font-size: 0.45rem;
  line-height: 0.5rem;
}

.beta-tag {
  border: 0.5px solid rgba(74, 222, 128, 0.2);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.03em;
}

.logo-text:hover {
  transform: scale(1.05);
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.6);
}

@keyframes pulse-subtle {
  0% { opacity: 0.9; }
  50% { opacity: 1; }
  100% { opacity: 0.9; }
}

@keyframes float-subtle {
  0% { transform: translateY(0); }
  50% { transform: translateY(-0.5px); }
  100% { transform: translateY(0); }
}

.text-green-400 {
  text-shadow: 0 0 10px rgba(52, 211, 153, 0.4);
  animation: pulse-subtle 3s infinite;
}

.beta-tag {
  animation: float-subtle 4s ease-in-out infinite;
}

/* User dropdown styles */
:deep(.dropdown-menu-content) {
  border-radius: 0.75rem;
  overflow: hidden;
}

:deep(.dropdown-menu-content button) {
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

:deep(.dropdown-menu-content button:hover) {
  border-color: rgba(74, 222, 128, 0.5);
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.1);
}

.hover\:shadow-green:hover {
  box-shadow: 0 0 12px rgba(74, 222, 128, 0.15);
}

/* User info animation */
:deep(.dropdown-menu-content .flex) {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
