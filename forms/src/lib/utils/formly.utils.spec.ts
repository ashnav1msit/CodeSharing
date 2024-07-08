import { getFieldValueLabel, isFormlyFieldValid, flattenFields, findFieldByKey, includesChild } from "./formly.utils";
import { addFieldChildren } from "./formly.spec.helpers";
import { FieldConfig } from "../models/Types";

describe('Formly Utilities', () => {

    describe(`${isFormlyFieldValid.name}`, () => {

        const validField: FieldConfig = {
            key: "valid",
            formControl: {
                valid: true
            } as any
        }
        const invalidField: FieldConfig = {
            key: "invalid",
            formControl: {
                valid: false
            } as any
        }

        it('Should return valid state of field', () => {
            expect(isFormlyFieldValid(validField)).toEqual(true);
            expect(isFormlyFieldValid(invalidField)).toEqual(false);
        });

        describe('Nested Fields', () => {
            it('Should return valid state of nested fields', () => {
                expect(isFormlyFieldValid({
                    key: "test",
                    fieldGroup: [
                        validField
                    ]
                })).toEqual(true);

                expect(isFormlyFieldValid({
                    key: "test",
                    fieldGroup: [
                        invalidField
                    ]
                })).toEqual(false);
            });

            it('Should return valid state of deeply nested fields', () => {
                expect(isFormlyFieldValid({
                    key: "test",
                    fieldGroup: [
                        {
                            fieldGroup: [
                                {
                                    fieldGroup: [
                                        {
                                            fieldGroup: [
                                                validField
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                })).toEqual(true);

                expect(isFormlyFieldValid({
                    key: "test",
                    fieldGroup: [
                        {
                            fieldGroup: [
                                {
                                    fieldGroup: [
                                        {
                                            fieldGroup: [
                                                invalidField
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                })).toEqual(false);
            });

            it('Should return overall valid state of nested fields', () => {
                const field: FieldConfig = {
                    key: "test",
                    fieldGroup: [
                        { ...validField },
                        {
                            key: "Another valid",
                            ...validField
                        },
                    ]
                }

                expect(isFormlyFieldValid(field)).toEqual(true);

                field.fieldGroup?.push({ ...invalidField });

                expect(isFormlyFieldValid(field)).toEqual(false);
            });

            it('Should return overall valid state of nested fields at different levels', () => {

                expect(isFormlyFieldValid({
                    key: "test",
                    fieldGroup: [
                        {
                            fieldGroup: [
                                invalidField,
                                {
                                    fieldGroup: [
                                        {
                                            fieldGroup: [
                                                validField
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                })).toEqual(false);
            });
        });
    });

    describe(`${getFieldValueLabel.name}`, () => {

        it('Should return undefined if no value', () => {
            const field: FieldConfig = {
                key: "test",
            }

            expect(getFieldValueLabel(field)).toBeUndefined();
        });

        it('Should return the label of an options field', () => {
            const options = [
                { value: 0, label: "NO" },
                { value: 1, label: "YES" },
                { value: 2, label: "Maybe" },
            ]

            const field: FieldConfig = {
                key: "test",
                templateOptions: {
                    options
                }
            }

            options.forEach((option, index) => {
                // Set field value in model
                const model = {
                    [field.key as string]: option.value
                };
                expect(getFieldValueLabel({ ...field, model }))
                    .toEqual(option.label);
            });
        });

        it('Should return the value of the input if no options exist', () => {
            const field: FieldConfig = {
                key: "test",
            }

            const value = "SOME TEST VALUE";
            // Set field value in model
            const model = {
                [field.key as string]: value
            };
            expect(getFieldValueLabel({ ...field, model })).toEqual(value);
        });

    });

    describe(`${flattenFields.name}`, () => {

        it('Should return empty array if no field', () => {
            const field: any = undefined;
            expect(flattenFields(field)).toEqual([])
        });
        it('Should flatten nested fields into single array', () => {
            // Create nested field structure

            const field1: FieldConfig = {
                key: "field1",
            }
            const field2: FieldConfig = {
                key: "field2",
            }
            const field3: FieldConfig = {
                key: "field3",
                fieldGroup: [
                    field1,
                    field2
                ]
            }
            const field4: FieldConfig = {
                key: "field4",
                fieldGroup: [
                    field3
                ]
            }
            const field5: FieldConfig = {
                key: "field5",
                fieldGroup: [
                    field4
                ]
            }
            const field6: FieldConfig = {
                key: "field6",
                fieldGroup: [
                    field5,
                ]
            }

            expect(flattenFields(field6)).toEqual(expect.arrayContaining([
                field1,
                field2,
                field3,
                field4,
                field5,
                field6,
            ]));
        });
    });

    describe(`${findFieldByKey.name}`, () => {

        const root: FieldConfig = {
            key: "root"
        }

        const field_1: FieldConfig = {
            key: "field_1"
        }
        const field_1_1: FieldConfig = {
            key: "field_1_1"
        }
        const field_1_2: FieldConfig = {
            key: "field_1_2"
        }
        const field_2: FieldConfig = {
            key: "field_2"
        }
        const field_2_1: FieldConfig = {
            key: "field_2_1"
        }
        const field_2_1_1: FieldConfig = {
            key: "field_2_1_1"
        }

        addFieldChildren(field_1, field_1_1, field_1_2);
        addFieldChildren(field_2_1, field_2_1_1);
        addFieldChildren(field_2, field_2_1);
        addFieldChildren(root, field_1, field_2);

        // Just assert here in the event that addFieldChildren doesn't work
        expect(root.fieldGroup).toEqual(expect.arrayContaining([field_1, field_2]));

        it('Should return undefined for non existant key', () => {
            const found = findFieldByKey(root, "SOME THING")
            expect(found).toBeUndefined();
        });

        it('Should return find self', () => {
            const elementToFind = root;
            const found = findFieldByKey(root, elementToFind.key)
            expect(found).toBe(elementToFind);
        });

        it('Should find child', () => {
            const elementToFind = field_2;
            const found = findFieldByKey(root, elementToFind.key)
            expect(found).toBe(elementToFind);
        });
        it('Should find nested child', () => {
            const elementToFind = field_2_1_1;
            const found = findFieldByKey(root, elementToFind.key)
            expect(found).toBe(elementToFind);
        });

        it('Should find parent', () => {
            const elementToFind = field_2;
            const found = findFieldByKey(field_2_1, elementToFind.key)
            expect(found).toBe(elementToFind);
        });

        it('Should find child of parent', () => {
            const elementToFind = field_1_2;
            const found = findFieldByKey(field_2_1_1, elementToFind.key)
            expect(found).toBe(elementToFind);
        });
    });

    describe(`${includesChild.name}`, () => {
        const needle: FieldConfig = {
            key: "needle"
        }
        it('Should return true if needle is same as haystack', () => {
            expect(includesChild(needle, needle)).toEqual(true);
        });

        it('Should return true if needle is child of haystack', () => {
            const haystack: FieldConfig = {
                key: "haystack",
                fieldGroup: [
                    needle
                ]
            }
            expect(includesChild(haystack, needle)).toEqual(true);
        });

        it('Should return true if needle is deeply nested in haystack', () => {
            const haystack: FieldConfig = {
                key: "haystack",
                fieldGroup: [
                    {
                        fieldGroup: [
                            {
                                fieldGroup: [
                                    needle
                                ]
                            }
                        ]
                    }
                ]
            }
            expect(includesChild(haystack, needle)).toEqual(true);
        });

        it('Should return false if needle is not within haystack', () => {
            const haystack: FieldConfig = {
                key: "haystack",
                fieldGroup: [
                    {
                        key: "Something else",
                        fieldGroup: [
                            {
                                key: "other"
                            }
                        ]
                    }
                ]
            }
            expect(includesChild(haystack, needle)).toEqual(false);
        });
    })

});