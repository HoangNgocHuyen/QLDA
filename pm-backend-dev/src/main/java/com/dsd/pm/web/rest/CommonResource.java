package com.dsd.pm.web.rest;

import com.dsd.pm.service.RegionService;
import com.dsd.pm.service.UnitService;
import com.dsd.pm.service.dto.RegionDTO;
import com.dsd.pm.service.dto.ResDTO;
import com.dsd.pm.service.dto.UnitDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Created by sonba@itsol.vn
 * Date: 25/05/2021
 * Time: 9:22 PM
 */
@RestController
@RequestMapping(value = "/api")
public class CommonResource {

    private final RegionService regionService;
    private final UnitService unitService;

    public CommonResource(RegionService regionService, UnitService unitService) {
        this.regionService = regionService;
        this.unitService = unitService;
    }

    @GetMapping("/regions/get-all")
    public ResponseEntity<ResDTO<List<RegionDTO>>> findAllRegion() {
        List<RegionDTO> regionDTOS = regionService.findAllRegion();
        return ResponseEntity.ok(ResDTO.success(regionDTOS));
    }

    @PostMapping("/regions/search")
    public ResponseEntity<ResDTO<Page<RegionDTO>>> searchRegion(Pageable pageable, @RequestBody RegionDTO search) {
        Page<RegionDTO> page = regionService.searchRegion(pageable, search);
        return ResponseEntity.ok(ResDTO.success(page));
    }

    @GetMapping("/regions/get-all-area")
    public ResponseEntity<ResDTO<List<RegionDTO>>> findAllArea() {
        List<RegionDTO> units = regionService.findAllArea();
        return ResponseEntity.ok(ResDTO.success(units));
    }

    @GetMapping("/regions/get-all-province")
    public ResponseEntity<ResDTO<List<RegionDTO>>> findAllProvince() {
        List<RegionDTO> units = regionService.findAllProvince();
        return ResponseEntity.ok(ResDTO.success(units));
    }

    @GetMapping("/regions/get-all-district")
    public ResponseEntity<ResDTO<List<RegionDTO>>> findAllDistrict() {
        List<RegionDTO> units = regionService.findAllDistrict();
        return ResponseEntity.ok(ResDTO.success(units));
    }

    @PostMapping("/regions")
    public ResponseEntity<ResDTO<RegionDTO>> createdArea(@Valid @RequestBody RegionDTO req) {
        RegionDTO regionDTO = regionService.createdRegion(req);
        return ResponseEntity.ok(ResDTO.success(regionDTO));
    }

    @PutMapping("/regions")
    public ResponseEntity<ResDTO<RegionDTO>> updateArea(@Valid @RequestBody RegionDTO req) {
        RegionDTO regionDTO = regionService.updateRegion(req);
        return ResponseEntity.ok(ResDTO.success(regionDTO));
    }

    @DeleteMapping("/regions/{code}")
    public ResponseEntity<Void> deleteArea(@PathVariable String code) {
        regionService.deleteRegion(code);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/units/search")
    public ResponseEntity<ResDTO<Page<UnitDTO>>> searchUnit(Pageable pageable, @RequestBody UnitDTO search) {
        Page<UnitDTO> page = unitService.searchUnit(pageable, search);
        return ResponseEntity.ok(ResDTO.success(page));
    }

    @GetMapping("/units/get-all")
    public ResponseEntity<ResDTO<List<UnitDTO>>> findAllUnits() {
        List<UnitDTO> units = unitService.findAllUnits();
        return ResponseEntity.ok(ResDTO.success(units));
    }

    @GetMapping("/units/get-by-project-code/{code}")
    public ResponseEntity<ResDTO<List<UnitDTO>>> getUnitByProjectCode(@PathVariable String code) {
        List<UnitDTO> units = unitService.getUnitByProjectCode(code);
        return ResponseEntity.ok(ResDTO.success(units));
    }

    @PostMapping("/units")
    public ResponseEntity<ResDTO<UnitDTO>> createdUnit(@Valid @RequestBody UnitDTO req) {
        UnitDTO unitDTO = unitService.createdUnit(req);
        return ResponseEntity.ok(ResDTO.success(unitDTO));
    }

    @PutMapping("/units")
    public ResponseEntity<ResDTO<UnitDTO>> updateUnit(@Valid @RequestBody UnitDTO req) {
        UnitDTO unitDTO = unitService.updateUnit(req);
        return ResponseEntity.ok(ResDTO.success(unitDTO));
    }

    @DeleteMapping("/units/{unitCode}")
    public ResponseEntity<ResDTO<Void>> deleteUnit(@PathVariable String unitCode) {
        ResDTO<Void> res = unitService.deleteUnit(unitCode);
        return ResponseEntity.ok(res);
    }
}
