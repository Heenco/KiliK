<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
      <div class="text-lg font-semibold mb-2">Signing you in...</div>
      <div class="text-gray-500">Please wait while we complete your authentication.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useNuxtApp } from '#app';
import type { SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';

const router = useRouter();
const { $supabase } = useNuxtApp();
const supabase = $supabase as SupabaseClient;

onMounted(async () => {
  try {
    // If the code is in the hash, convert it to a query string
    let url = window.location.origin + window.location.pathname + window.location.search;
    if (window.location.hash && window.location.hash.startsWith('#')) {
      // Convert hash to query string
      url += window.location.hash.replace('#', '?');
    }

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(url);

    // Clean up the URL to remove sensitive information
    window.history.replaceState({}, document.title, window.location.pathname);

    if (!error) {
      const { data: { session } = {} } = await supabase.auth.getSession();
      if (session) {
        document.cookie = `sb-access-token=${session.access_token}; path=/;`;
        document.cookie = `sb-refresh-token=${session.refresh_token}; path=/;`;
      }
      router.replace('/');
    } else {
      router.replace('/signin?error=oauth');
    }
  } catch (e) {
    router.replace('/signin?error=oauth');
  }
});
</script>
