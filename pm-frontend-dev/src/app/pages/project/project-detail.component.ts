import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Project} from '../../share/models/project';
import {BehaviorSubject} from 'rxjs';
import {ProjectService} from './project.service';
import {UserModel} from '../../modules/auth/_models/user.model';
import {TargetGroupService} from '../category/target-group/target-group.service';
import {ProjectTargetGroup} from '../../share/dto/ProjectTargetGroup';
import {ModalAskComponent} from '../../share/components/modal-ask/modal-ask.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ERROR_TITLE, SUCCESS_CODE, SUCCESS_TITLE} from '../../share/constants/input.constants';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'project-detail',
    templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent implements OnInit {

    project: Project | null = null;
    targetGroups = new BehaviorSubject<ProjectTargetGroup[]>([]);
    Users = new BehaviorSubject<UserModel[]>([]);

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected targetGroupService: TargetGroupService,
        protected projectService: ProjectService,
        protected modalService: NgbModal,
        private toastr: ToastrService,
        private route: Router,
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({project}) => {
            this.project = project;
            if (this.project) {
                this.loadTargetGroup(this.project.code);
                this.loadProjectUser(this.project.code);
            }
        });
    }

    loadTargetGroup(projectCode: string) {
        this.targetGroupService.projectTargetGroupByProject(projectCode).subscribe(
            res => this.targetGroups.next(res)
        );
    }

    loadProjectUser(projectCode: string) {
        this.projectService.findSelectedProjectUser(projectCode).subscribe(
            res => this.Users.next(res)
        );
    }

    previousState(): void {
        window.history.back();
    }

    deleteProject(projectId: number) {
        const modalRef = this.modalService.open(ModalAskComponent, {
            size: 'md'
        });
        modalRef.componentInstance.content = 'Bạn có chắc chắn muốn xóa dự án không?';
        modalRef.componentInstance.title = 'Thông báo';
        modalRef.result.then(res => {
            if (!res) {
                return;
            }
            this.projectService.deleteProject(projectId).subscribe(
                r => {
                    if (r.code !== SUCCESS_CODE) {
                        this.toastr.error(r.desc, ERROR_TITLE);
                        return;
                    }
                    this.toastr.success('Xóa dữ liệu thành công', SUCCESS_TITLE);
                    this.route.navigate(['/project']);
                },
                error => this.toastr.error(error.message, ERROR_TITLE)
            );
        });
    }
}
