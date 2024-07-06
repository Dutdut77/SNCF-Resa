<script setup>
import Home from "@/assets/svg/Home.vue";
import Calendar from "@/assets/svg/Calendar.vue";
import User from "@/assets/svg/User.vue";
import Bandage from "@/assets/svg/Bandage.vue";
import Add from "@/assets/svg/Add.vue";
</script>

<template>
  <section class="w-full h-20 bg-gray-700">
    <div class="h-14 flex justify-around items-center text-gray-400 border-t border-gray-600 px-4">
      <NuxtLink to="/home" class="relative group flex flex-col items-center flex-1 h-full justify-center">
        <div class="h-[3px] bg-sky-500 absolute -top-0.5 left-0 right-0 group-hover:w-full duration-500 rounded-full" :class="'/home' === $route.path ? 'w-full' : 'w-0'"></div>
        <Home class="h-6 w-6 group-hover:text-gray-200 duration-200" />
        <p class="text-xs pt-0.5 group-hover:text-gray-200 duration-200">Accueil</p>
      </NuxtLink>

      <NuxtLink to="/calendar" class="relative group flex flex-col items-center flex-1 h-full justify-center">
        <div class="h-[3px] bg-sky-500 absolute -top-0.5 left-0 right-0 group-hover:w-full duration-500 rounded-full" :class="'/calendar' === $route.path ? 'w-full' : 'w-0'"></div>
        <Calendar class="h-6 w-6 group-hover:text-gray-200 duration-200" />
        <p class="text-xs pt-0.5 group-hover:text-gray-200 duration-200">Calendrier</p>
      </NuxtLink>

      <NuxtLink to="/reservation" class="w-14 h-14 flex justify-center items-center rounded-full bg-gradient-to-br from-sky-700 to-sky-500 -mt-14 mx-2 hover:shadow-xl shadow-black duration-200">
        <Add class="h-8 w-8 text-white" />
      </NuxtLink>

      <NuxtLink to="/profil" class="relative group flex flex-col items-center flex-1 h-full justify-center">
        <div class="h-[3px] bg-sky-500 absolute -top-0.5 left-0 right-0 group-hover:w-full duration-500 rounded-full" :class="'/profil' === $route.path ? 'w-full' : 'w-0'"></div>
        <User class="h-6 w-6 group-hover:text-gray-200 duration-200" />
        <p class="text-xs pt-0.5 group-hover:text-gray-200 duration-200">Profil</p>
      </NuxtLink>

      <NuxtLink to="/anomalies" class="relative group flex flex-col items-center flex-1 h-full justify-center">
        <div class="h-[3px] bg-sky-500 absolute -top-0.5 left-0 right-0 group-hover:w-full duration-500 rounded-full" :class="'/anomalies' === $route.path ? 'w-full' : 'w-0'"></div>
        <Bandage class="h-6 w-6 group-hover:text-gray-200 duration-200" />
        <p class="text-xs pt-0.5 group-hover:text-gray-200 duration-200">Anomalies</p>
      </NuxtLink>
    </div>
  </section>
</template>
