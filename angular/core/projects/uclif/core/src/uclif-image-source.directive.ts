// eslint-disable-next-line no-var
declare var __webpack_public_path__: string;
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

/**
 * Use this directive load images from a CDN URL
 *
 * It prepends the image's reltive path with the
 * CDN domain URL. This assumes that you have set
 * the webpack bundle variable called :
 *
 * __webpack_public_path__
 *
 * GUIDANCE:
 * ---------
 * https://webpack.js.org/guides/public-path
 *
 **/
@Directive({
    selector: '[uclifImgSrc]',
})
export class UclifImageSourceDirective {
    @Input() public set imgSrc(relativePath: string) {
        const image = this.imageTag?.nativeElement;
        image &&
            this.renderer.setProperty(
                image,
                'src',
                `${__webpack_public_path__}/${relativePath}`
            );
    }

    constructor(
        private imageTag: ElementRef<HTMLImageElement>,
        private renderer: Renderer2
    ) {
        /** Empty constructor */
    }
}
