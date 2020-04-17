/* document header configuration */
import {Inject, Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {Meta, MetaDefinition, Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {isArray} from 'util';

/* page header configuration */
export interface IPageHeaderConfig {
    title?: string | string[] | null;
    meta?: MetaDefinition[] | null;
}

/* default page header configuration */
export class DefaultPageHeaderConfig implements IPageHeaderConfig {
    title: 'ngx-admin - Demo application';
}

export interface IPageHeaderService {
    /**
     * Get the page header config {IPageHeaderConfig} instance
     * @return the page header config
     */
    getConfig(): IPageHeaderConfig;

    /**
     * Resolve config to document page header
     */
    resolve(): void;
}

/* page header service */
@Injectable()
export class PageHeaderService implements IPageHeaderService {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private config: IPageHeaderConfig;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the page title service {Title} instance
     * @return the page title service {Title} instance
     */
    protected getTitleService(): Title {
        // return this.titleService;
        return null;
    }

    /**
     * Get the page meta-data service {Meta} instance
     * @return the page meta-data service {Meta} instance
     */
    protected getMetaService(): Meta {
        // return this.metaService;
        return null;
    }

    /**
     * Get the {TranslateService} instance
     * @return the {TranslateService} instance
     */
    protected getTranslateService(): TranslateService {
        return this.translateService;
    }

    /**
     * Get the {NGXLogger} instance
     * @return the {NGXLogger} instance
     */
    protected getLogger(): NGXLogger {
        return this.logger;
    }

    /**
     * Get the page header config {IPageHeaderConfig} instance
     * @return the page header config
     */
    public getConfig(): IPageHeaderConfig {
        return this.config || new DefaultPageHeaderConfig();
    }

    /**
     * Set the page header config {IPageHeaderConfig} instance
     * @param config to apply
     */
    public setConfig(config: IPageHeaderConfig) {
        config || throwError('Config must be not undefined');
        this.config = config;
        this.resolve();
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {PageHeaderService} class
     * @param translateService {TranslateService}
     * @param logger {NGXLogger}
     * @param titleService {Title}
     * @param metaService {Meta}
     */
    constructor(@Inject(TranslateService) private translateService: TranslateService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        // titleService || throwError('Could not inject Title service');
        // metaService || throwError('Could not inject Meta service');
        logger || throwError('Could not inject NGXLogger');
        translateService || throwError('Could not inject TranslateService');
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    resolve(): void {
        if (!this.getConfig()) {
            return;
        }

        // apply title
        if (this.getTitleService() && (this.getConfig().title || '').length) {
            let translate: TranslateService;
            translate = this.getTranslateService();
            let finalTitle: string[];
            finalTitle = [];
            let title: string | string[];
            title = this.getConfig().title;
            if (translate) {
                if (isArray(title)) {
                    Array.from(title).forEach(t => {
                        finalTitle.push(translate.instant(t));
                    });

                } else {
                    finalTitle.push(translate.instant(title));
                }
            }
            this.getLogger().debug('Translate?',
                this.getConfig().title, ' -> ', finalTitle.join(' - '));
            this.getTitleService().setTitle(finalTitle.join(' - '));
        }

        // apply meta-data
        if (this.getMetaService() && this.getConfig().meta && this.getConfig().meta.length) {
            let ms: Meta;
            ms = this.getMetaService();
            this.getConfig().meta.forEach(meta => {
                let tag: HTMLMetaElement;
                tag = ms.getTag(meta.id);
                if (!tag) {
                    ms.addTag(meta);
                } else {
                    ms.updateTag(meta, meta.id);
                }
            });
        }
    }
}
