with search as (
    select j.id                 id,
           j.code               code,
           j.title              title,
           prj.id               project_id,
           prj.name             project_name,
           prj.code             project_code,
           tg.id                group_id,
           tg.name              group_name,
           tg.code              group_code,
           unit.unit_name       unit_name,
           unit.unit_code       unit_code,
           j.description        description,
           j.start_time         start_time,
           j.end_time           end_time,
           j.number_day         number_day,
           j.number_day_working number_day_working,
           j.status             status,
           j.done_percent       done_percent,
           j.created_at         created_at,
           j.created_by         created_by,
           j.closed_at          closed_at,
           j.closed_by          closed_by,
           j.number_meeting      number_meeting
    from targets j
             left join  unit unit on unit.unit_code = j.unit_code
             left join  target_group tg on tg.id = j.group_id
             left join  project prj on prj.id = j.project_id
    where (:status is null or j.status = cast(:status as text))
      and (:code is null or lower(j.code) = cast(:code as text))
      and (:title is null or lower(j.title) like '%' || cast(:title as text) || '%')
      and (:unitCode is null or lower(unit.unit_code) = cast(:unitCode as text))
      and (:groupCode is null or tg.code = cast(:groupCode as text) )
      and (:projectCode is null or prj.code = cast(:projectCode as text) )
      and (:startTime is null or j.start_time >= to_date(cast(:startTime as TEXT), 'dd/MM/yyyy H:MI:SS'))
      and (:endTime is null or j.start_time <= to_date(cast(:endTime as TEXT), 'dd/MM/yyyy H:MI:SS'))
    ###order_by###
    )
select count(*) over () total_record, se.*
from search se limit :limit
offset :offset
