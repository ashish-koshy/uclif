export type CDNAssetProperties = {
    style?: string;
    script?: string;
    onload?: (event?: unknown | null, parent?: unknown | null) => void;
    onerror?: (error?: unknown | null, parent?: unknown | null) => void;
};

export type UclifCDNAsset = Record<string, CDNAssetProperties>;
