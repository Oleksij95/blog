<script setup>
import { articlesQuery, seoBlogQuery } from '../../graphql'
import { ref } from 'vue'

const searchQuery = ref('');
const route = useRoute()
const router = useRouter()
const page = computed(() => route.query)
const { $graphql } = useNuxtApp();

const { data: blogHome } = await useAsyncData('blogPage', async () => {
    const blogSeo = await $graphql.default.request(seoBlogQuery);
    const blogPosts = await $graphql.default.request(articlesQuery, {
        "pagination": {
            "page": parseInt(route.query.page) || 1,
            "pageSize": 3
        },
        "sort": 'date:desc',
        "filters": {
            "title": {
                "contains": searchQuery.value || route.query.search ||  ""
            }
        },
    });
    return {
        seo: blogSeo.blogHome.seo,
        blogPosts: blogPosts.blogs_connection.nodes,
        blogPostsPagination: blogPosts.blogs_connection.pageInfo 
    };
}, { watch: [page] });

useHead({
    title: blogHome.value.seo.title,
    meta: [
        { name: 'description', content: blogHome.value.seo.description }
    ],
})

const searchArticles = () => {
    router.push({query: {search: searchQuery.value}}) 
}
</script>

<template>
    <div>
        <div class="min-h-[300px] bg-sky-500 flex justify-center items-center flex-col">
            <h1 class="text-[56px]/[80px] font-semibold text-white">Blog</h1>
            <div class="mt-6 flex bg-white p-2 rounded-lg">
                <input v-model="searchQuery" type="text" name="term" id="term" placeholder="Search..." class="p-2 rounded-lg outline-0 w-[300px]">
                <button @click="searchArticles" class="p-2 rounded-lg bg-sky-500 text-white">Search</button>
            </div>
        </div>
        <div class="container">
            <div class="grid grid-cols-3 gap-4 mt-20">
                <BlogCart v-for="blog in blogHome.blogPosts" :key="blog.slug" :blog="blog" />
            </div>
            <Pagination v-if="blogHome.blogPostsPagination.pageCount > 1" :blogPostsPagination="blogHome.blogPostsPagination"/>
        </div>
    </div>
</template>
