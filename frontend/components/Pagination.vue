
<script setup>
 
    const props = defineProps({
        blogPostsPagination: {
            type: Object,
            required: true,
        },
    });
</script>

<template>
    <div>
        <div class="flex justify-center mt-8">
            <NuxtLink
                v-for="idx in blogPostsPagination.pageCount"
                :key="`padination-${idx}`"
                :to="{query: {page: idx}}"
                class="w-[40px] h-[40px]  m-2 rounded-md flex justify-center items-center cursor-pointer"
                :class="{'bg-sky-500 text-white': idx ===  blogPostsPagination.page, 'bg-slate-200': idx !==  blogPostsPagination.page}"
            >
                {{ idx }}
            </NuxtLink>
        </div>
    </div>
</template>