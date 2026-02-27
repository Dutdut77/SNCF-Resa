<script setup>
const modalFooter = ref(false);
const showModalFooter = () => {
  modalFooter.value = !modalFooter.value;
};
</script>

<template>
  <section class="w-full h-full flex justify-between items-center px-8 print:hidden bg-transparent border-t border-slate-200/60">
    <div class="text-xs text-slate-500 flex-1 flex gap-2">
      Copyright © 2024
      <p class="hidden lg:block">- Tous droits réservés</p>
    </div>
    <div class="text-xs text-slate-500 hover:text-sky-600 transition-colors h-full flex-1 flex justify-end items-center cursor-pointer" @click="showModalFooter()">Mentions légales</div>

    <Teleport class="" to="body">
      <AppModal class="h-full" v-if="modalFooter" :closeModal="showModalFooter">
        <template #title>
          <div class="flex items-center gap-3 w-full px-2">
            <div class="size-9 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
              <Icon name="material-symbols:gavel" size="20" class="text-sky-500" />
            </div>
            <div>
              <p class="text-[10px] text-slate-400 uppercase tracking-wider font-normal">RésaPro</p>
              <p class="text-base font-semibold text-slate-800 leading-tight">Mentions légales</p>
            </div>
          </div>
        </template>

        <template #default>
          <div class="w-full max-h-[60vh] overflow-auto flex flex-col gap-6 px-4 pb-2">
            <!-- 1 - Édition du site -->
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-2.5">
                <div class="size-6 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0">
                  <span class="text-[10px] font-bold text-sky-600">1</span>
                </div>
                <p class="text-xs font-semibold text-slate-600 uppercase tracking-wider">Édition du site</p>
              </div>
              <p class="text-sm text-slate-500 leading-relaxed pl-8">Conformément aux dispositions des articles 6-III et 19 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique, il est précisé aux utilisateurs du site internet https://h00.infpe.fr l’identité des différents intervenants dans le cadre de sa réalisation et de son suivi :</p>
              <div class="ml-8 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span class="text-slate-400 font-medium">Propriétaire</span><span class="text-slate-700">GRANDMAIRE Nicolas - Applissimo EI</span> <span class="text-slate-400 font-medium">Contact</span><span class="text-slate-700">ng.siteweb@gmail.com · 06 84 59 37 45</span> <span class="text-slate-400 font-medium">Adresse</span
                ><span class="text-slate-700">48 rue de Bouleurs, 77580 Crécy la Chapelle</span> <span class="text-slate-400 font-medium">Entreprise</span><span class="text-slate-700">GRANDMAIRE Nicolas - Applissimo EI</span> <span class="text-slate-400 font-medium">Publication</span><span class="text-slate-700">GRANDMAIRE Nicolas · ng.siteweb@gmail.com</span>
                <span class="text-slate-400 font-medium">Hébergeur web</span><span class="text-slate-700">Vercel Inc. · 440 N Barranca Ave #4133, Covina CA 91723</span> <span class="text-slate-400 font-medium">Hébergeur BDD</span><span class="text-slate-700">Supabase · 970 Toa Payoh North #07-04, Singapore 318992</span> <span class="text-slate-400 font-medium">DPO</span
                ><span class="text-slate-700">GRANDMAIRE Nicolas · ng.siteweb@gmail.com</span>
              </div>
            </div>

            <!-- Séparateur -->
            <div class="border-t border-slate-100" />

            <!-- 2 - Propriété intellectuelle -->
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-2.5">
                <div class="size-6 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0">
                  <span class="text-[10px] font-bold text-sky-600">2</span>
                </div>
                <p class="text-xs font-semibold text-slate-600 uppercase tracking-wider">Propriété intellectuelle et contrefaçons</p>
              </div>
              <p class="text-sm text-slate-500 leading-relaxed text-justify pl-8">
                GRANDMAIRE Nicolas - Applissimo EI est propriétaire des droits de propriété intellectuelle et détient les droits d’usage sur tous les éléments accessibles sur le site internet, notamment les textes, images, graphismes, logos, vidéos, architecture, icônes et sons. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel
                que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de GRANDMAIRE Nicolas - Applissimo EI.
              </p>
            </div>

            <div class="border-t border-slate-100" />

            <!-- 3 - Limitations -->
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-2.5">
                <div class="size-6 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0">
                  <span class="text-[10px] font-bold text-sky-600">3</span>
                </div>
                <p class="text-xs font-semibold text-slate-600 uppercase tracking-wider">Limitations de responsabilité</p>
              </div>
              <p class="text-sm text-slate-500 leading-relaxed text-justify pl-8">
                GRANDMAIRE Nicolas - Applissimo EI ne pourra être tenu pour responsable des dommages directs et indirects causés au matériel de l’utilisateur lors de l’accès au site. GRANDMAIRE Nicolas - Applissimo EI décline toute responsabilité quant à l’utilisation qui pourrait être faite des informations et contenus présents sur https://h00.infpe.fr.
              </p>
            </div>

            <div class="border-t border-slate-100" />

            <!-- 4 - CNIL -->
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-2.5">
                <div class="size-6 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0">
                  <span class="text-[10px] font-bold text-sky-600">4</span>
                </div>
                <p class="text-xs font-semibold text-slate-600 uppercase tracking-wider">CNIL et gestion des données personnelles</p>
              </div>
              <p class="text-sm text-slate-500 leading-relaxed text-justify pl-8">Conformément aux dispositions de la loi 78-17 du 6 janvier 1978 modifiée, l’utilisateur dispose d’un droit d’accès, de modification et de suppression des informations collectées. Pour exercer ce droit : <span class="text-sky-600 font-medium">ng.siteweb@gmail.com</span>.</p>
            </div>

            <div class="border-t border-slate-100" />

            <!-- 5 - Cookies -->
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-2.5">
                <div class="size-6 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0">
                  <span class="text-[10px] font-bold text-sky-600">5</span>
                </div>
                <p class="text-xs font-semibold text-slate-600 uppercase tracking-wider">Liens hypertextes et cookies</p>
              </div>
              <p class="text-sm text-slate-500 leading-relaxed text-justify pl-8">La navigation sur le site https://h00.infpe.fr est susceptible de provoquer l’installation de cookies exclusivement destinés à l’authentification. L’utilisateur peut configurer son navigateur pour refuser les cookies, au risque que certaines fonctionnalités ne soient plus disponibles.</p>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-end px-2">
            <button class="text-xs text-slate-400 hover:text-slate-600 transition-colors" @click="showModalFooter()">Fermer</button>
          </div>
        </template>
      </AppModal>
    </Teleport>
  </section>
</template>

<style scoped></style>
