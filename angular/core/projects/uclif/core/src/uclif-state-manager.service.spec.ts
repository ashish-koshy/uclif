import { TestBed } from '@angular/core/testing';
import { UclifStateManagerService } from './uclif-state-manager.service';

describe('UclifStateManagerService', () => {
    let service: UclifStateManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UclifStateManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
