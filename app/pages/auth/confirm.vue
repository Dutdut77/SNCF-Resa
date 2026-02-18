<script setup>
definePageMeta({ requiresAuth: false, layout: false });

const supabase = useSupabaseClient();
const route = useRoute();
const { addToast } = useToast();

const status = ref("loading"); // loading | success | error

onMounted(async () => {
  const tokenHash = route.query.token_hash;
  const type = route.query.type;

  if (!tokenHash || !type) {
    status.value = "error";
    return;
  }

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    status.value = "error";
    addToast({ type: "Error", title: "Erreur", message: error.message });
    return;
  }

  status.value = "success";

  if (type === "recovery") {
    addToast({ type: "Success", title: "Lien vérifié", message: "Définissez votre nouveau mot de passe." });
    await navigateTo("/reset-password");
  } else {
    addToast({ type: "Success", title: "Email confirmé", message: "Votre compte est activé, vous pouvez vous connecter." });
    await navigateTo("/login");
  }
});
</script>

<template>
  <div class="flex h-dvh items-center justify-center bg-slate-50">
    <div class="text-center">
      <p v-if="status === 'loading'" class="text-slate-600">Vérification en cours...</p>
      <div v-else-if="status === 'error'" class="flex flex-col items-center gap-4">
        <p class="text-red-600 font-semibold">Le lien est invalide ou a expiré.</p>
        <NuxtLink to="/login" class="text-sm text-slate-500 underline hover:text-slate-700">Retour à la connexion</NuxtLink>
      </div>
    </div>
  </div>
</template>
