import {
    AbstractControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';
import { staticData } from './uclif-utilities';

/**
 * Most commonly used form validators
 **/
export abstract class UclifFormValidators {
    /** Date of birth */
    static dateOfBirth(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control?.value as string;
            if (!value) return null;
            const yearLowerLimit = 1900;
            const yearUpperLimit = new Date().getFullYear() - 1;
            const year = parseInt(value?.split('-')[0] || '0', 10);
            if (year < yearLowerLimit || year > yearUpperLimit)
                return {
                    invalid: 'Please enter a valid year of birth',
                };
            return null;
        };
    }

    /** US Phone Number */
    static phone(controlAlias?: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control?.value as string;
            if (!value) return null;
            const getError = (value: string) => {
                if (!value?.match(staticData.regexes.phoneNumber))
                    return `Please enter a valid ${
                        controlAlias || 'phone'
                    } number.`;
                else if (value?.length < 5)
                    return 'Phone number needs at least 5 digits';
                return '';
            };
            const error = getError(value);
            return error ? { invalid: error } : null;
        };
    }

    /** Legal name */
    static legalName(controlAlias?: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control?.value as string;
            if (!value) return null;
            return value.match(staticData.regexes.legalName)
                ? null
                : {
                      invalid: `${
                          controlAlias || 'Legal name'
                      } can only contain letters and spaces`,
                  };
        };
    }

    /** City */
    static city(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control?.value as string;
            if (!value) return null;
            return value.match(staticData.regexes.city)
                ? null
                : {
                      invalid:
                          'City field can only contain letters, numbers, dots, spaces, commas, single quotes and hyphens.',
                  };
        };
    }

    /** Apartment */
    static apartment(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control?.value as string;
            if (!value) return null;
            return value.match(staticData.regexes.apartment)
                ? null
                : {
                      invalid:
                          'Apartment field can only contain letters, numbers, dots, spaces, commas, single quotes and hyphens.',
                  };
        };
    }

    /** Apartment */
    static address(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control?.value as string;
            if (!value) return null;
            return value.match(staticData.regexes.address)
                ? null
                : {
                      invalid:
                          'Address field can only contain letters, numbers, dots, spaces, commas, single quotes and hyphens.',
                  };
        };
    }

    /** US Social Security Number */
    static ssn(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control?.value as string;
            if (!value) return null;
            return value.match(staticData.regexes.ssn)
                ? null
                : { invalid: 'Please enter a valid Social Security Number' };
        };
    }

    /** US Zip Code */
    static zipCode(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control?.value as string;
            if (!value) return null;
            return value.match(staticData.regexes.zipCode)
                ? null
                : { invalid: 'Please enter a valid Zip Code' };
        };
    }

    /** Password requirements */
    static passwordRequirements(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control?.value as string;
            if (!value) return null;
            let message = '';
            if (!/[0-9]/.test(value))
                message = 'contain at least one numeric character.';
            else if (!/[a-z]/.test(value))
                message = 'contain at least one upper case letter.';
            else if (!/[A-Z]/.test(value))
                message = 'contain at least one lower case letter.';
            else if (!/[&*#!@]/.test(value))
                message = 'contain at least one of these characters &*#,!@';
            else if (value.length < 8)
                message = 'be at least 8 characters in length.';
            else message = '';
            return message ? { invalid: `Password must ${message}` } : null;
        };
    }

    /**
     * This validator matches the control's value with
     * the one provided as a parameter.
     **/
    static valueMismatch(
        controlName: string,
        controlAlias: string
    ): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const valueToMatch = control?.parent?.get(controlName)?.value;
            const valueMismatched = control?.value !== valueToMatch;
            return valueMismatched
                ? {
                      invalid: `Value does not match${
                          controlAlias ? ` with that of - ${controlAlias}` : ''
                      }`,
                  }
                : null;
        };
    }

    static setFormError(form: FormGroup | null): void {
        if (form && Object.keys(form?.controls || {}).length) {
            for (const controlName in form.controls) {
                const control = form.controls[controlName];
                if (control && control.touched && control.invalid) {
                    const errors = control['errors'];
                    if (errors) {
                        if (errors['required']) {
                            form.setErrors({
                                message: `Fields highlighted in red are required.`,
                            });
                            return;
                        } else if (errors['invalid']) {
                            form.setErrors({
                                message: errors['invalid'],
                            });
                            return;
                        } else if (errors['email']) {
                            form.setErrors({
                                message: 'Please enter a valid email',
                            });
                            return;
                        }
                    }
                }
            }
            form.setErrors(null);
        }
    }

    static onControlBlur(
        control: AbstractControl | null,
        parent: FormGroup | null
    ): void {
        !control?.touched && control?.markAsTouched();
        parent && UclifFormValidators.setFormError(parent);
    }

    static hasError(control: AbstractControl | null): boolean {
        return (control?.touched && control?.invalid) || false;
    }

    static getError(control: AbstractControl | null): string {
        if (control?.errors) return control?.errors['message'] as string;
        return '';
    }
}
