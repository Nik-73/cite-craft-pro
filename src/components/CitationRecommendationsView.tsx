/**
 * Citation Recommendations View Component
 * Displays AI-generated citation suggestions
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import type { CitationRecommendation } from '@/services/ai';

interface CitationRecommendationsViewProps {
  recommendations: CitationRecommendation;
  onAddCitation?: (citation: any) => void;
}

export const CitationRecommendationsView: React.FC<CitationRecommendationsViewProps> = ({
  recommendations,
  onAddCitation,
}) => {
  const getRelevanceColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getRelevanceLabel = (score: number) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Moderate';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Citation Recommendations
        </CardTitle>
        <CardDescription>
          AI-suggested cases to strengthen your legal arguments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Strength Assessment */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Citation Strength Assessment
          </h3>
          <p className="text-sm text-blue-900 dark:text-blue-100">
            {recommendations.strengthAssessment}
          </p>
        </div>

        {/* Missing Topics */}
        {recommendations.missingTopics.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Missing Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {recommendations.missingTopics.map((topic, index) => (
                <Badge key={index} variant="outline" className="text-yellow-700 border-yellow-300">
                  {topic}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Consider adding citations related to these topics to strengthen your arguments
            </p>
          </div>
        )}

        <Separator />

        {/* Suggested Cases */}
        {recommendations.suggestedCases.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Suggested Cases</h3>
              <Badge variant="secondary">{recommendations.suggestedCases.length} suggestions</Badge>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-4 pr-4">
                {recommendations.suggestedCases
                  .sort((a, b) => b.relevanceScore - a.relevanceScore)
                  .map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow space-y-3"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{suggestion.caseName}</h4>
                          <p className="text-xs text-gray-500 font-mono">{suggestion.citation}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Relevance</div>
                            <div className="text-lg font-bold">{suggestion.relevanceScore}</div>
                          </div>
                          <div
                            className={`w-2 h-12 rounded ${getRelevanceColor(suggestion.relevanceScore)}`}
                          />
                        </div>
                      </div>

                      {/* Relevance Badge */}
                      <Badge
                        className={
                          suggestion.relevanceScore >= 80
                            ? 'bg-green-100 text-green-800'
                            : suggestion.relevanceScore >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-orange-100 text-orange-800'
                        }
                      >
                        {getRelevanceLabel(suggestion.relevanceScore)} Relevance
                      </Badge>

                      {/* Reason */}
                      <div>
                        <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Why cite this case:
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{suggestion.reason}</p>
                      </div>

                      {/* Suggested Location */}
                      <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded">
                        <h5 className="text-xs font-semibold text-purple-900 dark:text-purple-100 mb-1">
                          Suggested placement:
                        </h5>
                        <p className="text-xs text-purple-900 dark:text-purple-100">
                          {suggestion.suggestedLocation}
                        </p>
                      </div>

                      {/* Add Button */}
                      {onAddCitation && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            onAddCitation({
                              author: suggestion.caseName.split(',')[0] || suggestion.caseName,
                              title: suggestion.caseName,
                              year: '',
                              publication: suggestion.citation,
                              url: '',
                              doi: '',
                            })
                          }
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Citations
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {recommendations.suggestedCases.length}
            </div>
            <div className="text-xs text-gray-500">Suggested Cases</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {recommendations.missingTopics.length}
            </div>
            <div className="text-xs text-gray-500">Missing Topics</div>
          </div>
        </div>

        {recommendations.suggestedCases.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No citation recommendations generated</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
