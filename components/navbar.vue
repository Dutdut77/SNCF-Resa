<script setup>
import Home from "@/assets/svg/Home.vue";
import Calendar from "@/assets/svg/Calendar.vue";
import User from "@/assets/svg/User.vue";
import Bandage from "@/assets/svg/Bandage.vue";
import Resa from "@/assets/svg/Resa.vue";
import Add from "@/assets/svg/Add.vue";
</script>

<template>
  <section class="w-full h-20 bg-slate-100">
    <div class="h-14 flex justify-around items-center text-gray-700 border-t border-gray-400 px-">
      <NuxtLink to="/home" class="relative group flex flex-col items-center flex-1 h-full justify-center">
        <!-- <div class="h-[3px] bg-sky-500 absolute -top-0.5 left-0 right-0 group-hover:w-full group-hover:duration-500 duration-200 rounded-full" :class="'/home' === $route.path ? 'w-full' : 'w-0'"></div> -->
        <Home class="h-6 w-6 group-hover:text-sky-500 duration-200" :class="'/home' === $route.path ? 'text-sky-500' : ''" />
        <p class="text-xs pt-0.5 group-hover:text-sky-500 duration-200" :class="'/home' === $route.path ? 'text-sky-500 font-medium' : ''">Accueil</p>
      </NuxtLink>

      <NuxtLink to="/calendar" class="relative group flex flex-col items-center flex-1 h-full justify-center">
        <!-- <div class="h-[3px] bg-sky-500 absolute -top-0.5 left-0 right-0 group-hover:w-full group-hover:duration-500 duration-200 rounded-full" :class="'/calendar' === $route.path ? 'w-full' : 'w-0'"></div> -->
        <Calendar class="h-6 w-6 group-hover:text-sky-500 duration-200" :class="'/calendar' === $route.path ? 'text-sky-500' : ''" />
        <p class="text-xs pt-0.5 group-hover:text-sky-500 duration-200" :class="'/calendar' === $route.path ? 'text-sky-500 font-medium' : ''">Agenda</p>
      </NuxtLink>

      <NuxtLink to="/reservation" class="relative group flex flex-col items-center flex-1 h-full justify-center">
        <!-- <div class="h-[3px] bg-sky-500 absolute -top-0.5 left-0 right-0 group-hover:w-full group-hover:duration-500 duration-200 rounded-full" :class="'/reservation' === $route.path ? 'w-full' : 'w-0'"></div> -->
        <Resa class="h-6 w-6 group-hover:text-sky-500 duration-200" :class="'/reservation' === $route.path ? 'text-sky-500' : ''" />
        <p class="text-xs pt-0.5 group-hover:text-sky-500 duration-200" :class="'/reservation' === $route.path ? 'text-sky-500 font-medium' : ''">Réservation</p>
      </NuxtLink>

      <!-- <NuxtLink to="/reservation" class="w-10 h-10 flex justify-center items-center rounded-full bg-gradient-to-br from-sky-700 to-sky-500 mx-2 hover:shadow-xl shadow-black duration-200">
        <Add class="h-6 w-6 text-white" />
      </NuxtLink> -->

      <NuxtLink to="/profil" class="relative group flex flex-col items-center flex-1 h-full justify-center">
        <!-- <div class="h-[3px] bg-sky-500 absolute -top-0.5 left-0 right-0 group-hover:w-full group-hover:duration-500 duration-200 rounded-full" :class="'/profil' === $route.path ? 'w-full' : 'w-0'"></div> -->
        <User class="h-6 w-6 group-hover:text-sky-500 duration-200" :class="'/profil' === $route.path ? 'text-sky-500' : ''" />
        <p class="text-xs pt-0.5 group-hover:text-sky-500 duration-200" :class="'/profil' === $route.path ? 'text-sky-500 font-medium' : ''">Profil</p>
      </NuxtLink>

      <NuxtLink to="/anomalies" class="relative group flex flex-col items-center flex-1 h-full justify-center">
        <!-- <div class="h-[3px] bg-sky-500 absolute -top-0.5 left-0 right-0 group-hover:w-full group-hover:duration-500 duration-200 rounded-full" :class="'/anomalies' === $route.path ? 'w-full' : 'w-0'"></div> -->
        <Bandage class="h-6 w-6 group-hover:text-sky-500 duration-200" :class="'/anomalies' === $route.path ? 'text-sky-500' : ''" />
        <p class="text-xs pt-0.5 group-hover:text-sky-500 duration-200" :class="'/anomalies' === $route.path ? 'text-sky-500 font-medium' : ''">Anomalies</p>
      </NuxtLink>
    </div>
  </section>
</template>
