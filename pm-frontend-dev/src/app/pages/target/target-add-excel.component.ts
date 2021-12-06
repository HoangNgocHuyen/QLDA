import {Component, Inject, OnInit} from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {TargetService} from './target.service';
import {Target} from '../../share/models/target';
import {ResDTO} from '../../share/dto/ResDTO';
import {ShareService} from '../../share/share.service';
import {ResponseObject} from '../../share/models/response-obj.model';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'target-add-excel',
  templateUrl: './target-add-excel.component.html',
})
export class TargetAddExcelComponent implements OnInit {

  importForm: FormGroup;
  targets = new BehaviorSubject<Target[]>([]);
  isSaving = false;
  fileToUpload: File;
  processingImageUpload: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    public service: TargetService,
    private toastService: ToastrService,
    private translateService: TranslateService,
    public serviceShare: ShareService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.importForm = this.fb.group({
      file: new FormControl(null, [
        Validators.required
      ])
    });
  }

  get frm() {
    if (this.importForm !== undefined) {
      return this.importForm.controls;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const req = new FormData();
    req.append('file', this.fileToUpload);
    this.subscribeToSaveResponse(this.service.addByExcel(req));
  }

  protected subscribeToSaveResponse(result: Observable<ResDTO<Target[]>>): void {
    result.subscribe(
      (res) => this.onSaveSuccess(res),
      (err) => this.onSaveError(err)
    );
  }

  chooseFile(event) {
    this.fileToUpload = event.target.files[0];
  }

  protected onSaveSuccess(res: ResDTO<Target[]>): void {
    if (res.code === '00') {
      this.toastService.success('Thêm mới thành công');
    } else {
      this.toastService.error(res.desc);
    }
    this.isSaving = false;
    this.targets.next(res.data);
  }

  protected onSaveError(error): void {
    this.toastService.error(this.translateService.instant('message.error'));
    this.isSaving = false;
  }

}
