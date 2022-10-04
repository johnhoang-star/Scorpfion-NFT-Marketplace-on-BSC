const api = {
    baseUrl: 'http://localhost:1337',
    // baseUrl: 'https://3wu7.l.serverhost.name',
    nfts: '/nfts',
    nftShowcases: '/nft_showcases',
    authors: '/authors',
    authorsSales: '/author_ranks',
    hotCollections: '/hot-collections',
    contactUs: '/contact-forms',
    blogs: '/blog-posts',
    recent: '/blog-posts/recent',
    comments: '/blog-posts/comments',
    tags: '/blog-posts/tags',
}

export const openseaApi = {
    base: 'https://testnets.opensea.io',
    api: 'https://testnets-api.opensea.io',
}

export default api;
