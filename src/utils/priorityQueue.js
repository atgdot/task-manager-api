class PriorityQueue {
    constructor() {
      this.heap = [];
    }
  
    // **Helper Functions**
    getParentIndex(index) {
      return Math.floor((index - 1) / 2);
    }
    getLeftChildIndex(index) {
      return 2 * index + 1;
    }
    getRightChildIndex(index) {
      return 2 * index + 2;
    }
  
    swap(i, j) {
      [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
  
    // **Insert Task into Priority Queue**
    enqueue(task) {
      this.heap.push(task);
      this.heapifyUp();
    }
  
    heapifyUp() {
      let index = this.heap.length - 1;
      while (
        index > 0 &&
        this.compare(this.heap[index], this.heap[this.getParentIndex(index)])
      ) {
        this.swap(index, this.getParentIndex(index));
        index = this.getParentIndex(index);
      }
    }
  
    // **Remove Highest Priority Task**
    dequeue() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();
  
      const topTask = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapifyDown();
      return topTask;
    }
  
    heapifyDown() {
      let index = 0;
      while (this.getLeftChildIndex(index) < this.heap.length) {
        let smallerChildIndex = this.getLeftChildIndex(index);
        if (
          this.getRightChildIndex(index) < this.heap.length &&
          this.compare(this.heap[this.getRightChildIndex(index)], this.heap[smallerChildIndex])
        ) {
          smallerChildIndex = this.getRightChildIndex(index);
        }
  
        if (this.compare(this.heap[index], this.heap[smallerChildIndex])) break;
  
        this.swap(index, smallerChildIndex);
        index = smallerChildIndex;
      }
    }
  
    // **Custom Comparator (Priority & Timestamp)**
    compare(taskA, taskB) {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      if (priorityOrder[taskA.priority] !== priorityOrder[taskB.priority]) {
        return priorityOrder[taskA.priority] < priorityOrder[taskB.priority];
      }
      return new Date(taskA.createdAt) < new Date(taskB.createdAt);
    }
  
    isEmpty() {
      return this.heap.length === 0;
    }
  
    getAllTasks() {
      return this.heap;
    }
  }
  
  module.exports = PriorityQueue;
  