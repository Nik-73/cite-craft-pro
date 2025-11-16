/**
 * Writing Analysis View Component
 * Displays legal writing analysis and feedback
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, AlertCircle, FileText, TrendingUp } from 'lucide-react';
import type { WritingAnalysis } from '@/services/ai';

interface WritingAnalysisViewProps {
  analysis: WritingAnalysis;
}

export const WritingAnalysisView: React.FC<WritingAnalysisViewProps> = ({ analysis }) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      structure: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      argument: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      citation: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      clarity: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      'legal reasoning': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Writing Analysis
        </CardTitle>
        <CardDescription>Comprehensive legal writing assessment and feedback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Assessment */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Overall Assessment
          </h3>
          <p className="text-sm text-blue-900 dark:text-blue-100">{analysis.overallAssessment}</p>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">Citation Quality</h4>
              <span className={`text-2xl font-bold ${getScoreColor(analysis.citationQuality.score)}`}>
                {analysis.citationQuality.score}
              </span>
            </div>
            <Progress value={analysis.citationQuality.score} className="mb-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {analysis.citationQuality.feedback}
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">Legal Reasoning</h4>
              <span className={`text-2xl font-bold ${getScoreColor(analysis.legalReasoningScore)}`}>
                {analysis.legalReasoningScore}
              </span>
            </div>
            <Progress value={analysis.legalReasoningScore} className="mb-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Quality of legal argumentation and reasoning
            </p>
          </div>
        </div>

        <Separator />

        {/* Strengths */}
        {analysis.strengths.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Strengths
            </h3>
            <div className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-900 dark:text-green-100">{strength}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Weaknesses */}
        {analysis.weaknesses.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Areas for Improvement
            </h3>
            <div className="space-y-2">
              {analysis.weaknesses.map((weakness, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg"
                >
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-900 dark:text-red-100">{weakness}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Detailed Suggestions
            </h3>
            <ScrollArea className="h-96">
              <div className="space-y-3 pr-4">
                {analysis.suggestions
                  .sort((a, b) => {
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return (
                      priorityOrder[a.priority as keyof typeof priorityOrder] -
                      priorityOrder[b.priority as keyof typeof priorityOrder]
                    );
                  })
                  .map((suggestion, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(suggestion.priority)}
                          <Badge className={getCategoryColor(suggestion.category)}>
                            {suggestion.category}
                          </Badge>
                        </div>
                        <Badge
                          variant={
                            suggestion.priority === 'high'
                              ? 'destructive'
                              : suggestion.priority === 'medium'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {suggestion.priority} priority
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm mb-2">{suggestion.issue}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {suggestion.suggestion}
                      </p>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{analysis.strengths.length}</div>
            <div className="text-xs text-gray-500">Strengths</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{analysis.weaknesses.length}</div>
            <div className="text-xs text-gray-500">Weaknesses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analysis.suggestions.length}</div>
            <div className="text-xs text-gray-500">Suggestions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
