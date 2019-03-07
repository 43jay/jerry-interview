/**
 * Represents a (open-bounded) range.
 */
class Range {
  constructor(start, end) {
    if (!this._validate(start, end)) {
      throw new Error(`Invalid range parameters. ${start} ${end}`);
    }

    this.start = start;
    this.end = end;
  }

  /**
   * True if provided range overlaps with this one.
   */
  overlaps(otherRange) {
    return (
      (this.start >= otherRange.start && this.start <= otherRange.end) ||
      (this.end >= otherRange.start && this.end <= otherRange.end) ||
      (this.start <= otherRange.start && this.end >= otherRange.end)
    );
  }

  /**
   * Merge otherRange into this, such that this one is the union of the two
   * ranges.
   * @param {*} otherRange
   */
  merge(otherRange) {
    if (otherRange.start < this.start) {
      this.start = otherRange.start;
    }
    if (otherRange.end > this.end) {
      this.end = otherRange.end;
    }
  }

  _validate(start, end) {
    if (start > end) {
      return false;
    }
    if (typeof start !== "number" || typeof end !== "number") {
      return false;
    }
    return true;
  }
}

export default Range;
