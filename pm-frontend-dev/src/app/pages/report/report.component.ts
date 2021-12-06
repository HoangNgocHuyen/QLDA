import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ReportService} from './report.service';
import {ToastrService} from 'ngx-toastr';
import {Chart} from 'angular-highcharts';
import {BehaviorSubject} from 'rxjs';
import {ERROR_TITLE} from 'src/app/share/constants/input.constants';

@Component({
    selector: 'report',
    templateUrl: './report.component.html',
})
export class ReportComponent implements OnInit {

    series = new BehaviorSubject<[]>([]);
    chart = new Chart({
        chart: {
            type: 'line'
        },
        title: {
            text: 'Monthly Average Temperature'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: []
    });
    chart1 = new Chart({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Tỉ lệ hoàn thành theo PMO, 2018'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: []
    });
    chart2 = new Chart({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Average Rainfall'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Rainfall (mm)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: []
    });
    chart3 = new Chart({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Historic World Population by Region'
        },
        subtitle: {
            text: 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
        },
        xAxis: {
            categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Population (millions)',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' millions'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: []
    });

    constructor(
        protected router: Router,
        protected service: ReportService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.loadChartData();
        // this.loadChartData1();
        // this.loadChartData2();
        // this.loadChartData3();
    }

    loadChartData() {
        this.service.getData().subscribe(
            res => {
                this.addSeriesToChart(res.data);
            },
            error => {
                this.toastr.error(error.getMessage(), ERROR_TITLE);
            }
        );
    }

    addSeriesToChart(series: []) {
        this.chart.ref$.subscribe(chart => {
            series.forEach(s => chart.addSeries(s));
            chart.setTitle({text: 'Change title example'});
        });
    }

    // loadChartData1() {
    //     let series = [];
    //     this.chart1.ref$.subscribe(chart => {
    //         series.forEach(s => chart.addSeries(s));
    //     });
    // }
    //
    // loadChartData2() {
    //     let series = [{
    //         name: 'Tokyo',
    //         data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    //
    //     }, {
    //         name: 'New York',
    //         data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
    //
    //     }, {
    //         name: 'London',
    //         data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
    //
    //     }, {
    //         name: 'Berlin',
    //         data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
    //
    //     }];
    //     this.chart2.ref$.subscribe(chart => {
    //         series.forEach(s => chart.addSeries(s));
    //     });
    // }
    //
    // loadChartData3() {
    //     let series = [{
    //         name: 'Year 1800',
    //         data: [107, 31, 635, 203, 2]
    //     }, {
    //         name: 'Year 1900',
    //         data: [133, 156, 947, 408, 6]
    //     }, {
    //         name: 'Year 2000',
    //         data: [814, 841, 3714, 727, 31]
    //     }, {
    //         name: 'Year 2016',
    //         data: [1216, 1001, 4436, 738, 40]
    //     }];
    //     this.chart3.ref$.subscribe(chart => {
    //         series.forEach(s => chart.addSeries(s));
    //     });
    // }

}
