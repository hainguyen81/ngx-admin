import * as tslib_1 from "tslib";
import { delay, takeWhile } from 'rxjs/operators';
import { Component, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../../@core/utils/layout.service';
let EarningLiveUpdateChartComponent = class EarningLiveUpdateChartComponent {
    constructor(theme, layoutService) {
        this.theme = theme;
        this.layoutService = layoutService;
        this.alive = true;
        this.layoutService.onChangeLayoutSize()
            .pipe(takeWhile(() => this.alive))
            .subscribe(() => this.resizeChart());
    }
    ngOnChanges() {
        if (this.option) {
            this.updateChartOptions(this.liveUpdateChartData);
        }
    }
    ngAfterViewInit() {
        this.theme.getJsTheme()
            .pipe(delay(1), takeWhile(() => this.alive))
            .subscribe(config => {
            const earningLineTheme = config.variables.earningLine;
            this.setChartOption(earningLineTheme);
        });
    }
    setChartOption(earningLineTheme) {
        this.option = {
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
            xAxis: {
                type: 'time',
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
            },
            yAxis: {
                boundaryGap: [0, '5%'],
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
            },
            tooltip: {
                axisPointer: {
                    type: 'shadow',
                },
                textStyle: {
                    color: earningLineTheme.tooltipTextColor,
                    fontWeight: earningLineTheme.tooltipFontWeight,
                    fontSize: earningLineTheme.tooltipFontSize,
                },
                position: 'top',
                backgroundColor: earningLineTheme.tooltipBg,
                borderColor: earningLineTheme.tooltipBorderColor,
                borderWidth: earningLineTheme.tooltipBorderWidth,
                formatter: params => `$ ${Math.round(parseInt(params.value[1], 10))}`,
                extraCssText: earningLineTheme.tooltipExtraCss,
            },
            series: [
                {
                    type: 'line',
                    symbol: 'circle',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            opacity: 0,
                        },
                        emphasis: {
                            opacity: 0,
                        },
                    },
                    lineStyle: {
                        normal: {
                            width: 0,
                        },
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: earningLineTheme.gradFrom,
                                }, {
                                    offset: 1,
                                    color: earningLineTheme.gradTo,
                                }]),
                            opacity: 1,
                        },
                    },
                    data: this.liveUpdateChartData,
                },
            ],
            animation: true,
        };
    }
    updateChartOptions(chartData) {
        this.echartsInstance.setOption({
            series: [{
                    data: chartData,
                }],
        });
    }
    onChartInit(ec) {
        this.echartsInstance = ec;
    }
    resizeChart() {
        if (this.echartsInstance) {
            this.echartsInstance.resize();
        }
    }
    ngOnDestroy() {
        this.alive = false;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], EarningLiveUpdateChartComponent.prototype, "liveUpdateChartData", void 0);
EarningLiveUpdateChartComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-earning-live-update-chart',
        styleUrls: ['earning-card-front.component.scss'],
        template: `
    <div echarts
         class="echart"
         [options]="option"
         (chartInit)="onChartInit($event)"></div>
  `,
    }),
    tslib_1.__metadata("design:paramtypes", [NbThemeService,
        LayoutService])
], EarningLiveUpdateChartComponent);
export { EarningLiveUpdateChartComponent };
//# sourceMappingURL=earning-live-update-chart.component.js.map