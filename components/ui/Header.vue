<template>  <header    class="fixed top-0 left-0 w-full z-20 flex items-center px-6 py-2 border-b glassmorphism transition-all duration-300"
    :class="{ 'translate-y-0 opacity-100': isVisible, '-translate-y-full opacity-0': !isVisible }">    <div class="container mx-auto flex items-center justify-between">      <div class="logo-container ml-0 md:ml-4">        <div class="font-outfit text-2xl md:text-3xl font-black tracking-tight text-white flex items-center relative">
          <span class="text-shadow logo-text">Kili<span class="text-green-400 font-black">K</span></span>
          <span class="text-xxs absolute -top-2 -right-5 text-gray-400 tracking-wider font-medium bg-gray-800/60 px-0.5 py-0.5 rounded-sm beta-tag">BETA</span>
        </div>
      </div>        <div class="relative">
        <!-- Always show the dropdown menu, but content changes based on auth status -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="p-3 rounded-full hover:bg-gray-800/60 focus:outline-none text-white border border-gray-800/40 shadow-sm transition-all duration-300">
              <div class="hamburger-menu">
                <div class="hamburger-line"></div>
                <div class="hamburger-line"></div>
                <div class="hamburger-line"></div>
              </div>
            </button>
          </DropdownMenuTrigger>          <DropdownMenuContent align="end" class="w-96 max-h-60 overflow-y-auto bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-xl backdrop-blur dropdown-menu-content">
            <!-- Show user info and sign out button when signed in -->
            <template v-if="user">
              <div class="flex flex-col gap-1 p-6 pb-8 border-b border-gray-800">
                <div class="font-semibold text-base mb-2 text-white">{{ user?.user_metadata?.full_name || user?.email }}</div>
                <div class="text-xs text-gray-400 break-all">{{ user?.email }}</div>
              </div>
                <!-- Navigation Links -->
              <div class="py-3 px-4 border-b border-gray-800">
                <div class="text-sm text-gray-400 mb-2">Navigation</div>
                <div class="grid grid-cols-2 gap-2">
                  <NuxtLink to="/map" class="p-2 rounded hover:bg-gray-800 text-white text-sm">Map</NuxtLink>
                  <NuxtLink to="/analysis" class="p-2 rounded hover:bg-gray-800 text-white text-sm">Analysis</NuxtLink>
                </div>
              </div>
              
              <div class="py-3"></div> <!-- Extra space above sign out button -->
              <DropdownMenuItem as-child class="p-4">
                <Button @click="signOut" class="w-full text-left mt-2 bg-gray-900 hover:bg-gray-800 text-white border border-gray-800 transition-all duration-300 hover:border-green-400/50 hover:shadow-green">Sign Out</Button>
              </DropdownMenuItem>
            </template>
            <!-- Show sign in button when not signed in -->
            <template v-else>
              <div class="flex flex-col gap-1 p-6 pb-8 border-b border-gray-800">
                <div class="font-semibold text-base mb-2 text-white">Welcome to CliQ</div>
                <div class="text-xs text-gray-400">Sign in to access your account</div>
              </div>
              <div class="py-3"></div> <!-- Extra space above sign in button -->
              <DropdownMenuItem as-child class="p-4">
                <Button @click="signIn" class="w-full text-left mt-2 bg-gray-900 hover:bg-gray-800 text-white border border-gray-800 transition-all duration-300 hover:border-green-400/50 hover:shadow-green">Sign In</Button>
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

// Setup scroll event listeners
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

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

/* Hamburger menu styling */
.hamburger-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 18px;
  height: 14px;
}

.hamburger-line {
  width: 100%;
  height: 2px;
  background-color: white;
  border-radius: 1px;
  transition: all 0.2s ease;
}

/* Hover effect for hamburger lines */
button:hover .hamburger-line {
  background-color: rgba(74, 222, 128, 0.9);
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
