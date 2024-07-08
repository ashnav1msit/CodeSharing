
/**
 * Filters null and undefined entries out of an array
 *
 * @export
 * @template T
 * @param {T[]} [array=[]]
 * @return {*}  {NonNullable<T>[]}
 */
export function filterNils<T = Array<any | null | undefined>>(array: T[] = []): NonNullable<T>[] {
    return array.filter(item => item !== undefined && item !== null) as NonNullable<T>[];
}

type NestedUnwrapper<T> = (item: T) => T[] | undefined

/**
 * Flattens nested / tree-like array structures
 *
 * @export
 * @template T
 * @param {T[]} [array=[]]
 * @param {((item: T) => T[] | undefined)} getChildren
 * @return {*}  {T[]}
 */
export function flattenNested<T>(array: T[] = [], getChildren: NestedUnwrapper<T>, predicate?: Predicate<T>): T[] {
    const isMatch: Predicate<T> = predicate ?? ((item: T) => true)
    function visitNodes(item: T): T[] {
        if (!isMatch(item)) {
            return [];
        }
        const children = getChildren(item)?.flatMap(visitNodes) || [];
        return [
            item,
            ...children
        ];
    }

    return array.flatMap(r => [...visitNodes(r)])
}

export type Predicate<T> = (item: T) => boolean;

/**
 * In place mutation that removes matching item / items
 *
 * @export
 * @template T
 * @param {T[]} array
 * @param {(T | ((item: T) => boolean))} itemOrPredicate
 * @param {boolean} [removeAll]
 */
export function removeItem<T>(array: T[], itemOrPredicate: T | Predicate<T>, removeAll: boolean = true): T[] {
    // NOTE: This will break for arrays of functions
    const predicate: Predicate<T> = typeof itemOrPredicate === "function"
        ? itemOrPredicate as Predicate<T>
        : (item: T) => item === itemOrPredicate

    let indexToRemove = array?.findIndex(predicate) ?? -1;
    while (indexToRemove >= 0) {
        array.splice(indexToRemove, 1);

        if (removeAll !== true) {
            break;
        }

        // Find the next item
        indexToRemove = array.findIndex(predicate);
    }

    return array;
}



/**
 * Finds the index of the last item that matches the predicate
 *
 * @export
 * @template T
 * @param {T[]} array
 * @param {Predicate<T>} predicate
 */
export function findLastIndex<T>(array: T[], predicate: Predicate<T>): number {
    const reversedIndex = [...array].reverse().findIndex(predicate);
    return reversedIndex >= 0 ? (array.length - 1) - reversedIndex : -1;
}

declare global {
    interface Array<T = any | null | undefined> {

        /**
         * Filters Null and Undefined entries out of an array
         *
         * @return {*}  {NonNullable<T>[]}
         * @memberof Array
         */
        filterNils(): NonNullable<T>[];


        /**
         * Flattens nested / tree-like array structures
         *
         * @param {(item: T) => T} unwrapper
         * @param {Predicate<T>} [predicate] - optional predicate to filter what is flattened
         * @return {*}  {T[]}
         * @memberof Array
         */
        flattenNested(unwrapper: NestedUnwrapper<T>, predicate?: Predicate<T>): T[];


        /**
         * In place removal of item(s)
         *
         * @param {ItemOrPredicate<T>} itemOrPredicate
         * @param {boolean} [removeAll]
         * @memberof Array
         */
        removeItem(itemOrPredicate: T | Predicate<T>, removeAll?: boolean): T[];

        /**
         * finds the index of the last occurance of an item
         *
         * @param {ItemOrPredicate<T>} itemOrPredicate
         * @param {boolean} [removeAll]
         * @memberof Array
         */
        findLastIndex(predicate: Predicate<T>): number;
    }
}

if (!Array.prototype.filterNils) {
    Object.defineProperty(Array.prototype, 'filterNils', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function _filterNils<T>(this: T[]): NonNullable<T>[] {
            return filterNils(this)
        }
    });
}

if (!Array.prototype.flattenNested) {
    Object.defineProperty(Array.prototype, 'flattenNested', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function _flattenNested<T>(this: T[], unwrapper: NestedUnwrapper<T>, predicate?: Predicate<T>): T[] {
            return flattenNested(this, unwrapper, predicate);
        }
    });
}

if (!Array.prototype.removeItem) {
    Object.defineProperty(Array.prototype, 'removeItem', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function _removeItem<T>(this: T[], itemOrPredicate: T | Predicate<T>, removeAll?: boolean): T[] {
            return removeItem(this, itemOrPredicate, removeAll);
        }
    });
}

if (!Array.prototype.findLastIndex) {
    Object.defineProperty(Array.prototype, 'findLastIndex', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function _findLastIndex<T>(this: T[], predicate: Predicate<T>): number {
            return findLastIndex(this, predicate);
        }
    });
}