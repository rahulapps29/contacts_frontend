import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    latitude: "",
    longitude: "",
    photo: null,
  });
  const [editingContact, setEditingContact] = useState(null);

  // Fetch all contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://contactsbackend.rahulluthra.in/api/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewContact({ ...newContact, photo: e.target.files[0] });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in newContact) {
      data.append(key, newContact[key]);
    }

    try {
      const response = await axios.post(
        "http://contactsbackend.rahulluthra.in/api/contacts",
        data
      );
      setContacts([...contacts, response.data.contact]);
      setNewContact({
        name: "",
        phone: "",
        email: "",
        address: "",
        latitude: "",
        longitude: "",
        photo: null,
      });
      alert("Contact created successfully!");
    } catch (error) {
      console.error("Error creating contact:", error.message);
      alert("Failed to create contact.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;
    try {
      await axios.delete(`http://contactsbackend.rahulluthra.in/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
      alert("Contact deleted successfully!");
    } catch (error) {
      console.error("Error deleting contact:", error.message);
      alert("Failed to delete contact.");
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
  };

  const handleFileEditChange = (e) => {
    setEditingContact({ ...editingContact, photo: e.target.files[0] });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in editingContact) {
      if (key !== "photo" || editingContact[key] instanceof File) {
        data.append(key, editingContact[key]);
      }
    }

    try {
      const response = await axios.put(
        `http://contactsbackend.rahulluthra.in/api/contacts/${editingContact._id}`,
        data
      );
      setContacts(
        contacts.map((contact) =>
          contact._id === editingContact._id ? response.data.contact : contact
        )
      );
      setEditingContact(null);
      alert("Contact updated successfully!");
    } catch (error) {
      console.error("Error updating contact:", error.message);
      alert("Failed to update contact.");
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center">Contact Manager</h1>

      {/* Create Contact Form */}
      <div className="mb-4">
        <h3>Create New Contact</h3>
        <form onSubmit={handleCreate} className="p-4 shadow rounded bg-light">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={newContact.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Phone"
              value={newContact.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={newContact.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="Address"
              value={newContact.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Photo</label>
            <input
              type="file"
              name="photo"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Create Contact
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search contacts by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Contact List */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Contact List</h5>
          {filteredContacts.length === 0 ? (
            <p>No contacts found.</p>
          ) : (
            <ul className="list-group">
              {filteredContacts.map((contact) => (
                <li
                  key={contact._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={`http://contactsbackend.rahulluthra.in/${contact.photo}`}
                      alt="Contact"
                      className="rounded-circle me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <strong>{contact.name}</strong>
                      <br />
                      Phone: {contact.phone}
                      <br />
                      Email: {contact.email}
                      <br />
                      Address: {contact.address}
                      <br />
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(contact)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(contact._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Edit Contact Form */}
      {editingContact && (
        <div className="mt-4">
          <h3>Edit Contact</h3>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={editingContact.name}
                onChange={(e) =>
                  setEditingContact({ ...editingContact, name: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                value={editingContact.phone}
                onChange={(e) =>
                  setEditingContact({
                    ...editingContact,
                    phone: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={editingContact.email}
                onChange={(e) =>
                  setEditingContact({
                    ...editingContact,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={editingContact.address}
                onChange={(e) =>
                  setEditingContact({
                    ...editingContact,
                    address: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Photo</label>
              <input
                type="file"
                name="photo"
                className="form-control"
                onChange={handleFileEditChange}
              />
            </div>
            <button type="submit" className="btn btn-success me-2">
              Update
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditingContact(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
