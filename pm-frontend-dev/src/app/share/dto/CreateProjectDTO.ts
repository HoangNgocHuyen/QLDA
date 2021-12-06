import {Project} from '../models/project';
import {TargetGroup} from '../models/target-group';
import {UserModel} from '../../modules/auth/_models/user.model';

export class CreateProjectDTO extends Project {

    targetGroups: TargetGroup[];
    users: UserModel[];

}
