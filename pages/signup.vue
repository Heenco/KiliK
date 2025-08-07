<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Sign Up</h1>
      <form @submit.prevent="handleSignUp">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Email</label>
          <input v-model="email" type="email" required class="w-full px-3 py-2 border rounded" />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 mb-2">Password</label>
          <input v-model="password" type="password" required class="w-full px-3 py-2 border rounded" />
        </div>
        <button type="submit" class="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition">Sign Up</button>
        <button type="button" @click="handleGoogleSignIn" class="w-full mt-4 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded font-semibold hover:bg-gray-100 transition">
          <svg class="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.7 30.77 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.99 6.2C12.36 13.13 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.68 28.29c-1.13-3.36-1.13-6.97 0-10.33l-7.99-6.2C.64 15.1 0 19.45 0 24c0 4.55.64 8.9 2.69 12.24l7.99-6.2z"/><path fill="#EA4335" d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.19-5.6c-2.01 1.35-4.59 2.15-8.7 2.15-6.26 0-11.64-3.63-14.32-8.89l-7.99 6.2C6.73 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Sign up with Google
        </button>
        <div v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</div>
        <div v-if="success" class="text-green-600 mt-4 text-center">Sign up successful! Please check your email to confirm.</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import type { SupabaseClient } from '@supabase/supabase-js';

const email = ref('');
const password = ref('');
const error = ref('');
const success = ref(false);
const { $supabase } = useNuxtApp();
const supabase = $supabase as SupabaseClient;

async function handleSignUp() {
  error.value = '';
  success.value = false;
  const { data, error: signUpError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });
  if (signUpError) {
    error.value = signUpError.message;
  } else {
    success.value = true;
  }
}

async function handleGoogleSignIn() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) {
    console.error('Google Sign-Up Error:', error.message);
  }
}
</script>
