<script setup lang="ts">
import Icon from '~/components/ui/Icon.vue'

const user = useSupabaseUser()
const { auth } = useSupabaseClient()
const redirectTo = `${useRuntimeConfig().public.baseUrl || ''}/confirm`

watchEffect(() => {
  if (user.value) {
    navigateTo('/')
  }
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleEmailSignIn() {
  loading.value = true
  errorMsg.value = ''
  const { error } = await auth.signInWithPassword({ email: email.value, password: password.value })
  loading.value = false
  if (error) {
    errorMsg.value = error.message
  }
}

function signInWithProvider(provider: 'github' | 'google') {
  auth.signInWithOAuth({ provider, options: { redirectTo } })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 property-background">
    <div class="property-grid"></div>
    <div class="min-h-screen flex flex-col justify-center items-center px-4 relative z-10">
      <div class="w-full max-w-md shadow-xl border border-gray-700 rounded-2xl bg-gray-900/80 backdrop-blur">
        <div class="mb-2 px-8 pt-8">
          <h2 class="text-center text-3xl font-extrabold tracking-tight text-white">Sign in</h2>
          <p class="text-center text-gray-300 mt-2">Access your account to continue</p>
        </div>
        <div class="px-8 pb-8">
          <form @submit.prevent="handleEmailSignIn" class="flex flex-col gap-3 items-center">
            
            <input 
              v-model="email" 
              id="email" 
              type="email" 
              placeholder="you@email.com" 
              required 
              autofocus 
              class="input-auth" 
            />
            
            <input 
              v-model="password" 
              id="password" 
              type="password" 
              placeholder="Password" 
              required 
              class="input-auth" 
            />
            <button 
              :disabled="loading" 
              type="submit" 
              class="btn-auth mt-2 w-full"
            >
              Sign in with Email
            </button>
          </form>
          <div v-if="errorMsg" class="mt-3 text-red-400 text-sm text-center">{{ errorMsg }}</div>
          <div class="my-6 flex items-center justify-center">
            <span class="h-px flex-1 bg-gray-600"></span>
            <span class="px-3 text-xs text-gray-400">OR CONTINUE WITH</span>
            <span class="h-px flex-1 bg-gray-600"></span>
          </div>
          <div class="flex flex-col gap-3">
            
            <button class="btn-auth-outline w-full flex items-center justify-center" @click="signInWithProvider('google')">
              <Icon name="google" class="mr-2" /> Google
            </button>
          </div>
          <div class="flex flex-col items-center mt-6">
            <span class="text-xs text-gray-400">Don't have an account?
              <NuxtLink to="/signup" class="text-green-400 hover:text-green-300 underline ml-1 transition-colors">Sign up</NuxtLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-auth {
  max-width: 320px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #374151;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.3);
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(10px);
  color: #fff;
  transition: all 0.3s ease;
}

.input-auth::placeholder {
  color: #9ca3af;
}

.input-auth:focus {
  border: 1.5px solid #4ade80;
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.1);
  background: rgba(31, 41, 55, 0.7);
}

.btn-auth {
  background: #22c55e;
  color: #000;
  font-weight: 600;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-auth:hover:not(:disabled) {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.4);
}

.btn-auth:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-auth-outline {
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid #374151;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-auth-outline:hover {
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid #4ade80;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Property Blueprint Background - matching index page */
.property-background {
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.property-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  opacity: 0.15;
  background-image: 
    /* Blueprint grid lines */
    linear-gradient(to right, rgba(66, 153, 225, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(66, 153, 225, 0.1) 1px, transparent 1px),
    /* Room outlines */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M100,100 L100,250 L200,250 L200,180 L280,180 L280,100 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M300,300 L300,400 L400,400 L400,300 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M80,300 L80,380 L180,380 L180,300 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.15)' stroke-width='1.5' d='M200,100 L240,60 L420,60 L420,180 L380,180 L380,120 L280,120'/%3E%3C/svg%3E"),
    /* Location pins for properties */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Ccircle cx='150' cy='150' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='450' cy='250' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='300' cy='420' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='100' cy='350' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='500' cy='100' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='400' cy='500' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3C/svg%3E");
  background-size: 40px 40px, 40px 40px, 1000px 1000px, 1200px 1200px;
  background-position: center center;
}

/* Property data visualization animation */
@keyframes dataFlow {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0.15;
  }
  50% {
    opacity: 0.25;
  }
  100% {
    transform: translateY(-10px) translateX(-10px);
    opacity: 0.15;
  }
}

.property-grid {
  animation: dataFlow 20s infinite alternate ease-in-out;
}

/* Transition effects for links */
.transition-colors {
  transition: color 0.3s ease;
}
</style>
