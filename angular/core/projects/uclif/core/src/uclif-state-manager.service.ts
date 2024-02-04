import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * State manager stores the state of `actions`
 * An `action` could be anything from a form save operation
 * to a counter increment. A state value is maintained and
 * updated against a unique action name.
 */
@Injectable({
    providedIn: 'root',
})
export class UclifStateManagerService {
    private actions: Map<string, Observable<unknown>> = new Map();
    private states: Map<string, BehaviorSubject<unknown>> = new Map();

    /**
     * @param action Name of the new action
     * @param initialValue Initial state of the new action
     */
    private create(action: string, initialValue: unknown): void {
        if (this.actions.get(action)) return;
        const newState = new BehaviorSubject<typeof initialValue>(initialValue);
        this.states.set(action, newState);
        const newStateObservable = newState.asObservable();
        this.actions.set(action, newStateObservable);
    }

    /**
     * @param action Name of the action you wish to update
     * @param value Updated value for the action
     */
    public set<T>(action: string, value: T): void {
        if (!value) return;
        this.create(action, value);
        this.states.get(action)?.next(value);
    }

    /**
     * @param action Name of the action you wish to retrieve
     * @returns An observable stream that delivers the most
     * recent value stored by the action. The stream would only
     * contain the fallback value if no actions were found or are
     * yet to be defined.
     */
    public get<T>(action: string, fallbackValue: T): Observable<T> {
        this.create(action, fallbackValue);
        const stateObservable = this.actions.get(action);
        return stateObservable as Observable<T>;
    }
}
