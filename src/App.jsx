import { useEffect, useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);

  // Load tasks from local storage on initial render
  useEffect(() => {
    const storedList = localStorage.getItem("store");
    if (storedList) {
      const relist = JSON.parse(storedList);
      setList(relist);
    }
  }, []);

  // Store the list in local storage
  function storeLocally(updatedList) {
    localStorage.setItem("store", JSON.stringify(updatedList));
  }

  // Toggle the isDone property of the task
  function toggleActive(id) {
    setList((items) => {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, isDone: !item.isDone } : item
      );
      storeLocally(updatedItems); // Store updated list
      return updatedItems;
    });
  }

  // Delete a task from the list
  function deleteItem(id) {
    setList((items) => {
      const updatedItems = items.filter((item) => item.id !== id);
      storeLocally(updatedItems); // Store updated list
      return updatedItems;
    });
  }

  // Add a new task
  function addTask(e) {
    e.preventDefault();
    if (!task) return; // Do not submit empty tasks
    const newItem = { description: task, id: Date.now(), isDone: false };
    setList((prevList) => {
      const updatedList = [...prevList, newItem];
      storeLocally(updatedList); // Store updated list
      return updatedList; // Append to the list
    });
    setTask(""); // Clear input field
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Todo task={task} setTask={setTask} addTask={addTask} />
      <List list={list} ontoggle={toggleActive} deleteItem={deleteItem} />
    </div>
  );
}

// Input field and add button
function Todo({ task, setTask, addTask }) {
  return (
    <div className="flex md:flex-col gap-10 mt-[5%]">
      <h2 className="text-center text-white font-bold text-3xl">TODOLS</h2>
      <form onSubmit={addTask} className="flex justify-center w-screen">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-6/12 outline-none px-4 rounded-s-lg"
        />
        <button className="bg-[#3C6E71] text-white font-bold font-mono text-3xl p-4 px-6 rounded-r-lg">
          +
        </button>
      </form>
    </div>
  );
}

// List of tasks
function List({ list, ontoggle, deleteItem }) {
  return (
    <div className="relative lg:w-[55%] w-[57%] h-min self-center">
      {list.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          ontoggle={ontoggle}
          deleteItem={deleteItem}
        />
      ))}
    </div>
  );
}

function ListItem({ item, ontoggle, deleteItem }) {
  return (
    <div className="flex relative flex-row gap-8 bg-white lg:w-full w-full p-6 rounded-lg mt-5">
      <input
        type="checkbox"
        onChange={() => ontoggle(item.id)}
        checked={item.isDone}
      />
      <span className="flex flex-row justify-between w-full before:w-full before:absolute before:h-1 before:bg-[#3C6E71] before:bottom-0 before:left-0">
        <span
          className={`font-medium ${
            item.isDone ? "line-through text-gray-500 italic" : ""
          }`}
        >
          {item.description}
        </span>
        <button
          className="text-red-700 font-semiBold hover:text-red-500"
          onClick={() => deleteItem(item.id)}
        >
          del
        </button>
      </span>
    </div>
  );
}

export default App;
