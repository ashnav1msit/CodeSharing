import { filterNils, findLastIndex, flattenNested, Predicate, removeItem } from "./array.utils";

const expected = ["string"]

describe(filterNils.name, () => {
    it('Should filter out undefined entries', () => {
        const test = [...expected, undefined];
        expect(filterNils(test)).toEqual(expected);
    });

    it('Should filter out null entries', () => {
        const test = [...expected, null];
        expect(filterNils(test)).toEqual(expected);
    });
});

describe('array.filterNils', () => {
    it('Should filter out undefined entries', () => {
        const test = [...expected, undefined];
        expect(test.filterNils()).toEqual(expected);
    });

    it('Should filter out null entries', () => {
        const test = [...expected, undefined];
        expect(test.filterNils()).toEqual(expected);
    });
});

interface TestNode {
    name: string;
    children?: TestNode[]
}

describe(flattenNested.name, () => {
    it('Should return array if no nested fields present', () => {
        const item1: TestNode = {
            name: "item1",
        }
        const item2: TestNode = {
            name: "item2",
        }

        expect(flattenNested([item1, item2], (n) => n.children)).toEqual([item1, item2]);
    });

    it('Should unwrap nested fields', () => {
        const item1: TestNode = {
            name: "item1",
        }
        const item2: TestNode = {
            name: "item2",
        }
        const item3: TestNode = {
            name: "item3",
        }
        const item4: TestNode = {
            name: "item4",
        }

        item3.children = [item4];
        item2.children = [item3];
        item1.children = [item2];

        expect(flattenNested([item1], (n) => n.children)).toEqual([item1, item2, item3, item4]);
    });

    it('Should use predicate if present', () => {
        const item1: TestNode = {
            name: "item1",
        }
        const item2: TestNode = {
            name: "item2",
        }
        const item3: TestNode = {
            name: "item3",
        }
        const item4: TestNode = {
            name: "item4",
        }

        item3.children = [item4];
        item2.children = [item3];
        item1.children = [item2];

        expect(flattenNested([item1], (n) => n.children, (n) => n.name !== item3.name)).toEqual([item1, item2]);
    });
});

describe('array.flattenNested', () => {
    it('Should return array if no nested fields present', () => {
        const item1: TestNode = {
            name: "item1",
        }
        const item2: TestNode = {
            name: "item2",
        }

        expect([item1, item2].flattenNested((n) => n.children)).toEqual([item1, item2]);
    });

    it('Should unwrap nested fields', () => {
        const item1: TestNode = {
            name: "item1",
        }
        const item2: TestNode = {
            name: "item2",
        }
        const item3: TestNode = {
            name: "item3",
        }
        const item4: TestNode = {
            name: "item4",
        }

        item3.children = [item4];
        item2.children = [item3];
        item1.children = [item2];

        expect([item1].flattenNested((n) => n.children)).toEqual([item1, item2, item3, item4]);
    });

    it('Should use predicate if present', () => {
        const item1: TestNode = {
            name: "item1",
        }
        const item2: TestNode = {
            name: "item2",
        }
        const item3: TestNode = {
            name: "item3",
        }
        const item4: TestNode = {
            name: "item4",
        }

        item3.children = [item4];
        item2.children = [item3];
        item1.children = [item2];

        expect([item1].flattenNested((n) => n.children, (n) => n.name !== item3.name)).toEqual([item1, item2]);
    });
});


