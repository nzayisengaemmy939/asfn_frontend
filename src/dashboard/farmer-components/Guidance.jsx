import React, { useState, useEffect } from 'react';

const GuidanceComponent = () => {
  const [guidanceData, setGuidanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch guidance data from backend
  useEffect(() => {
    const fetchGuidanceData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:10000/api/guidance/all'); // Update with your actual backend URL
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log('Response status:', response.status);
          console.log('Response text:', errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.log('Non-JSON response:', responseText);
          throw new Error('Server returned non-JSON response');
        }
        
        const data = await response.json();
        setGuidanceData(data.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGuidanceData();
  }, []);
  console.log(guidanceData)

  // Get unique categories for filtering
  const categories = ['all', ...new Set(guidanceData.map(item => item.category).filter(Boolean))];

  const filteredGuidance = selectedCategory === 'all' 
    ? guidanceData 
    : guidanceData.filter(item => item.category === selectedCategory);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading guidance...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading guidance</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
          </button>
        ))}
      </div>

      {/* Guidance Cards */}
      {filteredGuidance.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No guidance available</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedCategory === 'all' ? 'No guidance data found.' : `No guidance found for ${selectedCategory} category.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {filteredGuidance.map((guidance, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {guidance.title || 'Untitled Guidance'}
                  </h3>
                  {guidance.category && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {guidance.category}
                    </span>
                  )}
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(guidance.priority)}`}>
                  {guidance.priority} priority
                </span>
              </div>

              {/* Target Animals */}
              {guidance.targetAnimals && guidance.targetAnimals.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">Target Animals: </span>
                  <div className="inline-flex flex-wrap gap-1 mt-1">
                    {guidance.targetAnimals.map((animal, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        {animal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {guidance.description && (
                <div className="mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {guidance.description}
                  </p>
                </div>
              )}

              {/* Content */}
              {guidance.content && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Details:</h4>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {guidance.content.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-1">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {guidance.recommendations && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recommendations:
                  </h4>
                  <div className="text-sm text-gray-700 leading-relaxed bg-blue-50 p-3 rounded-md">
                    {guidance.recommendations.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-1">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Precautions */}
              {guidance.precautions && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Precautions:
                  </h4>
                  <div className="text-sm text-gray-700 leading-relaxed bg-amber-50 p-3 rounded-md">
                    {guidance.precautions.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-1">{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuidanceComponent;