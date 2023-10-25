import uniqid from "uniqid";
export default class List {
  constructor() {
    this.items = [];
  }

  deleteItem(id) {
    //id gedeg id-tei ortsiin index-iig massive-s haij olno
    const index = this.items.findIndex((el) => el.id === id);
    //Ug index deerh index-g massive-s ustgana
    this.items.splice(index, 1);
  }
  addItem(item) {
    let newItem = {
      id: uniqid(),
      item: item,
    };
    this.items.push(newItem);
    return newItem;
  }
}