describe(removeItem.name, () => {
    const item1 = "one";
    const item2 = "two";
    const item3 = "three";

    const cases: { name: string, itemOrPredicate: string | Predicate<string>, itemToRemove: string }[] = [
        {
            name: "using Item",
            itemOrPredicate: item2,
            itemToRemove: item2
        },
        {
            name: "using predicate",
            itemOrPredicate: (it) => it === item2,
            itemToRemove: item2
        },
    ]

    cases.forEach(({ name, itemOrPredicate, itemToRemove }) => {
        describe(name, () => {
            it('Should mutate array in place', () => {
                const items = [item1, itemToRemove, item3];
                const newItems = removeItem(items, itemOrPredicate);
                expect(items).toBe(newItems);
                expect(items).toEqual([item1, item3]);
            });

            describe("using Item", () => {
                const itemToRemove = item2;
                it('Should remove an item from an array', () => {
                    const items = [item1, itemToRemove, item3];
                    expect(removeItem(items, itemOrPredicate)).toEqual(expect.arrayContaining([item1, item3]));
                });

                it('Should remove all items from array by default', () => {
                    const items = [item1, itemToRemove, item3, itemToRemove, itemToRemove];
                    expect(removeItem(items, itemToRemove)).toEqual(expect.arrayContaining([item1, item3]));
                });

                it('Should only remove first item if removeAll=false', () => {
                    const items = [item1, itemToRemove, item3, itemToRemove, itemToRemove];
                    expect(removeItem(items, itemToRemove, false)).toEqual(expect.arrayContaining([item1, item3, itemToRemove, itemToRemove]));
                });
            });
        });
    });
});

describe("array.removeItem", () => {
    const item1 = "one";
    const item2 = "two";
    const item3 = "three";

    const cases: { name: string, itemOrPredicate: string | Predicate<string>, itemToRemove: string }[] = [
        {
            name: "using Item",
            itemOrPredicate: item2,
            itemToRemove: item2
        },
        {
            name: "using predicate",
            itemOrPredicate: (it) => it === item2,
            itemToRemove: item2
        },
    ]

    cases.forEach(({ name, itemOrPredicate, itemToRemove }) => {
        describe(name, () => {
            it('Should mutate array in place', () => {
                const items = [item1, itemToRemove, item3];
                const newItems = items.removeItem(itemOrPredicate);
                expect(items).toBe(newItems);
                expect(items).toEqual([item1, item3]);
            });

            describe("using Item", () => {
                const itemToRemove = item2;
                it('Should remove an item from an array', () => {
                    const items = [item1, itemToRemove, item3];
                    expect(items.removeItem(itemOrPredicate)).toEqual(expect.arrayContaining([item1, item3]));
                });

                it('Should remove all items from array by default', () => {
                    const items = [item1, itemToRemove, item3, itemToRemove, itemToRemove];
                    expect(items.removeItem(itemToRemove)).toEqual(expect.arrayContaining([item1, item3]));
                });

                it('Should only remove first item if removeAll=false', () => {
                    const items = [item1, itemToRemove, item3, itemToRemove, itemToRemove];
                    expect(items.removeItem(itemToRemove, false)).toEqual(expect.arrayContaining([item1, item3, itemToRemove, itemToRemove]));
                });
            });
        });
    });
});


describe(findLastIndex.name, () => {
    const item1 = "one";
    const item2 = "two";
    const item3 = "three";

    it('Should return -1 if item cant be found', () => {
        const items = [item2, item3];
        expect(findLastIndex(items, (i) => i === item1)).toEqual(-1);
    });

    it('Should find occurence of item', () => {
        const items = [item1, item2, item3];
        expect(findLastIndex(items, (i) => i === item1)).toEqual(0);
    });

    it('Should find last occurence of item', () => {
        const items = [item1, item2, item3, item1];
        expect(findLastIndex(items, (i) => i === item1)).toEqual(3);
    });
});

describe("array.findLastIndex", () => {
    const item1 = "one";
    const item2 = "two";
    const item3 = "three";


    it('Should return -1 if item cant be found', () => {
        const items = [item2, item3];
        expect(items.findLastIndex((i) => i === item1)).toEqual(-1);
    });

    it('Should find occurence of item', () => {
        const items = [item1, item2, item3];
        expect(items.findLastIndex((i) => i === item1)).toEqual(0);
    });

    it('Should find last occurence of item', () => {
        const items = [item1, item2, item3, item1];
        expect(items.findLastIndex((i) => i === item1)).toEqual(3);
    });
});