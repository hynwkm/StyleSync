export default function fixUrl(base: string, path: string) {
    const baseTrimmed = base.endsWith("/") ? base.slice(0, -1) : base;
    const pathTrimmed = path.startsWith("/") ? path : `/${path}`;
    return baseTrimmed + pathTrimmed;
}
