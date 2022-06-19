<template lang="pug" >
v-app
  v-app-bar(color='teal-darken-4' image='https://picsum.photos/1920/1080?random')
    template(v-slot:image)
    template(v-slot:prepend)
    v-app-bar-title Title
    v-spacer
    v-btn(icon="mdi-home" to="/")
    v-btn(icon="mdi-format-list-bulleted-square" to="/list")
    v-btn(icon="mdi-dots-vertical" to="/setting")
  v-main
    v-container(fluid)
      router-view
</template>

<script setup>
</script>
