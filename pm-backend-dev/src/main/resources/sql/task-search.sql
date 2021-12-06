with search as (
    select u.login            as user_name,
           u.full_name        as full_name,
           u.position         as uposition,
           un.unit_code       as unit,
           t.id               as task_id,
           t.code             as task_code,
           t.name             as task_name,
           t.type             as task_type,
           t.project_code     as project_code,
           t.target_code      as target_code,
           t.task_parent_code as task_parent_code,
           t.status           as status
    from tasks t
             join task_user tu on t.id = tu.task_id
             join jhi_user u on tu.user_id = u.id
             join unit un on u.unit_code = un.unit_code
    where
      (:userId is null or cast(tu.user_id as text) like cast(:userId as text ))
      AND ((:userIds) is null or tu.user_id in ( :userIds ))
      and (:projectCode is null or t.project_code like '%' || cast(:projectCode as text) || '%')
      and (:targetCode is null or t.target_code like '%' || cast(:targetCode as text) || '%')
      and (:code is null or t.code like '%' || cast(:code as text) || '%')
      and (:parentCode is null or t.task_parent_code like '%' || cast(:parentCode as text) || '%')
      and (:name is null or t.name like '%' || cast(:name as text) || '%')
      and (:type is null or t.type = cast(:type as text))
      and (:startDate is null or t.start_date >= to_date(cast(:startDate as TEXT), 'dd/MM/yyyy H:MI:SS'))
      and (:endDate is null or t.start_date <= to_date(cast(:endDate as TEXT), 'dd/MM/yyyy H:MI:SS'))
)
select count(*) over () total_record, se.*
from search se limit :limit
offset :offset
