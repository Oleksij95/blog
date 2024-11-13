import { gql } from 'nuxt-graphql-request/utils';

export const articlesQuery = gql`
    query Blogs_connection($filters: BlogFiltersInput, $pagination: PaginationArg, $sort: [String]) {
        blogs_connection(filters: $filters, pagination: $pagination, sort: $sort) {
            pageInfo {
                page
                pageCount
            }
            nodes {
                description
                image {
                    url
                }
                slug
                title
                date
                views
                createdAt
            }
        }
    }
`;

export const articleQuery = gql`
    query Blogs($filters: BlogFiltersInput) {
        blogs(filters: $filters) {
            seo {
                title
                description
            }
            body
            date
            image {
                url
            }
            title
            slug
            views
            documentId
            likes
            other_blogs {
                documentId
                slug
                title
                image {
                    url
                }
                date
                views
                description
            }
        }
    }
`

export const seoBlogQuery = gql`
    query {
        blogHome {
            seo {
                title,
                description
            }
        }
    }
`;

export const updateArticle = gql`
    mutation UpdateBlog($documentId: ID!, $data: BlogInput!) {
        updateBlog(documentId: $documentId, data: $data) {
            views
            likes
        }
    }
`