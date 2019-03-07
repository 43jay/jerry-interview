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
   * Adds a range to the collection.
   * Loop through existing intervals, merging and removing any overlapping intervals with the interval to be
   * inserted.
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  add(range) {
    range = new Range(range[0], range[1]);
    let { rangesToRemove, insertRange } = this._mergeRange(range);

    this.priorityQueue.removeMany(value => rangesToRemove.has(value));

    this.priorityQueue.add(insertRange);
  }

  /**
   * Helper merges conflicting ranges with the range being inserted.
   * @param {Array} elementsToRemove Track ranges which must be removed from collection
   * @param {Range} insertRange Range which is being inserted.
   */
  _mergeRange(insertRange) {
    const rangesToRemove = new Set();
    this.priorityQueue.forEach(value => {
      // Check whether this value conflicts with provided range. If so, merge it in.
      if (value.overlaps(insertRange)) {
        insertRange.merge(value);
        rangesToRemove.add(value);
      }
    });

    return { insertRange, rangesToRemove };
  }

  /**
   * Removes a range from the collection.
   * Iterate over collection, updating or removing. ranges that overlap with the specified range.
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  remove(range) {
    let removalRange = new Range(range[0], range[1]);

    let { rangesToRemove, rangesToAdd } = this._removeRange(removalRange);

    this.priorityQueue.removeMany(value => rangesToRemove.has(value));
    rangesToAdd.forEach(newRange => this.priorityQueue.add(newRange));
  }

  /**
   * @returns {Object} Object containing Set of existing ranges to be removed, along with an Array
   * of the new ranges to be added.
   * @param {Range} removalRange Range to be removed from Collection.
   */
  _removeRange(removalRange) {
    const rangesToRemove = new Set();
    const rangesToAdd = [];
    this.priorityQueue.forEach(existingRange => {
      // Check for existing ranges that overlap, and calculate their new range.
      if (existingRange.overlaps(removalRange)) {
        this._splitRange(existingRange, removalRange).forEach(newRange => {
          rangesToAdd.push(newRange);
        });
        rangesToRemove.add(existingRange);
      }
    });

    return { rangesToRemove, rangesToAdd };
  }

  /**
   * Splits range and returns list of new ranges.
   * Can return up to 2 new ranges in cases where input range is split in 2.
   * Can return 0 ranges in cases where splitRange covers input range.
   * @returns List of new valid ranges after the split.
   * @param {Range} range Range over which to split.
   * @param {Range} splitRange Range defining interval to remove.
   */
  _splitRange(range, splitRange) {
    const splitRanges = [];
    // `splitRange` falls outside.
    if (range.end <= splitRange.start || range.start >= splitRange.end) {
      splitRanges.push(new Range(range.start, range.end));
      return splitRanges;
    }
    // `splitRange` covers lesser part.
    if (range.end > splitRange.end) {
      splitRanges.push(new Range(splitRange.end, range.end));
    }
    // `splitRange` covers greater part.
    if (range.start < splitRange.start) {
      splitRanges.push(new Range(range.start, splitRange.start));
    }
    return splitRanges;
  }

  /**
   * Prints out the list of ranges in the range collection.
   * @param logToConsole True to output via console.log. False to return output as string.
   */
  print(logToConsole = true) {
    let outputBuilder = "";
    this.priorityQueue.forEach(
      value => (outputBuilder += `[${value.start}, ${value.end}) `)
    );
    if (logToConsole) {
      console.log(outputBuilder);
    } else {
      return outputBuilder;
    }
  }
}

export default RangeCollection;
