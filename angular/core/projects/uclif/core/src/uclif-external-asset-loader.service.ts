import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { CDNAssetProperties } from './types/uclif-cdn-asset';

@Injectable({ providedIn: 'root' })
export class UclifExternalAssetLoaderService {
    private renderer: Renderer2;

    constructor(
        rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    private findExternalAsset(url: string, type: 'script' | 'link'): unknown {
        const attribute = type === 'script' ? 'src' : 'href';
        const existingNodes: unknown[] = Array.from(
            this.document.getElementsByTagName(`${type}`)
        );
        const item =
            existingNodes.filter((existingNode) => {
                const node = existingNode as Record<string, string>;
                return node[`${attribute}`]?.includes(url);
            }) || [];
        return item?.length > 0 ? item?.shift() : undefined;
    }

    public addExternalScript(
        asset: CDNAssetProperties,
        parent: HTMLElement
    ): HTMLScriptElement | void {
        if (!asset?.script) return;
        const existingScript = this.findExternalAsset(
            asset.script,
            'script'
        ) as HTMLScriptElement;
        if (existingScript) return existingScript;
        const newScript: HTMLScriptElement =
            this.renderer.createElement('script');
        this.renderer.setAttribute(newScript, 'type', 'text/javascript');
        this.renderer.setAttribute(newScript, 'src', asset.script);
        newScript.defer = true;
        this.renderer.appendChild(parent, newScript);
        newScript.onerror = (error: unknown | null) => {
            if (asset?.onerror) asset?.onerror(error, parent);
        };
        return newScript;
    }

    public addExternalLink(
        asset: CDNAssetProperties,
        parent: HTMLElement
    ): HTMLLinkElement | void {
        if (!asset?.style) return;
        const existingLink = this.findExternalAsset(
            asset?.style,
            'link'
        ) as HTMLLinkElement;
        if (existingLink) return existingLink;
        const newLink: HTMLLinkElement = this.renderer.createElement('link');
        this.renderer.setAttribute(newLink, 'rel', 'stylesheet');
        this.renderer.setAttribute(newLink, 'type', 'text/css');
        this.renderer.setAttribute(newLink, 'href', asset.style);
        this.renderer.appendChild(parent, newLink);
        return newLink;
    }
}
