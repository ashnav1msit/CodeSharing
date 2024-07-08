import { FieldConfig, FormConfig } from "../models/Types";
import { getVisibleRoutes } from "./form-navigation.utils";
import { addFieldChildren } from "../utils/formly.spec.helpers";
describe(getVisibleRoutes.name, () => {
    const item1: FieldConfig = {
        key: "test1",
        type: "input",
        formRoute: "test1",
    }

    it('Should return route if hide is not defined', () => {
        const config: FormConfig = [
            item1
        ];
        const routes = getVisibleRoutes(config);
        expect(routes).toEqual([item1?.formRoute]);
    });

    it('Should return route if hide !== true', () => {
        const config: FormConfig = [
            {
                ...item1,
                hide: false
            }
        ];
        const routes = getVisibleRoutes(config);
        expect(routes).toEqual([item1?.formRoute]);
    });

    it('Should not return invisible route', () => {
        const config: FormConfig = [
            {
                ...item1,
                hide: true
            }
        ]
        const routes = getVisibleRoutes(config);
        expect(routes).toEqual([]);
    });

    it('Should return only return visible route once', () => {
        const config: FormConfig = [
            { ...item1 },
            { ...item1, key: "anotherItem" }
        ]
        const routes = getVisibleRoutes(config);
        expect(routes).toEqual([item1?.formRoute]);
    });

    it('Should return routes in same order as config', () => {
        const item1: FieldConfig = {
            key: "test1",
            type: "input",
            formRoute: "test1"
        }
        const item2: FieldConfig = {
            key: "test2",
            type: "input",
            formRoute: "test2"
        }
        const item3: FieldConfig = {
            key: "test3",
            type: "input",
            formRoute: "test3"
        }
        const item3_1: FieldConfig = {
            key: "test3_1",
            type: "input",
            formRoute: "test3_1"
        }

        addFieldChildren(item3, item3_1);
        addFieldChildren(item1, item3, item2);
        const config: FormConfig = [item1]

        const routes = getVisibleRoutes(config);
        expect(routes).toEqual([
            item1?.formRoute,
            item3?.formRoute,
            item3_1?.formRoute,
            item2?.formRoute
        ]);
    });

    it('Should not return routes to children of hidden parent', () => {
        const item1: FieldConfig = {
            key: "test1",
            type: "input",
            formRoute: "test1"
        }
        const item2: FieldConfig = {
            key: "test2",
            type: "input",
            formRoute: "test2"
        }
        const item3: FieldConfig = {
            key: "test3",
            type: "input",
            hide: true,
            formRoute: "test3"
        }
        const item3_1: FieldConfig = {
            key: "test3_1",
            type: "input",
            formRoute: "test3_1"
        }

        addFieldChildren(item3, item3_1);
        addFieldChildren(item1, item3, item2);
        const config: FormConfig = [item1]

        const routes = getVisibleRoutes(config);
        expect(routes).toEqual([
            item1?.formRoute,
            item2?.formRoute
        ]);
    });
});