/**
 * AI Analysis Panel Component
 * Main interface for AI-powered legal analysis
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, FileText, Scale, TrendingUp, DollarSign, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisManager } from '@/services/ai';
import { CaseAnalysisView } from './CaseAnalysisView';
import { WritingAnalysisView } from './WritingAnalysisView';
import { CitationRecommendationsView } from './CitationRecommendationsView';
import { AnalysisHistoryView } from './AnalysisHistoryView';
import type { ComprehensiveCaseAnalysis, WritingAnalysis, CitationRecommendation } from '@/services/ai';

interface AIAnalysisPanelProps {
  scrapedCases?: Array<{
    id: string;
    title: string;
    content: string;
    citation?: { bluebook?: string };
  }>;
  paperContent?: string;
  citations?: any[];
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  scrapedCases = [],
  paperContent = '',
  citations = [],
}) => {
  const { toast } = useToast();
  const [analysisManager, setAnalysisManager] = useState<AnalysisManager | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  // Analysis results
  const [caseAnalyses, setCaseAnalyses] = useState<ComprehensiveCaseAnalysis[]>([]);
  const [writingAnalysis, setWritingAnalysis] = useState<WritingAnalysis | null>(null);
  const [citationRecommendations, setCitationRecommendations] = useState<CitationRecommendation | null>(null);

  // Load API key from environment
  useEffect(() => {
    const envKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (envKey && envKey !== 'your_api_key_here') {
      setApiKey(envKey);
      initializeManager(envKey);
    }
  }, []);

  const initializeManager = (key: string) => {
    try {
      const manager = new AnalysisManager(key);
      setAnalysisManager(manager);
      setIsConfigured(true);
      toast({
        title: 'AI Service Configured',
        description: 'Ready to perform legal analysis',
      });
    } catch (error) {
      toast({
        title: 'Configuration Error',
        description: error instanceof Error ? error.message : 'Failed to initialize AI service',
        variant: 'destructive',
      });
    }
  };

  const handleConfigureAPI = () => {
    if (!apiKey || apiKey === 'your_api_key_here') {
      toast({
        title: 'API Key Required',
        description: 'Please enter a valid Anthropic API key',
        variant: 'destructive',
      });
      return;
    }
    initializeManager(apiKey);
  };

  const analyzeSingleCase = async (caseIndex: number) => {
    if (!analysisManager || !scrapedCases[caseIndex]) return;

    setIsAnalyzing(true);
    const caseData = scrapedCases[caseIndex];

    try {
      const result = await analysisManager.analyzeCase(
        caseData.content,
        caseData.title,
        caseData.citation?.bluebook || 'No citation',
        (stage) => setCurrentStage(stage)
      );

      if (result.success && result.data) {
        setCaseAnalyses((prev) => [...prev, result.data!]);
        setTotalCost(analysisManager.getTotalCost());
        toast({
          title: 'Analysis Complete',
          description: `Cost: $${result.usage?.totalCost.toFixed(4)}`,
        });
      } else {
        toast({
          title: 'Analysis Failed',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Analysis failed',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
      setCurrentStage('');
    }
  };

  const analyzeAllCases = async () => {
    if (!analysisManager || scrapedCases.length === 0) return;

    setIsAnalyzing(true);

    try {
      const casesData = scrapedCases.map((c) => ({
        content: c.content,
        title: c.title,
        citation: c.citation?.bluebook || 'No citation',
      }));

      const { results, summary } = await analysisManager.batchAnalyzeCases(
        casesData,
        (progress) => {
          setCurrentStage(
            `Analyzing ${progress.completed}/${progress.total} cases... ($${progress.totalCost.toFixed(2)})`
          );
        }
      );

      const successfulAnalyses = results
        .filter((r) => r.success && r.data)
        .map((r) => r.data!);

      setCaseAnalyses(successfulAnalyses);
      setTotalCost(analysisManager.getTotalCost());

      toast({
        title: 'Batch Analysis Complete',
        description: `Analyzed ${summary.successful}/${casesData.length} cases. Total cost: $${summary.totalCost.toFixed(2)}`,
      });
    } catch (error) {
      toast({
        title: 'Batch Analysis Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
      setCurrentStage('');
    }
  };

  const analyzePaper = async () => {
    if (!analysisManager || !paperContent) {
      toast({
        title: 'No Paper Content',
        description: 'Please upload a paper to analyze',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analysisManager.comprehensivePaperAnalysis(
        paperContent,
        citations,
        (stage) => setCurrentStage(stage)
      );

      if (result.writing.success && result.writing.data) {
        setWritingAnalysis(result.writing.data);
      }

      if (result.recommendations.success && result.recommendations.data) {
        setCitationRecommendations(result.recommendations.data);
      }

      setTotalCost(analysisManager.getTotalCost());

      toast({
        title: 'Paper Analysis Complete',
        description: `Total cost: $${result.totalCost.toFixed(4)}`,
      });
    } catch (error) {
      toast({
        title: 'Paper Analysis Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
      setCurrentStage('');
    }
  };

  if (!isConfigured) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Legal Analysis
          </CardTitle>
          <CardDescription>
            Configure your Anthropic API key to unlock AI-powered legal analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Anthropic API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get your API key from <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">console.anthropic.com</a>
            </p>
          </div>
          <Button onClick={handleConfigureAPI} className="w-full">
            <Brain className="w-4 h-4 mr-2" />
            Configure AI Service
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Legal Analysis
              </CardTitle>
              <CardDescription>
                AI-powered case analysis, writing feedback, and citation recommendations
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              ${totalCost.toFixed(4)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={analyzeAllCases}
              disabled={isAnalyzing || scrapedCases.length === 0}
              className="w-full"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Scale className="w-4 h-4 mr-2" />
              )}
              Analyze All Cases
              <Badge variant="secondary" className="ml-2">
                {scrapedCases.length}
              </Badge>
            </Button>
            <Button
              onClick={analyzePaper}
              disabled={isAnalyzing || !paperContent}
              variant="outline"
              className="w-full"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              Analyze Paper
            </Button>
            <Button
              onClick={() => {
                if (analysisManager) {
                  const estimate = analysisManager.estimateCost('comprehensive', scrapedCases.length);
                  toast({
                    title: 'Cost Estimate',
                    description: `${estimate.description}: ~$${estimate.estimatedCost.toFixed(2)}`,
                  });
                }
              }}
              variant="outline"
              className="w-full"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Estimate Cost
            </Button>
          </div>

          {isAnalyzing && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">{currentStage || 'Processing...'}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="cases" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cases">
            Cases
            <Badge variant="secondary" className="ml-2">
              {caseAnalyses.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="writing">Writing</TabsTrigger>
          <TabsTrigger value="citations">Citations</TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-1" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-4">
          {caseAnalyses.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No case analyses yet. Analyze scraped cases to see results here.
              </CardContent>
            </Card>
          ) : (
            caseAnalyses.map((analysis, index) => (
              <CaseAnalysisView key={index} analysis={analysis} />
            ))
          )}
        </TabsContent>

        <TabsContent value="writing">
          {writingAnalysis ? (
            <WritingAnalysisView analysis={writingAnalysis} />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No writing analysis yet. Analyze your paper to see feedback here.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="citations">
          {citationRecommendations ? (
            <CitationRecommendationsView recommendations={citationRecommendations} />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No citation recommendations yet. Analyze your paper to get suggestions.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          {analysisManager && <AnalysisHistoryView manager={analysisManager} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};
