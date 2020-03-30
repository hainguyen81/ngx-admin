import {Component, Inject} from '@angular/core';
import {DefaultEditor} from 'ng2-smart-table';
import {IAlbum, Lightbox} from "ngx-lightbox";

/**
 * Smart table image cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-image-cell',
    templateUrl: './image.cell.component.html',
    styleUrls: ['./image.cell.component.scss'],
})
export class ImageCellComponent extends DefaultEditor {
    value?: string | null;

    /**
     * Get the {Lightbox} instance
     * @return the {Lightbox} instance
     */
    protected getLightbox(): Lightbox {
        return this.lightbox;
    }

    constructor(@Inject(Lightbox) private lightbox: Lightbox) {
        super();
    }

    public getImage(): string {
        return (this.cell ? Array.isArray(this.cell.getValue())
            ? Array.from(this.cell.getValue()).shift() : this.cell.getValue()
                : Array.isArray(this.value) ? Array.from(this.value).shift() : this.value);
    }

    public openLightbox(): void {
        let image: string;
        image = this.getImage();
        if (this.getLightbox() && (image || '').length) {
            let album: Array<IAlbum>;
            album = [];
            let images: string[];
            images = (this.cell ? Array.isArray(this.cell.getValue())
                ? Array.from(this.cell.getValue()) : [ this.cell.getValue() ]
                : Array.isArray(this.value) ? Array.from(this.value) : [ this.value ]);
            images.forEach(img => {
                album.push({src: img, thumb: img});
            });
            this.getLightbox().open(album, 0);
        }
    }

    public closeLightbox(): void {
        this.getLightbox() && this.getLightbox().close();
    }
}
