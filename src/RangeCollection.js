import FastPriorityQueue from "fastpriorityqueue";
import Range from "./Range";

/**
 * RangeCollection class
 * Maintains a priority queue of intervals, sorted on interval start time.
 */
class RangeCollection {
  constructor() {
    this.priorityQueue = new FastPriorityQueue((first, second) => {
      return first.start < second.start;
    });
  }

  /**
   * Adds a range to the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  add(range) {
    let insertRange = new Range(range[0], range[1]);

    const elementsToRemove = [];
    insertRange = this._mergeRange(elementsToRemove, insertRange);

    this.priorityQueue.removeMany(
      value => elementsToRemove.indexOf(value) != -1
    );

    // Make sure to re-add merged interval.
    this.priorityQueue.add(insertRange);
  }

  /**
   * Helper merges conflicting ranges with the range being inserted.
   * @param {Array} elementsToRemove Track ranges which must be removed from collection
   * @param {Range} insertRange Range which is being inserted.
   */
  _mergeRange(elementsToRemove, insertRange) {
    this.priorityQueue.forEach((value, index) => {
      // Check whether this value conflicts with provided range. If so, merge it in.
      if (value.overlaps(insertRange)) {
        insertRange.merge(value);
        elementsToRemove.push(value);
      } else if (value.start > insertRange.end) {
        return insertRange;
      }
    });
    return insertRange;
  }

  /**
   * Removes a range from the collection.
   * Iterate over collection, updating or removing. ranges that overlap with the specified range.
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  remove(range) {
    let removalRange = new Range(range[0], range[1]);

    // Loop over collection, applying update logic.
    const elementsToRemove = [];
    this._removeRange(elementsToRemove, removalRange);

    this.priorityQueue.removeMany(
      value => elementsToRemove.indexOf(value) != -1
    );
  }

  _removeRange(elementsToRemove, removalRange) {
    this.priorityQueue.forEach((value, index) => {
      //
      if (value.overlaps(removalRange)) {
        const isEmpty = value.complementMerge(removalRange);
        if (isEmpty) {
          elementsToRemove.push(value);
        }
      } else if (value.start > insertRange.end) {
        return insertRange;
      }
    });
  }

  /**
   * Splits range and returns list of new ranges.
   * Can return up to 2 new ranges in cases where input range is split in 2.
   * @returns List of new valid ranges after the split
   * @param {Range} range Range over which to split
   * @param {Range} splitRange Range defining interval to remove.
   */
  _splitRange(range, splitRange) {
    const splitRanges = [];
    // `splitRange` covers lesser part.
    if (range.end > splitRange.end) {
      splitRanges.push(new Range(splitRange.end, range.end));
    }
    // `splitRange` covers greater part.
    if (range.start < splitRange.start) {
      splitRanges.push(new Range(range.start, splitRange.start));
    }
    // `splitRange` falls outside.
    if (range.start < splitRange.start && range.end < splitRange.end) {
      splitRanges.push(new Range(range.start, range.end));
    }
    return splitRanges;
  }

  /**
   * Prints out the list of ranges in the range collection
   */
  print() {
    let outputBuilder = "";
    this.priorityQueue.forEach(
      value => (outputBuilder += `[${value.start},${value.end}) `)
    );
    console.log(outputBuilder);
  }
}

export default RangeCollection;
