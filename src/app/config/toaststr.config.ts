import {BodyOutputType, IToasterConfig, ToasterConfig} from 'angular2-toaster';

export const TOASTER: IToasterConfig = new ToasterConfig({
    timeout: 5000,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    showCloseButton: true,
    tapToDismiss: false,
    bodyOutputType: BodyOutputType.TrustedHtml,
    mouseoverTimerStop: false,
    newestOnTop: true,
    // typeClasses: {
    //     'success': 'success',
    //     'error': 'error',
    //     'info': 'info',
    //     'warning': 'warning',
    //     'question': 'question',
    // },
    // iconClasses: {
    //     'success': 'fa fa-info-circle',
    //     'error': 'fa fa-exclamation-circle',
    //     'info': 'fa fa-info-circle',
    //     'warning': 'fa fa-exclamation-triangle',
    //     'question': 'fa fa-question-circle',
    // },
    // "closeButton": false,
    // "debug": true,
    // "progressBar": true,
    // "positionClass": "toast-top-right",
    // "preventDuplicates": true,
    // "showDuration": "300",
    // "hideDuration": "1000",
    // "timeOut": "5000",
    // "extendedTimeOut": "1000",
    // "showEasing": "swing",
    // "hideEasing": "linear",
    // "showMethod": "fadeIn",
    // "hideMethod": "fadeOut"
});
