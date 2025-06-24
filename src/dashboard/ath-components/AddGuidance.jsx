import React, { useState } from 'react';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiEye, 
  HiSearch,
  HiFilter,
  HiDocumentText,
  HiExclamationCircle,
  HiCheckCircle,
  HiClock,
  HiX
} from 'react-icons/hi';

const GuidanceComponent = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuidance, setSelectedGuidance] = useState(null);
  
  // Sample guidance data
  const [guidanceList, setGuidanceList] = useState([
    {
      id: 1,
      title: "Cattle Vaccination Schedule",
      category: "vaccination",
      priority: "high",
      status: "active",
      description: "Complete vaccination schedule for pigs including Classical Swine Fever, FMD, and Erysipelas",
      targetAnimals: ["Pigs"],
      createdDate: "2024-01-15",
      lastUpdated: "2024-01-20"
    },
    {
      id: 2,
      title: "Poultry Disease Prevention",
      category: "disease-prevention",
      priority: "medium",
      status: "draft",
      description: "Preventive measures for common poultry diseases",
      targetAnimals: ["Chickens", "Ducks"],
      createdDate: "2024-01-10",
      lastUpdated: "2024-01-18"
    },
    {
      id: 3,
      title: "Goat Breeding Guidelines",
      category: "breeding",
      priority: "low",
      status: "active",
      description: "Best practices for goat breeding and pregnancy management",
      targetAnimals: ["Goats"],
      createdDate: "2024-01-05",
      lastUpdated: "2024-01-15"
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
    description: '',
    targetAnimals: ['Pigs'], // Default to Pigs since it's the only option
    content: '',
    recommendations: '',
    precautions: ''
  });

  const categories = [
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'disease-prevention', label: 'Disease Prevention' },
    { value: 'breeding', label: 'Breeding' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'treatment', label: 'Treatment' },
    { value: 'general-care', label: 'General Care' }
  ];

  const animals = ['Pigs'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAnimalToggle = (animal) => {
    setFormData(prev => ({
      ...prev,
      targetAnimals: prev.targetAnimals.includes(animal)
        ? prev.targetAnimals.filter(a => a !== animal)
        : [...prev.targetAnimals, animal]
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.description || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newGuidance = {
      id: Date.now(),
      ...formData,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setGuidanceList(prev => [newGuidance, ...prev]);
    setFormData({
      title: '',
      category: '',
      priority: 'medium',
      description: '',
      targetAnimals: ['Pigs'],
      content: '',
      recommendations: '',
      precautions: ''
    });
    setShowCreateForm(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <HiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'draft': return <HiClock className="w-5 h-5 text-yellow-500" />;
      case 'archived': return <HiExclamationCircle className="w-5 h-5 text-gray-500" />;
      default: return <HiDocumentText className="w-5 h-5 text-blue-500" />;
    }
  };

  const filteredGuidance = guidanceList.filter(guidance => {
    const matchesCategory = selectedCategory === 'all' || guidance.category === selectedCategory;
    const matchesSearch = guidance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guidance.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farmer Guidance Management</h1>
              <p className="text-gray-600 mt-1">Create and manage guidance documents for farmers</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <HiPlus className="w-5 h-5" />
              <span>Create Guidance</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search guidance..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <HiFilter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Guidance List */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredGuidance.map(guidance => (
            <div key={guidance.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(guidance.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(guidance.priority)}`}>
                    {guidance.priority}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedGuidance(guidance)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <HiEye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 p-1">
                    <HiPencil className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800 p-1">
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{guidance.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{guidance.description}</p>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {guidance.targetAnimals.map(animal => (
                    <span key={animal} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {animal}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 flex justify-between">
                <span>Created: {guidance.createdDate}</span>
                <span>Updated: {guidance.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Create Guidance Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Create New Guidance</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guidance Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter guidance title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the guidance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Animals *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {animals.map(animal => (
                      <label key={animal} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.targetAnimals.includes(animal)}
                          onChange={() => handleAnimalToggle(animal)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{animal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Detailed guidance content for farmers..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recommendations
                  </label>
                  <textarea
                    name="recommendations"
                    value={formData.recommendations}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Specific recommendations and best practices..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precautions & Warnings
                  </label>
                  <textarea
                    name="precautions"
                    value={formData.precautions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Important precautions and warnings..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create Guidance
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Guidance Modal */}
        {selectedGuidance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">{selectedGuidance.title}</h2>
                <button
                  onClick={() => setSelectedGuidance(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(selectedGuidance.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedGuidance.priority)}`}>
                    {selectedGuidance.priority} Priority
                  </span>
                  <span className="text-sm text-gray-500">
                    Category: {categories.find(c => c.value === selectedGuidance.category)?.label}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedGuidance.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Target Animals</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGuidance.targetAnimals.map(animal => (
                      <span key={animal} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {animal}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Created:</span> {selectedGuidance.createdDate}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {selectedGuidance.lastUpdated}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidanceComponent;