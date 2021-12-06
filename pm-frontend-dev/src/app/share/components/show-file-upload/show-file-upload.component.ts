import {Component, EventEmitter, Input, Output} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ShareService} from '../../share.service';

@Component({
    selector: 'show-file-upload',
    templateUrl: './show-file-upload.component.html'
})
export class ShowFileUploadComponent {

    baseUrl = environment.URL_API + 'api/pm/download/';
    @Input() files: any;
    @Input() disable?: boolean = false;
    @Output() change: EventEmitter<string> = new EventEmitter<string>();

    constructor(private shareService: ShareService) {
    }

    deleteFile(path: string) {
        this.shareService.deleteFile(path).then(res => {
            console.log('Delete File [' + this.getFileName(path) + '] Response: ', res.data);
            this.files = this.files.filter(t => {
                return t !== path;
            });
        });
        this.change.emit(path);
    }

    getFileName(path: any) {
        return path.split('/')[1];
    }

}
