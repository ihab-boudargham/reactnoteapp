import './App.css';
import React, { useState, useEffect } from "react";


const App = () => {

  // Load notes from local storage on component mount
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
  }, []);
  // Dummy Notes

  const [notes,setNotes] = useState([])

  // Add Notes
  const [title, setTitle] = useState("")
  const [content,setContent] = useState("")
  const [priority, setPriority] = useState("");
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("");

  const handleAddNotes = (event) => {
    event.preventDefault();

    const newNote = {
      id: notes.length +1,
      title: title,
      content:content,
      priority: priority,
      category:category,
    }

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveNotesToLocalStorage(updatedNotes);

    setTitle("")
    setContent("")
    setPriority("");
    setCategory("")
  }

  // Edit Notes
  const [selectedNotes,setSelectedNotes] = useState()

  const handleNoteClick = (note) => {
    if (!selectedNotes) {
      setSelectedNotes(note);
      setTitle(note.title);
      setContent(note.content);
      setPriority(note.priority)
      setCategory(note.category)
    }
  };

  // Save Edit Notes

  const handleUpdateNote = (event) => { 
    event.preventDefault();
    if(!selectedNotes) {
      return;
    }

    const updateNote = {
      id: selectedNotes.id ,
      title: title,
      content: content,
      priority: priority,
      category: category,
    }

    const updatedNotesList = notes.map((note)=>(note.id === selectedNotes.id ? updateNote : note))
    setNotes(updatedNotesList);
    saveNotesToLocalStorage(updatedNotesList); 
    setTitle("");
    setContent("");
    setPriority("");
    setCategory("");
    setSelectedNotes(null);
  
  }

  // Cancel Note
  const handleCancel = () => {
    setTitle("");
    setContent("");
    setPriority("");
    setCategory("");
    setSelectedNotes(null);
  };

  // Delete Note
  const handleDeleteNote = (event, noteId) => {
    event.stopPropagation(); 
  
    const updatedNotesList = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotesList);
  
    if (selectedNotes && selectedNotes.id === noteId) {
      setTitle("");
      setContent("");
      setPriority("");
      setCategory("");
      setSelectedNotes(null);
    }
  };


  // Filter notes according to priority
  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const filteredNotes =
  filter === "all" ? notes : notes.filter((note) => note.priority === filter);


  // Save notes to local storage
  const saveNotesToLocalStorage = (notes) => {
    localStorage.setItem("notes", JSON.stringify(notes));
  };


  return (
    <div className="app-container">
      <form className="note-form" 
      onSubmit={(event) => (selectedNotes ? handleUpdateNote(event) : handleAddNotes(event))}
      >

          <div className='flex justify-end'>
            <select
              className='bg-black rounded-lg p-2'
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

        <input 
        placeholder="Title" 
        required
        value = {title}
        onChange={(e) => setTitle(e.target.value)}
         />
        <textarea 
        placeholder="Content" 
        rows={10} 
        required 
        value = {content}
        onChange={(e) => setContent(e.target.value)}
        />
        <div className='flex justify-between'>
          <label>
            <input
              type="radio"
              name="priority"
              value="low"
              checked={priority === "low"}
              onChange={() => setPriority("low")}
            />
            Low
          </label>
          <label>
            <input
              type="radio"
              name="priority"
              value="medium"
              checked={priority === "medium"}
              onChange={() => setPriority("medium")}
            />
            Medium
          </label>
          <label>
            <input
              type="radio"
              name="priority"
              value="high"
              checked={priority === "high"}
              onChange={() => setPriority("high")}
            />
            High
          </label>
        </div>

        <label>
          <span className='mr-2'>Category :</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='bg-black p-2 rounded-lg'
          >
            <option value="">Select Category</option>
            <option value="Work">Work</option>
            <option value="University">University</option>
            <option value="Home">Home</option>
          </select>
        </label>
       

        {selectedNotes ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>

      <div className="notes-grid">
        {filteredNotes.map((note) => (
          <div
            className={`note-item priority-${note.priority}`}
            onClick={() => handleNoteClick(note)}
          >
            <div className="notes-header" type="click">
              <button onClick={(e) => handleDeleteNote(e, note.id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <div className='flex justify-around'>
            <p className="text-xs ">Priority: {note.priority}</p>
            <p className="text-xs ">Category: {note.category}</p>
            </div>
            <p className="">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default App;
