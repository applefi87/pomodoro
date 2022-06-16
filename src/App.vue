<template lang="pug" >
v-app
  v-app-bar(color='teal-darken-4' image='https://picsum.photos/1920/1080?random')
    template(v-slot:image)
    template(v-slot:prepend)
    v-app-bar-title Title
    v-spacer
    v-btn(icon to="/")
      v-icon mdi-magnify
    v-btn(icon to="/list")
      v-icon mdi-heart
    v-btn(icon to="/setting")
      v-icon mdi-dots-vertical
  v-main
    v-container(fluid)
      router-view
</template>

<script setup>
</script>
