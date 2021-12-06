import {Component, OnInit} from '@angular/core';
import {LayoutService} from '../../../../../core';

@Component({
    selector: 'app-stats-widget11',
    templateUrl: './stats-widget11.component.html',
})
export class StatsWidget11Component implements OnInit {
    chartOptions: any = {};
    fontFamily = '';
    colorsGrayGray500 = '';
    colorsGrayGray200 = '';
    colorsGrayGray300 = '';
    colorsThemeBaseDanger = '';
    colorsThemeBasePrimary = '';
    colorsThemeLightPrimary = '';
    colorsThemeBaseSuccess = '';
    colorsThemeLightSuccess = '';

    constructor(private layout: LayoutService) {
        this.fontFamily = this.layout.getProp('js.fontFamily');
        this.colorsGrayGray500 = this.layout.getProp('js.colors.gray.gray500');
        this.colorsGrayGray200 = this.layout.getProp('js.colors.gray.gray200');
        this.colorsGrayGray300 = this.layout.getProp('js.colors.gray.gray300');
        this.colorsThemeBaseDanger = this.layout.getProp(
            'js.colors.theme.base.danger'
        );
        this.colorsThemeBasePrimary = this.layout.getProp(
            'js.colors.theme.base.primary'
        );
        this.colorsThemeLightPrimary = this.layout.getProp(
            'js.colors.theme.light.primary'
        );
        this.colorsThemeBaseSuccess = this.layout.getProp(
            'js.colors.theme.base.success'
        );
        this.colorsThemeLightSuccess = this.layout.getProp(
            'js.colors.theme.light.success'
        );
    }

    ngOnInit(): void {
        this.chartOptions = this.getChartOptions();
    }

    getChartOptions() {
        return {
            series: [
                {
                    name: 'Net Profit',
                    data: [30, 45, 32, 70, 40],
                },
            ],
            chart: {
                type: 'area',
                height: 150,
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
                sparkline: {
                    enabled: true,
                },
            },
            plotOptions: {},
            legend: {
                show: false,
            },
            dataLabels: {
                enabled: false,
            },
            fill: {
                type: 'solid',
                opacity: 1,
            },
            stroke: {
                curve: 'smooth',
                show: true,
                width: 3,
                colors: [this.colorsThemeBaseSuccess],
            },
            xaxis: {
                categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                    style: {
                        colors: this.colorsGrayGray500,
                        fontSize: '12px',
                        fontFamily: this.fontFamily,
                    },
                },
                crosshairs: {
                    show: false,
                    position: 'front',
                    stroke: {
                        color: this.colorsGrayGray300,
                        width: 1,
                        dashArray: 3,
                    },
                },
                tooltip: {
                    enabled: true,
                    formatter: undefined,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        fontFamily: this.fontFamily,
                    },
                },
            },
            yaxis: {
                labels: {
                    show: false,
                    style: {
                        colors: this.colorsGrayGray500,
                        fontSize: '12px',
                        fontFamily: this.fontFamily,
                    },
                },
            },
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0,
                    },
                },
                hover: {
                    filter: {
                        type: 'none',
                        value: 0,
                    },
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0,
                    },
                },
            },
            tooltip: {
                style: {
                    fontSize: '12px',
                    fontFamily: this.fontFamily,
                },
                y: {
                    // tslint:disable-next-line
                    formatter: function (val) {
                        return '$' + val + ' thousands';
                    },
                },
            },
            colors: [this.colorsThemeLightSuccess],
            markers: {
                colors: this.colorsThemeLightSuccess,
                strokeColor: [this.colorsThemeBaseSuccess],
                strokeWidth: 3,
            },
        };
    }
}
