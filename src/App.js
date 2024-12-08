import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "./config"; // Import the configuration file
import "./App.css";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    coordinates: "",
  });
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/contacts`); // Use API_BASE_URL
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/contacts`, // Use API_BASE_URL
        newContact
      );
      setContacts([...contacts, response.data.contact]);
      setNewContact({
        name: "",
        phone: "",
        email: "",
        address: "",
        coordinates: "",
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
      await axios.delete(`${config.API_BASE_URL}/api/contacts/${id}`); // Use API_BASE_URL
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${config.API_BASE_URL}/api/contacts/${editingContact._id}`, // Use API_BASE_URL
        editingContact
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
          {/* Form fields */}
        </form>
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
                <li key={contact._id} className="list-group-item">
                  {/* Contact details */}
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
          <form onSubmit={handleUpdate}>{/* Edit form fields */}</form>
        </div>
      )}
    </div>
  );
};

export default App;
