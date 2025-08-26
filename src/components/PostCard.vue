<script setup>
const props = defineProps({ post: { type: Object, required: true } });
const post = props.post;
</script>

<template>
  <div class="bg-white">
    <h1>{{ post.name }}</h1>
    <figure>
      <img src="" alt="immagine" />
    </figure>
    <p>{{ post.date }}</p>

    <button style="color: orange">
      {{ post.special ? "★" : "☆" }}
    </button>
  </div>
</template>
