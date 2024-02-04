import { Component, DebugElement, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UclifImageSourceDirective } from './uclif-image-source.directive';

@Component({
    template: `<div><div class="item"></div></div>`,
})
export class TestComponent {}

describe('UclifImageSourceDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let item: DebugElement;
    const rendererSpy: jasmine.SpyObj<Renderer2> =
        jasmine.createSpyObj<Renderer2>('Renderer2', [
            'createElement',
            'listen',
        ]);

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, UclifImageSourceDirective],
        }).compileComponents();
        fixture = TestBed.createComponent(TestComponent);
        item = fixture.debugElement.query(By.css('.item'));
    });

    it('should create an instance', () => {
        const directive = new UclifImageSourceDirective(item, rendererSpy);
        expect(directive).toBeTruthy();
    });
});
