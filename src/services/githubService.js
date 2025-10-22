const CACHE_EXPIRY_HOURS = 24;
// const CACHE_EXPIRY_MS = CACHE_EXPIRY_HOURS * 1000 * 3600;
const CACHE_EXPIRY_MS = 60000;

export async function fetchAllImagesRecursive(owner, repo, path = '', branch = 'main') {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const res = await fetch(apiUrl);

    if (!res.ok) throw new Error(`GitHub API error ${res.status} on ${apiUrl}`);
    const data = await res.json();

    const folderData = {};

    if (Array.isArray(data)) {
        for (const item of data) {
            if (item.type === "file" && /\.(jpe?g|png|gif|webp)$/i.test(item.name)) {
                const folderName = path || "root";
                if (!folderData[folderName]) folderData[folderName] = [];
                folderData[folderName].push(item.download_url);
            } else if (item.type === "dir") {
                const subData = await fetchAllImagesRecursive(owner, repo, item.path, branch);
                Object.assign(folderData, subData);
            }
        }
    }
    return folderData;
}

export async function getCachedImages(owner = 'luantran', repo = 'anime-wallpapers', forceRefresh = false){
    const cached = localStorage.getItem("allImages");
    const cachedTime = localStorage.getItem("allImages_time");
    const now = Date.now();

    // console.log(`Cached images: ${cached}`);
    // console.log(`Cached time: ${cachedTime}`);

    if (!forceRefresh && cached && cachedTime && now - cachedTime < CACHE_EXPIRY_MS){
        console.log("Loaded from cache...");
        return JSON.parse(cached);
    }

    const images = await fetchAllImagesRecursive(owner, repo);
    localStorage.setItem("allImages", JSON.stringify(images));
    localStorage.setItem("allImages_time", now.toString());
    console.log("Fetched images from Github");
    return images
}