import { fieldRoutePathExtension } from "./fieldRoutePathExtension";
import { addFieldChildren } from "../utils/formly.spec.helpers";
import { FieldConfig } from "../models/Types";
import { FormlyExtension } from "@ngx-formly/core";


function createRoutableConfig(overrides?: Partial<FieldConfig>): FieldConfig {
    return {
        type: "stepper",
        ...overrides
    }
}

function createInputConfig(overrides?: Partial<FieldConfig>): FieldConfig {
    return {
        type: "input",
        ...overrides
    }
}

describe("fieldRoutePathExtension.prePopulate", () => {
    const formlyHook = fieldRoutePathExtension.prePopulate as Required<FormlyExtension>["prePopulate"];

    describe('Field Route Generation', () => {

        describe('Basic Route Generation', () => {
            it('Should generate route based on key', () => {
                const item = createInputConfig({ key: "test" });
                formlyHook(item);
                expect(item?.fieldRoute).toEqual(item.key)
            });

            it('Should handle numeric key', () => {
                const item = createInputConfig({ key: 4 });
                formlyHook(item);
                expect(item?.fieldRoute).toEqual(item.key?.toString())
            });

            it('Should handle compound key', () => {
                const key = ['parent', 'child'];
                const item = createInputConfig({ key: key.join(".") });
                formlyHook(item);
                expect(item?.fieldRoute).toEqual(key.join("-"))
            });

            it('Should handle array based key', () => {
                const key = ['parent', 'child'];
                const item = createInputConfig({ key: key });
                formlyHook(item);
                expect(item?.fieldRoute).toEqual(key.join("-"))
            });

            it('Should generate index-based route if parent exists', () => {
                const root: FieldConfig = {};
                const other = createRoutableConfig({ key: "other" });
                const parent = createRoutableConfig({ key: "parent" });
                const item = createInputConfig();
                const item2 = createInputConfig();
                addFieldChildren(root, other, parent);
                addFieldChildren(parent, item, item2);

                [root, other, parent, item, item2].forEach(formlyHook);
                expect(item?.fieldRoute).toEqual(`${parent.key}/0`)
                expect(item2?.fieldRoute).toEqual(`${parent.key}/1`)
            });

            it('Should use templateOptions.route instead of key if defined', () => {
                const route = "differentRoute";
                const item = createInputConfig({
                    key: "test",
                    templateOptions: {
                        route
                    }
                });
                formlyHook(item);
                expect(item?.fieldRoute).toEqual(route);
            })

            it('Should return "" for non routable component with no key or parent', () => {
                const item = createInputConfig();
                formlyHook(item);
                expect(item?.fieldRoute).toEqual("");
            });

            it('Should return undefined for routable field with no key or parent', () => {
                const item = createRoutableConfig({});
                formlyHook(item);
                expect(item?.fieldRoute).toEqual("");
            });

        });

        describe('Nested Children', () => {
            it('Should generate based on parent formRoute', () => {
                // create deeply nested tree
                // item1->item2->item3->item4->item5
                const item1 = createRoutableConfig({ key: "test", formRoute: "test" });
                const item2 = createInputConfig({ key: "test2" });

                addFieldChildren(item1, item2);

                // run the formly hook on our config
                [item1, item2].forEach(formlyHook)
                expect(item2?.fieldRoute).toEqual(`${item1.formRoute}/${item2.key}`);
            });

            it('Should generate fieldRoutes for all children', () => {
                // create deeply nested tree
                // item1->item2->item3->[item3_1,item3_2]

                const rootRoute = "test";

                const item1 = createRoutableConfig({ key: "test", formRoute: rootRoute });
                const item1_1 = createInputConfig({ key: "test1_1" });
                const item1_2 = createInputConfig({ key: "test1_2" });

                addFieldChildren(item1, item1_1, item1_2);
                // run the formly hook on our config
                [item1, item1_1, item1_2].forEach(formlyHook)

                expect(item1_1?.fieldRoute).toEqual(`${rootRoute}/${item1_1.key}`);
                expect(item1_2?.fieldRoute).toEqual(`${rootRoute}/${item1_2.key}`);
            });

            it('Should return index of item if no key but parent', () => {
                const item3 = createRoutableConfig({ key: "test3", formRoute: "test" });
                const item3_1 = createInputConfig({ key: "test3_1" });
                const item3_2 = createInputConfig();

                addFieldChildren(item3, item3_1, item3_2);

                [item3, item3_1, item3_2].forEach(formlyHook);

                expect(item3_2?.fieldRoute).toEqual(`${item3.formRoute}/${item3.fieldGroup?.indexOf(item3_2)}`);
            });
        });
    });

    describe('Form Route Generation', () => {

        it('Should not set formRoute if unroutable with no parent.formRoute', () => {
            const item1: FieldConfig = {};
            [item1].forEach(formlyHook);
            // todo: revisit if we want to have nice urls to first part of form
            expect(item1.formRoute).toEqual("");
        });
        it('Should set formRoute to parent.formRoute for first child', () => {
            const item1 = createRoutableConfig({ key: "test", formRoute: "test" });
            const item2 = createInputConfig({ key: "test2" });
            addFieldChildren(item1, item2);
            [item1, item2].forEach(formlyHook);
            expect(item2.formRoute).toEqual(item1.formRoute);
        });

        it('Should add formRoute to parent for non-first children', () => {
            const item1 = createRoutableConfig({ key: "test", formRoute: "test" });
            const item2 = createInputConfig({ key: "test2" });
            const item3 = createInputConfig({ key: "test3" });
            const item4 = createInputConfig({ key: "test4" });

            addFieldChildren(item1, item2, item3, item4);

            [item1, item2, item3, item4].forEach(formlyHook);

            expect(item2.formRoute).toEqual(item1.formRoute);
            expect(item3.formRoute).toEqual(`${item1.formRoute}/${item3.key}`);
            expect(item4.formRoute).toEqual(`${item1.formRoute}/${item4.key}`);
        });



        // describe('Routable fields', () => {
        //     it('Should generate based on parent formRoute', () => {
        //         const item1 = createRoutableConfig({ key: "test", formRoute: "test" });
        //         const item2 = createInputConfig({ key: "test2" });

        //         addFieldChildren(item1, item2);

        //         // run the formly hook on our config
        //         [item1, item2].forEach(formlyHook)
        //         expect(item2?.fieldRoute).toEqual(`${item1.formRoute}/${item2.key}`);
        //     });

        //     it('Should generate fieldRoutes for all children', () => {
        //         // create deeply nested tree
        //         // item1->item2->item3->[item3_1,item3_2]

        //         const rootRoute = "test";

        //         const item1 = createRoutableConfig({ key: "test", formRoute: rootRoute });
        //         const item1_1 = createInputConfig({ key: "test1_1" });
        //         const item1_2 = createInputConfig({ key: "test1_2" });

        //         addFieldChildren(item1, item1_1, item1_2);
        //         // run the formly hook on our config
        //         [item1, item1_1, item1_2].forEach(formlyHook)

        //         expect(item1_1?.fieldRoute).toEqual(`${rootRoute}/${item1_1.key}`);
        //         expect(item1_2?.fieldRoute).toEqual(`${rootRoute}/${item1_2.key}`);
        //     });

        //     it('Should return index of item if no key but parent', () => {
        //         const item3 = createRoutableConfig({ key: "test3", formRoute: "test" });
        //         const item3_1 = createInputConfig({ key: "test3_1" });
        //         const item3_2 = createInputConfig();

        //         addFieldChildren(item3, item3_1, item3_2);

        //         [item3, item3_1, item3_2].forEach(formlyHook);

        //         expect(item3_2?.fieldRoute).toEqual(`${item3.formRoute}/${item3.fieldGroup?.indexOf(item3_2)}`);
        //     });
        // });

    });


});