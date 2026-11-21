import { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('borrow');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [deleteKey, setDeleteKey] = useState('');

  function fetchItems() {
    fetch('http://localhost:5000/api/items')
      .then((response) => response.json())
      .then((data) => setItems(data));
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, type, contact, description, deleteKey }),
    });

    if (!response.ok) {
      alert('Could not save item.');
      return;
    }

    setTitle('');
    setType('borrow');
    setContact('');
    setDescription('');
    setDeleteKey('');
    fetchItems();
  }

  async function deleteItem(id) {
    const enteredKey = window.prompt('Enter the delete key for this item:');
    if (!enteredKey) return;

    const response = await fetch(`http://localhost:5000/api/items/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deleteKey: enteredKey }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Could not delete item.');
      return;
    }

    fetchItems();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">CampusBorrow</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-300 rounded-lg p-4 mb-6 shadow-sm"
        >
          <h2 className="text-lg font-bold mb-3">Post an Item</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded p-2 text-sm"
              required
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border border-gray-300 rounded p-2 text-sm"
            >
              <option value="borrow">Borrow</option>
              <option value="giveaway">Giveaway</option>
              <option value="request">Request</option>
            </select>

            <input
              type="text"
              placeholder="Contact (phone or email)"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="border border-gray-300 rounded p-2 text-sm"
              required
            />

            <input
              type="password"
              placeholder="Secret Delete Key (to remove later)"
              value={deleteKey}
              onChange={(e) => setDeleteKey(e.target.value)}
              className="border border-gray-300 rounded p-2 text-sm"
              required
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded p-2 text-sm sm:col-span-2"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Add Item
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
            >
              <p className="text-xs font-bold uppercase text-blue-600 mb-1">
                {item.type}
              </p>

              <h2 className="text-lg font-bold text-gray-900">
                {item.title}
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                {item.description}
              </p>

              <div className="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-700 flex items-center justify-between gap-2">
                <span>Contact: {item.contact || item.phone}</span>

                <button
                  onClick={() => deleteItem(item._id)}
                  className="text-red-600 hover:underline font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;