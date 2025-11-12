import React, { useState } from 'react';
import MetricInfoModal from './MetricInfoModal';
import MultiMetricLeaderboard from './MultiMetricLeaderboard';
import ModelInsights from './ModelInsights';

const LeaderboardCard = ({ leaderboard }) => {
  const [showMetricInfo, setShowMetricInfo] = useState(false);
  const [viewMode, setViewMode] = useState('simple'); // 'simple' or 'detailed'
  const [selectedModel, setSelectedModel] = useState(null);

  return (
    <>
      <div className="w-full p-4 bg-gray-950 rounded-lg shadow-lg card-hover">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{leaderboard.dataset_name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm text-gray-400">
                {leaderboard.task_type.replace('_', ' ').toUpperCase()}
              </p>
              <span className="text-gray-600">|</span>
              <button
                onClick={() => setShowMetricInfo(true)}
                className="text-sm text-blue-400 hover:text-blue-300 underline cursor-pointer flex items-center space-x-1"
                title="Click to learn about this metric"
              >
                <span>Metric: {leaderboard.primary_metric}</span>
                <span className="text-xs">ℹ️</span>
              </button>
            </div>
          </div>
        <div className="flex items-center space-x-2">
          {leaderboard.url && (
            <a
              href={leaderboard.url}
              className="text-blue-400 hover:text-blue-500 text-sm underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Dataset
            </a>
          )}
          
          {/* View Toggle */}
          <div className="flex bg-gray-800 rounded">
            <button
              onClick={() => setViewMode('simple')}
              className={`px-3 py-1 text-xs rounded-l ${viewMode === 'simple' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            >
              Simple
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1 text-xs rounded-r ${viewMode === 'detailed' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
            >
              All Metrics
            </button>
          </div>
        </div>
      </div>
      
      {viewMode === 'simple' ? (
        <>
          <div className="grid grid-cols-4 text-white font-bold text-center bg-gray-900 p-4 rounded-t-lg">
            <div>Rank</div>
            <div>Model</div>
            <div>Score</div>
            <div>Last Updated</div>
          </div>
      
          <div>
            {leaderboard.entries.length === 0 ? (
              <div className="text-center p-8 text-gray-400">
                No submissions yet
              </div>
            ) : (
              leaderboard.entries.map((entry, index) => (
                <div
                  key={entry.submission_id}
                  className={`grid grid-cols-4 text-center p-4 cursor-pointer ${
                    index % 2 === 0 ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
                  } hover:bg-gray-600`}
                  onClick={() => setSelectedModel(entry)}
                >
                  <div className="flex items-center justify-center">
                    {entry.rank === 1 && <span className="mr-1">🥇</span>}
                    {entry.rank === 2 && <span className="mr-1">🥈</span>}
                    {entry.rank === 3 && <span className="mr-1">🥉</span>}
                    {entry.rank}
                  </div>
                  <div className="flex items-center justify-center">
                    {entry.model_name}
                    {entry.is_internal && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-500 rounded">Internal</span>
                    )}
                  </div>
                  <div>{entry.score.toFixed(4)}</div>
                  <div className="text-sm text-gray-300">{entry.updated_at}</div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <MultiMetricLeaderboard leaderboard={leaderboard} />
      )}
      
      {/* Show insights for selected model */}
      {selectedModel && selectedModel.detailed_scores && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg">
          <button
            onClick={() => setSelectedModel(null)}
            className="float-right text-gray-400 hover:text-white"
          >
            ✕
          </button>
          <ModelInsights
            scores={selectedModel.detailed_scores}
            primaryMetric={leaderboard.primary_metric}
            modelName={selectedModel.model_name}
          />
        </div>
      )}
    </div>

      {/* Metric Info Modal */}
      <MetricInfoModal
        metricName={leaderboard.primary_metric}
        isOpen={showMetricInfo}
        onClose={() => setShowMetricInfo(false)}
      />
    </>
  );
};

export default LeaderboardCard;

