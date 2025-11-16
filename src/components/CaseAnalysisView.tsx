/**
 * Case Analysis View Component
 * Displays comprehensive case analysis results
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Scale, FileText, Users, Calendar, Award } from 'lucide-react';
import type { ComprehensiveCaseAnalysis } from '@/services/ai';

interface CaseAnalysisViewProps {
  analysis: ComprehensiveCaseAnalysis;
}

export const CaseAnalysisView: React.FC<CaseAnalysisViewProps> = ({ analysis }) => {
  const getPrecedentialBadge = (value: string) => {
    const colors = {
      high: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    };
    return colors[value as keyof typeof colors] || colors.medium;
  };

  const getRelationshipBadge = (relationship: string) => {
    const colors = {
      followed: 'bg-green-100 text-green-800',
      distinguished: 'bg-blue-100 text-blue-800',
      overruled: 'bg-red-100 text-red-800',
      cited: 'bg-gray-100 text-gray-800',
    };
    return colors[relationship as keyof typeof colors] || colors.cited;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            {analysis.caseTitle}
          </div>
          <Badge className={getPrecedentialBadge(analysis.holding.precedentialValue)}>
            {analysis.holding.precedentialValue} precedential value
          </Badge>
        </CardTitle>
        <CardDescription>{analysis.citation}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Summary
          </h3>
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {analysis.summary.briefSummary}
              </p>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {analysis.summary.detailedSummary}
            </p>
          </div>

          {analysis.summary.keyFacts.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Key Facts</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.summary.keyFacts.map((fact, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.summary.proceduralHistory && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Procedural History</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {analysis.summary.proceduralHistory}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Holdings Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="w-4 h-4" />
            Legal Holdings
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <h4 className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Primary Holding
              </h4>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                {analysis.holding.primaryHolding}
              </p>
            </div>

            {analysis.holding.secondaryHoldings.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Secondary Holdings</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.holding.secondaryHoldings.map((holding, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      {holding}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <h4 className="text-xs font-semibold text-purple-900 dark:text-purple-100 mb-1">
                Rule of Law
              </h4>
              <p className="text-sm text-purple-900 dark:text-purple-100">
                {analysis.holding.ruleOfLaw}
              </p>
            </div>

            {analysis.holding.legalPrinciples.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Legal Principles</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.holding.legalPrinciples.map((principle, index) => (
                    <Badge key={index} variant="outline">
                      {principle}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Precedent Analysis Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-4 h-4" />
            Precedent Analysis
          </h3>

          {analysis.precedent.citedCases.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3">Cited Cases</h4>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {analysis.precedent.citedCases.map((citedCase, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h5 className="font-medium text-sm">{citedCase.caseName}</h5>
                        <Badge className={getRelationshipBadge(citedCase.relationship)}>
                          {citedCase.relationship}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{citedCase.citation}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {citedCase.relevance}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {analysis.precedent.legalTopics.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Legal Topics</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.precedent.legalTopics.map((topic, index) => (
                  <Badge key={index} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg">
              <h4 className="text-xs font-semibold text-gray-500 mb-1">Jurisdiction</h4>
              <p className="text-sm">{analysis.precedent.jurisdictionScope}</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="text-xs font-semibold text-gray-500 mb-1">Temporal Relevance</h4>
              <p className="text-sm">{analysis.precedent.temporalRelevance}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Metadata */}
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            Analyzed: {new Date(analysis.analysisMetadata.analyzedAt).toLocaleString()}
          </div>
          <div>
            Confidence: {(analysis.analysisMetadata.confidence * 100).toFixed(0)}% | Tokens:{' '}
            {analysis.analysisMetadata.tokensUsed.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
