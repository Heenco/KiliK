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
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-primary/10 to-background px-4">
    <div class="w-full max-w-md shadow-xl border-0 rounded-2xl bg-white/90 dark:bg-background/80 backdrop-blur">
      <div class="mb-2 px-8 pt-8">
        <h2 class="text-center text-3xl font-extrabold tracking-tight text-primary">Sign in</h2>
        <p class="text-center text-muted-foreground mt-2">Access your account to continue</p>
      </div>
      <div class="px-8 pb-8">
        <form @submit.prevent="handleEmailSignIn" class="flex flex-col gap-3 items-center">
          
          <input v-model="email" id="email" type="email" placeholder="you@email.com" required autofocus class="input-auth" />
          
          <input v-model="password" id="password" type="password" placeholder="Password" required class="input-auth" />
          <button :disabled="loading" type="submit" class="btn-auth mt-2 w-full">Sign in with Email</button>
        </form>
        <div v-if="errorMsg" class="mt-3 text-red-500 text-sm text-center">{{ errorMsg }}</div>
        <div class="my-6 flex items-center justify-center">
          <span class="h-px flex-1 bg-muted"></span>
          <span class="px-3 text-xs text-muted-foreground">OR CONTINUE WITH</span>
          <span class="h-px flex-1 bg-muted"></span>
        </div>
        <div class="flex flex-col gap-3">
          
          <button class="btn-auth-outline w-full flex items-center justify-center" @click="signInWithProvider('google')">
            <Icon name="google" class="mr-2" /> Google
          </button>
        </div>
        <div class="flex flex-col items-center mt-6">
          <span class="text-xs text-muted-foreground">Don't have an account?
            <NuxtLink to="/signup" class="text-primary underline ml-1">Sign up</NuxtLink>
          </span>
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
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.03);
  background: #fff;
  transition: border 0.2s;
}
.input-auth:focus {
  border: 1.5px solid #6366f1;
  outline: none;
}
.dark .input-auth {
  background: #18181b;
  border: 1px solid #27272a;
  color: #fff;
}
.btn-auth {
  background: #18181b;
  color: #fff;
  font-weight: 600;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  transition: background 0.2s;
}
.btn-auth:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.btn-auth-outline {
  background: #fff;
  color: #18181b;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
  transition: background 0.2s, border 0.2s;
}
.btn-auth-outline:hover {
  background: #f3f4f6;
  border: 1.5px solid #6366f1;
}
.dark .btn-auth-outline {
  background: #18181b;
  color: #fff;
  border: 1px solid #27272a;
}
.bg-gradient-to-br {
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
}
.dark .bg-gradient-to-br {
  background: linear-gradient(135deg, #18181b 0%, #27272a 100%);
}
</style>
