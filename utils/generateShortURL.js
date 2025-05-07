export function generateShortURL(id) {
    const base = 62;
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let shortUrl = "";
    while (id > 0) {
        shortUrl = chars[id % base] + shortUrl;
        id = Math.floor(id / base);
    }
    return `${process.env.BASE_URL}/api/v1/${shortUrl}`;
}