const e = React.createElement;

function TodoList() {
  const [items, setItems] = React.useState(() => {
    // تحميل البيانات من Local Storage
    const saved = localStorage.getItem("todoItems");
    return saved ? JSON.parse(saved) : ["تفاح", "موز"];
  });

  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    // حفظ البيانات عند كل تغيير
    localStorage.setItem("todoItems", JSON.stringify(items));
  }, [items]);

  function addItem() {
    if (inputValue.trim() !== "") {
      setItems([...items, inputValue]);
      setInputValue("");
    }
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  // سحب وإفلات (Drag & Drop)
  function onDragStart(e, index) {
    e.dataTransfer.setData("dragIndex", index);
  }

  function onDrop(e, dropIndex) {
    const dragIndex = e.dataTransfer.getData("dragIndex");
    if (dragIndex === "") return;
    const newItems = [...items];
    const [draggedItem] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    setItems(newItems);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  return e("div", null,
    e("h2", null, "قائمة ديناميكية متقدمة"),
    e("div", { style: { marginBottom: "15px" } },
      e("input", {
        type: "text",
        placeholder: "أضف عنصر...",
        value: inputValue,
        onChange: (e) => setInputValue(e.target.value)
      }),
      e("button", { onClick: addItem, style: { backgroundColor: "#28a745", color: "white" } }, "إضافة")
    ),
    e("ul", null,
      items.map((item, index) =>
        e("li", {
          key: index,
          draggable: true,
          onDragStart: (e) => onDragStart(e, index),
          onDrop: (e) => onDrop(e, index),
          onDragOver: onDragOver
        },
          item,
          e("button", { onClick: () => removeItem(index), style: { backgroundColor: "#dc3545", color: "white" } }, "حذف")
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("reactRoot"));
root.render(e(TodoList));