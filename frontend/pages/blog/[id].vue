<script setup>
import { gql } from 'nuxt-graphql-request/utils';
import { articleQuery, updateArticle } from '../../graphql'
import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt()
const route = useRoute()
const { $graphql } = useNuxtApp()
let likes = ref(null);
let isLiked = ref(false);

const { data: article } = await useAsyncData('article', async () => {
    const data = await $graphql.default.request(articleQuery, {
        filters: {
            slug: {
                "eq": route.params.id
            }
        }
    });
    return data.blogs[0];
}, { watch: [likes, isLiked] });

if (!article.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found!'
    })
}

onMounted(async () => {
    incrementViews()
    if (process.client) {
        if ( localStorage.getItem(article.value.documentId) ) {
            isLiked.value = true
        }
    }
});

async function incrementViews() {
    try {
        const data = await $graphql.default.request(updateArticle, {
            "documentId": article.value.documentId,
            "data": {
                "views": article.value.views + 1
            }
        });
    } catch (error) {
        console.error('Update error', error);
    }
}

async function updateLikes(status) {
    try {
        status === 'plus' ? likes.value = article.value.likes + 1  : likes.value = article.value.likes - 1
        if (!isLiked.value) {
            const data = await $graphql.default.request(updateArticle, {
                "documentId": article.value.documentId,
                "data": {
                    "likes":  likes.value
                }
            });
            if (process.client) {
                isLiked.value = true
                localStorage.setItem(article.value.documentId, status)
            }
        }
       
    } catch (error) {
        console.error('Update error', error);
    }
}

useHead({
  title: article.value?.seo?.title,
  meta: [
    { name: 'description', content: article.value?.seo?.description }
  ],
})
</script>

<template>
    <div>
        <div v-if="article" >
            <div class="min-h-[300px] bg-sky-500 flex justify-center items-center flex-col">
                <h1 class="text-[56px]/[80px] font-semibold text-white">{{ article.title }}</h1>
            </div>
            <div class="container mt-8">
                <NuxtLink to="/blog" class="mb-8 inline-block">< Back</NuxtLink>
                <div class="flex items-center mb-6 text-slate-500">
                    <div class="flex items-center mr-10">
                        <img src="@/assets/img/date.svg" alt="date" class="mr-2" width="20px">
                        {{ article.date }}
                    </div>
                    <div class="flex items-center ">
                        <img src="@/assets/img/eye.svg" alt="views" class="mr-2" width="20px">
                        {{ article.views }}
                    </div>
                </div>
                <div v-html="markdown.render(article.body)" class="article-content" />

                <div class="flex items-center mt-10">
                    <div @click="updateLikes('minus')" 
                        class="w-[50px] h-[50px] rounded-full bg-red-600 text-white flex justify-center items-center  text-sm"
                        :class="{'cursor-pointer': !isLiked, 'cursor-default': isLiked}"
                    >
                        down
                    </div>
                    <div class="mx-6 w-[40px] text-center" :class="{'text-red-600': article.likes < 0, 'text-green-600': article.likes > 0}">{{ article.likes }}</div>
                    <div @click="updateLikes('plus')"
                        class="w-[50px] h-[50px] rounded-full bg-green-500 text-white flex justify-center items-center text-sm"
                        :class="{'cursor-pointer': !isLiked, 'cursor-default': isLiked}"
                    >
                        up
                    </div>
                </div>

                <div v-if="article.other_blogs.length" class="mb-20">
                    <div class="text-3xl font-bold mt-20 mb-4">Other article</div>
                    <div class="grid grid-cols-3 gap-4 mt-2">
                        <BlogCart v-for="blog in article.other_blogs" :key="blog.title" :blog="blog" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.article-content p{
    margin-bottom: 16px;
}

.article-content ul{
    list-style: inherit;
    padding-left: 25px;
}

.article-content blockquote{
    display: inline-block;
    position: relative;
    margin-bottom: 50px;
    font-style: italic;
}

.article-content blockquote p {
    margin-bottom: 0;
    font-weight: 600;
    padding: 20px;
    border-radius: 16px;
    background-color: #ebebeb;
    margin-top: 20px;
}

.article-content blockquote em {
    display: block;
    text-align: right;
    position: absolute;
    bottom: -30px;
    right: 10px;
}

.article-content img + em {
    display: block;
    text-align: center;
    margin-top: 5px;
    font-style: normal;
    font-size: 14px;
    color: #666;
}
</style>