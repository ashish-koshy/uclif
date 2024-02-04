import { TestBed } from '@angular/core/testing';
import { UclifExternalAssetLoaderService } from './uclif-external-asset-loader.service';

describe('UclifExternalAssetLoaderService', () => {
    let service: UclifExternalAssetLoaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UclifExternalAssetLoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
