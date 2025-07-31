import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronRight, Search, Filter, Menu, BarChart3 } from 'lucide-react';

const AdminNestedTable = () => {
  
  const [data, setData] = useState([
    {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      status: 'Active',
      createdAt: '2025-07-30',
      children: [
        {
          id: 11,
          name: 'Smartphones',
          description: 'Mobile phones and accessories',
          status: 'Active',
          createdAt: '2024-01-16',
          children: [
            { id: 111, name: 'iPhone 15', description: 'Latest Apple smartphone', status: 'Active', createdAt: '2024-01-17' },
            { id: 112, name: 'Samsung Galaxy S24', description: 'Android flagship phone', status: 'Active', createdAt: '2024-01-18' },
            { id: 113, name: 'Google Pixel 8a', description: 'Mid Range-Phone' , status: 'Active', createdAt: '2024-01-19'},
            { id: 114, name: 'Poco M6 Pro', description: 'Budget Smartphone' , status: 'Inactive', createdAt: '2024-01-20'},
            { id: 115, name: 'iQOO 12', description: 'Gaming Smartphones' , status: 'Active', createdAt: '2024-01-21'}
          ]
        },
        {
          id: 12,
          name: 'Laptops',
          description: 'Portable computers',
          status: 'Active',
          createdAt: '2024-01-19',
          children: [
            { id: 121, name: 'MacBook Pro', description: 'Professional laptop', status: 'Active', createdAt: '2024-01-20' },
            { id: 122, name: 'Dell XPS', description: 'Windows ultrabook', status: 'Inactive', createdAt: '2024-01-21' }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Clothing',
      description: 'Fashion and apparel',
      status: 'Active',
      createdAt: '2024-01-22',
      children: [
        {
          id: 21,
          name: 'Men\'s Wear',
          description: 'Clothing for men',
          status: 'Active',
          createdAt: '2024-01-23',
          children: [
            { id: 211, name: 'Shirts', description: 'Formal and casual shirts', status: 'Active', createdAt: '2024-01-24' },
            { id: 212, name: 'Pants', description: 'Trousers and jeans', status: 'Active', createdAt: '2024-01-25' }
          ]
        },
        {
          id: 22,
          name: 'Women\'s Wear',
          description: 'Clothing for women',
          status: 'Active',
          createdAt: '2024-01-23',
          children: [
            { id: 221, name: 'Top', description: 'Formal and casual shirts', status: 'Inactive', createdAt: '2024-01-24' },
            { id: 222, name: 'Pants', description: 'Trousers and jeans', status: 'Active', createdAt: '2024-01-25' }
          ]
        },
      ]
    }
  ]);

  const [expandedRows, setExpandedRows] = useState(new Set());
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', status: 'Active' });
  const [parentId, setParentId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  
  const getNextId = () => {
    const getAllIds = (items) => {
      let ids = [];
      items.forEach(item => {
        ids.push(item.id);
        if (item.children) {
          ids = ids.concat(getAllIds(item.children));
        }
      });
      return ids;
    };
    const allIds = getAllIds(data);
    return Math.max(...allIds) + 1;
  };

  
  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  
  const addItem = (items, parentId, newItem) => {
    if (!parentId) {
      return [...items, { ...newItem, id: getNextId(), createdAt: new Date().toISOString().split('T')[0], children: [] }];
    }
    
    return items.map(item => {
      if (item.id === parentId) {
        const children = item.children || [];
        return {
          ...item,
          children: [...children, { ...newItem, id: getNextId(), createdAt: new Date().toISOString().split('T')[0] }]
        };
      }
      if (item.children) {
        return { ...item, children: addItem(item.children, parentId, newItem) };
      }
      return item;
    });
  };

  const updateItem = (items, id, updatedItem) => {
    return items.map(item => {
      if (item.id === id) {
        return { ...item, ...updatedItem };
      }
      if (item.children) {
        return { ...item, children: updateItem(item.children, id, updatedItem) };
      }
      return item;
    });
  };

  const deleteItem = (items, id) => {
    return items.filter(item => {
      if (item.id === id) return false;
      if (item.children) {
        item.children = deleteItem(item.children, id);
      }
      return true;
    });
  };

  
  const handleAdd = () => {
    if (newItem.name.trim()) {
      setData(addItem(data, parentId, newItem));
      setNewItem({ name: '', description: '', status: 'Active' });
      setShowAddForm(false);
      setParentId(null);
    }
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleSave = () => {
    setData(updateItem(data, editingItem.id, editingItem));
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item and all its children?')) {
      setData(deleteItem(data, id));
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setNewItem({ name: '', description: '', status: 'Active' });
    setParentId(null);
  };

  
  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'All' || item.status === filterStatus;
      
      if (item.children) {
        item.children = filterItems(item.children);
      }
      
      return matchesSearch && matchesFilter;
    });
  };

  const filteredData = filterItems([...data]);

  
  const getStats = () => {
    const countItems = (items) => {
      let count = 0;
      items.forEach(item => {
        count++;
        if (item.children) {
          count += countItems(item.children);
        }
      });
      return count;
    };
    
    const topLevel = data.length;
    const secondLevel = data.reduce((acc, item) => acc + (item.children ? item.children.length : 0), 0);
    const thirdLevel = data.reduce((acc, item) => {
      if (!item.children) return acc;
      return acc + item.children.reduce((childAcc, child) => 
        childAcc + (child.children ? child.children.length : 0), 0);
    }, 0);
    const total = countItems(data);
    
    return { topLevel, secondLevel, thirdLevel, total };
  };

  const stats = getStats();


  const renderRow = (item, level = 0) => {
    const isExpanded = expandedRows.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isEditing = editingItem && editingItem.id === item.id;

    return (
      <React.Fragment key={item.id}>
        <tr className={`${level > 0 ? 'bg-gradient-to-blue from-gray-100 to-blue-100' : 'bg-white'} hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-200 transition-all duration-300 border-b border-gray-100 group`}>
          {/* Name Column */}
          <td className={`px-3 md:px-6 py-4 whitespace-nowrap ${level > 0 ? `pl-${Math.min(3 + level * 2, 12)}` : ''}`}>
            <div className="flex items-center space-x-2">
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="p-1 hover:bg-white/80 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-blue-600"  />) :
                    <ChevronRight className="w-3 h-3 text-red-600  " />
                  }
                </button>
              )}
              {!hasChildren && <div className="w-6"></div>}
              {isEditing ? (
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                />
              ) : (
                <span className={`font-semibold ${level === 0 ? 'text-gray-900 text-lg' : level === 1 ? 'text-gray-700 text-base' : 'text-gray-600 text-sm'} group-hover:text-blue-700 transition-colors duration-200`}>
                  {item.name}
                </span>
              )}
            </div>
          </td>

          {}
          <td className="hidden md:table-cell px-6 py-4">
            {isEditing ? (
              <input
                type="text"
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            ) : (
              <span className="text-gray-600 text-sm">{item.description}</span>
            )}
          </td>

          {}
          <td className="px-3 md:px-6 py-4 whitespace-nowrap">
            {isEditing ? (
              <select
                value={editingItem.status}
                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                className="px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            ) : (
              <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full shadow-sm ${
                item.status === 'Active' 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                  : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
              }`}>
                {item.status}
              </span>
            )}
          </td>

          {}
          <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
            {item.createdAt}
          </td>

          {/* Actions Column */}
          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right">
            <div className="flex items-center justify-end space-x-1">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
                    title="Save"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setParentId(item.id);
                      setShowAddForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
                    title="Add Child"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
        {hasChildren && isExpanded && item.children.map(child => renderRow(child, level +1))}
      </React.Fragment>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-2 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-6 md:mb-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm md:text-base flex items-center justify-center md:justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Nested Table 
              </p>
            </div>
            
            {}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white shadow-lg border border-gray-200"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 md:p-4 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="text-lg md:text-2xl font-bold">{stats.total}</div>
              <div className="text-xs md:text-sm opacity-90">Total Items</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 md:p-4 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="text-lg md:text-2xl font-bold">{stats.topLevel}</div>
              <div className="text-xs md:text-sm opacity-90">Categories</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 md:p-4 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="text-lg md:text-2xl font-bold">{stats.secondLevel}</div>
              <div className="text-xs md:text-sm opacity-90">Subcategories</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-3 md:p-4 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="text-lg md:text-2xl font-bold">{stats.thirdLevel}</div>
              <div className="text-xs md:text-sm opacity-90">Products</div>
            </div>
          </div>
        </div>

        {}
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6 mb-6 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-72 shadow-sm bg-white/90"
                />
              </div>
              <div className="relative flex-1 lg:flex-none">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white/90 shadow-sm w-full lg:w-auto"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full lg:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="font-semibold">Add Item</span>
            </button>
          </div>
        </div>

        {}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform animate-in fade-in duration-200">
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                {parentId ? 'Add Child Item' : 'Add New Item'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm resize-none"
                    rows="3"
                    placeholder="Enter item description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={newItem.status}
                    onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-8">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-100 to-blue-100">
                <tr>
                  <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-3 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-3 md:px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.length > 0 ? (
                  filteredData.map(item => renderRow(item))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-lg font-semibold text-gray-400">No items found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNestedTable;