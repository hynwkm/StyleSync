export default function fixUrl(base: string, path: string) {
    const combined = `${base}/${path}`;
    const fixedUrl = combined.replace(/(?<!:)\/*(\/+)/g, "/");
    return fixedUrl;
}
