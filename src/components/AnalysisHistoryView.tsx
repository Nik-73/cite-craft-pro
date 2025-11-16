/**
 * Analysis History View Component
 * Displays cost tracking and analysis history
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Download, Trash2, TrendingUp, Clock, Zap } from 'lucide-react';
import type { AnalysisManager } from '@/services/ai';

interface AnalysisHistoryViewProps {
  manager: AnalysisManager;
}

export const AnalysisHistoryView: React.FC<AnalysisHistoryViewProps> = ({ manager }) => {
  const [history, setHistory] = useState(manager.getHistory());
  const totalCost = manager.getTotalCost();

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear the analysis history?')) {
      manager.clearHistory();
      setHistory([]);
    }
  };

  const handleExport = () => {
    const jsonData = manager.exportAnalysisHistory();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-history-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      comprehensive_case_analysis: 'Case Analysis',
      batch_case_analysis: 'Batch Analysis',
      writing_analysis: 'Writing',
      citation_recommendations: 'Citations',
      quick_summary: 'Summary',
      holdings_extraction: 'Holdings',
      precedent_analysis: 'Precedents',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      comprehensive_case_analysis: 'bg-blue-100 text-blue-800',
      batch_case_analysis: 'bg-purple-100 text-purple-800',
      writing_analysis: 'bg-green-100 text-green-800',
      citation_recommendations: 'bg-yellow-100 text-yellow-800',
      quick_summary: 'bg-gray-100 text-gray-800',
      holdings_extraction: 'bg-red-100 text-red-800',
      precedent_analysis: 'bg-indigo-100 text-indigo-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Analysis History & Costs
            </CardTitle>
            <CardDescription>Track your AI analysis usage and costs</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={history.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              disabled={history.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cost Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
                Total Cost
              </h3>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              ${totalCost.toFixed(4)}
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Accumulated this session
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Total Analyses
              </h3>
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {history.length}
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              API calls made
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                Avg Cost/Analysis
              </h3>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              ${history.length > 0 ? (totalCost / history.length).toFixed(4) : '0.0000'}
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
              Per operation
            </p>
          </div>
        </div>

        <Separator />

        {/* Analysis List */}
        {history.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Analyses
            </h3>
            <ScrollArea className="h-96">
              <div className="space-y-2 pr-4">
                {history
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <div
                      key={item.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(item.type)}>
                            {getTypeLabel(item.type)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(item.timestamp)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">${item.cost.toFixed(4)}</div>
                          <div className="text-xs text-gray-500">
                            {item.tokensUsed.toLocaleString()} tokens
                          </div>
                        </div>
                      </div>

                      {/* Show brief preview based on analysis type */}
                      {item.type === 'comprehensive_case_analysis' && item.data.caseTitle && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {item.data.caseTitle}
                        </p>
                      )}
                      {item.type === 'writing_analysis' && item.data.legalReasoningScore && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            Reasoning Score:
                          </span>
                          <Badge variant="outline">{item.data.legalReasoningScore}/100</Badge>
                        </div>
                      )}
                      {item.type === 'citation_recommendations' &&
                        item.data.suggestedCases?.length && (
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {item.data.suggestedCases.length} citations suggested
                          </p>
                        )}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No analyses yet</p>
            <p className="text-xs mt-1">Your analysis history will appear here</p>
          </div>
        )}

        {/* Cost Breakdown by Type */}
        {history.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Cost Breakdown by Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(
                  history.reduce((acc, item) => {
                    acc[item.type] = (acc[item.type] || 0) + item.cost;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([type, cost]) => (
                  <div key={type} className="p-2 border rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">{getTypeLabel(type)}</div>
                    <div className="text-sm font-semibold">${cost.toFixed(4)}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
