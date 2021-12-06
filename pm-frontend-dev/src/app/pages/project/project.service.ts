import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment as env} from '../../../environments/environment';
import {Pageable} from '../../share/dto/Pageable';
import {Observable} from 'rxjs';
import {ResDTO} from '../../share/dto/ResDTO';
import {PageableRes} from '../../share/dto/PageableRes';
import {map} from 'rxjs/operators';
import {Project} from '../../share/models/project';
import {ProjectSearchDTO} from '../../share/dto/ProjectSearchDTO';
import {CreateProjectDTO} from '../../share/dto/CreateProjectDTO';
import {ERROR_TITLE, SUCCESS_CODE} from '../../share/constants/input.constants';
import {ToastrService} from 'ngx-toastr';
import {UserModel} from '../../modules/auth/_models/user.model';

@Injectable({providedIn: 'root'})
export class ProjectService {
    public resourceUrl = env.URL_API + 'api/projects';

    constructor(protected http: HttpClient,
                private toastr: ToastrService) {
    }

    searchNew(pageable: Pageable, search: ProjectSearchDTO): Observable<ResDTO<PageableRes<Project>>> {
        return this.http.post(
            `${this.resourceUrl}/search`,
            search,
            {params: pageable.buildParam(), observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<PageableRes<Project>>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    find(id: number): Observable<Project> {
        return this.http.get(`${this.resourceUrl}/${id}`)
            .pipe(map((res: ResDTO<Project>) => {
                if (res.code === SUCCESS_CODE && res.data) {
                    return res.data;
                }
                this.toastr.error(res.desc, ERROR_TITLE);
                return null;
            }));
    }

    save(project: CreateProjectDTO): Observable<ResDTO<any>> {
        return this.http
            .post(`${this.resourceUrl}/save`,
                project,
                {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<any>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

    findSelectedTargetGroup(projectCode: string): Observable<string[]> {
        return this.http
            .get(`${this.resourceUrl}/find-selected-target-group/${projectCode}`)
            .pipe(map((res: ResDTO<string[]>) => {
                if (res.code === SUCCESS_CODE && res.data) {
                    return res.data;
                }
                return [];
            }));
    }

    findSelectedProjectUser(projectCode: string): Observable<UserModel[]> {
        return this.http
            .get(`${this.resourceUrl}/find-user-by-project/${projectCode}`)
            .pipe(map((res: ResDTO<UserModel[]>) => {
                if (res.code === SUCCESS_CODE && res.data) {
                    return res.data;
                }
                return [];
            }));
    }

    deleteProject(id?: number): Observable<ResDTO<any>> {
        return this.http
            .delete(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .pipe(map((res: HttpResponse<ResDTO<any>>) => {
                if (res.status === 200) {
                    return res.body;
                }
                return null;
            }));
    }

}
