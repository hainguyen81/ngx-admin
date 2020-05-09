import {IEvent} from '../pages/components/abstract.component';
import {NbComponentSize} from '@nebular/theme/components/component-size';
import {NbComponentStatus} from '@nebular/theme/components/component-status';
import {NbComponentShape} from '@nebular/theme/components/component-shape';

export const ACTION_SAVE: string = 'ACTION_SAVE';
export const ACTION_RESET: string = 'ACTION_RESET';
export const ACTION_DELETE: string = 'ACTION_DELETE';
export const ACTION_BACK: string = 'ACTION_BACK';
export const ACTION_SEARCH: string = 'ACTION_SEARCH';
export const ACTION_IMPORT: string = 'ACTION_IMPORT';
export const ACTION_DELETE_DATABASE: string = 'ACTION_DELETE_DATABASE';

/* toolbar actions configuration */
export declare type ToolbarActionType = 'button' | 'submit' | 'reset';

export interface IToolbarActionsConfig {
    id: string;
    label: string;
    icon?: { icon: string, pack?: string | 'fa' } | null;
    class?: string | null;
    description?: string | null;
    type?: ToolbarActionType | 'button';
    /**
     * Perform action when clicking on action
     * @param e {IEvent} that contains {$event} as action event
     * and {$data} as {IToolbarActionsConfig}
     */
    click?: (e: IEvent) => any | null;

    /**
     * Button size, available sizes:
     * `tiny`, `small`, `medium`, `large`, `giant`
     */
    size?: NbComponentSize | 'medium';
    /**
     * Button status (adds specific styles):
     * `basic`, `primary`, `info`, `success`, `warning`, `danger`, `control`.
     */
    status?: NbComponentStatus | 'basic';
    /**
     * Button shapes: `rectangle`, `round`, `semi-round`
     */
    shape?: NbComponentShape | 'rectangle';
    /**
     * Sets `filled` appearance
     */
    filled?: boolean | false;
    /**
     * Sets `outline` appearance
     */
    outline?: boolean | false;
    /**
     * Sets `ghost` appearance
     */
    ghost?: boolean | false;
    /**
     * Sets `hero` appearance
     */
    hero?: boolean | true;
    /**
     * If set element will fill its container
     */
    fullWidth?: boolean | true;
    /**
     * Disables the button
     */
    disabled?: boolean | false;
    /**
     * Make the button visibility
     */
    visible?: boolean | true;
}

/* toolbar header configuration */
export interface IToolbarHeaderConfig {
    title?: string | '';
    icon?: { icon: string, pack?: string | 'fa' } | null;
}

/* base toolbar actions */
export const BaseToolbarActions: IToolbarActionsConfig[] = [{
    id: ACTION_SAVE,
    label: 'common.form.action.save',
    type: 'button',
    status: 'primary',
    icon: {icon: 'save', pack: 'fa'},
    size: 'small',
    shape: 'rectangle',
}, {
    id: ACTION_DELETE,
    label: 'common.form.action.delete',
    type: 'button',
    status: 'danger',
    icon: {icon: 'trash-alt', pack: 'fa'},
    size: 'small',
    shape: 'rectangle',
}, {
    id: ACTION_RESET,
    label: 'common.form.action.reset',
    type: 'button',
    status: 'warning',
    icon: {icon: 'redo', pack: 'fa'},
    size: 'small',
    shape: 'rectangle',
}, {
    id: ACTION_SEARCH,
    label: 'common.form.action.search',
    type: 'button',
    status: 'primary',
    icon: {icon: 'search', pack: 'fas'},
    size: 'small',
    shape: 'rectangle',
}];
