class FenwickTree {
    constructor(size) {
      this.tree = new Array(size + 1).fill(0); 
      this.size = size;
    }
  
    update(index, delta) {
      index++; 
      while (index <= this.size) {
        this.tree[index] += delta;
        index += index & -index; 
      }
      
    }
  
    getSum(index) {
      index++;
      let sum = 0;
      while (index > 0) {
        sum += this.tree[index];
        index -= index & -index; 
      }
      return sum;
    }
  
    getRangeSum(start, end) {
      if (start > end || start < 0 || end >= this.size) return 0;
      return this.getSum(end) - this.getSum(start - 1);
    }
  }
  
  export default FenwickTree;