/**
 * FREE AI Analysis Panel
 * Supports multiple FREE AI backends - NO PAID APIs REQUIRED!
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Brain, Zap, Globe, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FreeAnalysisManager, AIBackend } from '@/services/ai';
import { CaseAnalysisView } from './CaseAnalysisView';
import type { ComprehensiveCaseAnalysis } from '@/services/ai';

interface FreeAIPanelProps {
  scrapedCases?: Array<{
    id: string;
    title: string;
    content: string;
    citation?: { bluebook?: string };
  }>;
  paperContent?: string;
  citations?: any[];
}

export const FreeAIPanel: React.FC<FreeAIPanelProps> = ({
  scrapedCases = [],
}) => {
  const { toast } = useToast();
  const [backend, setBackend] = useState<AIBackend>('browser');
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(backend === 'browser'); // Browser is always ready!
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [analysisManager, setAnalysisManager] = useState<FreeAnalysisManager | null>(null);
  const [caseAnalyses, setCaseAnalyses] = useState<ComprehensiveCaseAnalysis[]>([]);

  // Auto-load API keys from environment
  React.useEffect(() => {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    const hfToken = import.meta.env.VITE_HF_TOKEN;

    if (backend === 'groq' && groqKey && groqKey !== 'your_groq_key_here') {
      setApiKey(groqKey);
    } else if (backend === 'huggingface' && hfToken && hfToken !== 'your_hf_token_here') {
      setApiKey(hfToken);
    }
  }, [backend]);

  const handleConfigureBackend = () => {
    try {
      if (backend === 'browser') {
        // Browser AI needs NO configuration!
        const manager = new FreeAnalysisManager('browser');
        setAnalysisManager(manager);
        setIsConfigured(true);
        toast({
          title: '🎉 Browser AI Ready!',
          description: 'AI runs 100% in your browser - completely FREE!',
        });
        return;
      }

      if (!apiKey || apiKey.includes('your_')) {
        toast({
          title: 'API Key Required',
          description: `Please enter a valid ${backend} API key`,
          variant: 'destructive',
        });
        return;
      }

      const manager = new FreeAnalysisManager(backend, apiKey);
      setAnalysisManager(manager);
      setIsConfigured(true);

      toast({
        title: `${backend.toUpperCase()} Configured!`,
        description: 'Ready to analyze - FREE tier activated',
      });
    } catch (error) {
      toast({
        title: 'Configuration Error',
        description: error instanceof Error ? error.message : 'Failed to configure',
        variant: 'destructive',
      });
    }
  };

  const analyzeCase = async (caseIndex: number) => {
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
        toast({
          title: '✅ Analysis Complete!',
          description: 'FREE AI analysis - $0.00 cost',
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
    if (!analysisManager || scrapedCases.length === 0) {
      toast({
        title: 'No Cases',
        description: 'Please import cases from the Legal Research tab first',
        variant: 'destructive',
      });
      return;
    }

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
          setCurrentStage(`Analyzing ${progress.completed}/${progress.total} cases...`);
        }
      );

      const successfulAnalyses = results
        .filter((r) => r.success && r.data)
        .map((r) => r.data!);

      setCaseAnalyses(successfulAnalyses);

      toast({
        title: `✅ Analyzed ${summary.successful}/${casesData.length} Cases`,
        description: `100% FREE - $0.00 total cost!`,
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

  const getBackendInfo = (backendType: AIBackend) => {
    const info = {
      browser: {
        name: 'Browser AI',
        icon: Globe,
        color: 'text-green-600',
        description: 'Runs in your browser - NO API key needed!',
        free: '100% FREE Forever',
        limits: 'No limits - runs locally',
        requiresKey: false,
      },
      groq: {
        name: 'Groq',
        icon: Zap,
        color: 'text-blue-600',
        description: 'Ultra-fast AI - FREE tier available',
        free: 'FREE (30 req/min)',
        limits: '30 requests/minute, unlimited daily',
        requiresKey: true,
        signupUrl: 'https://console.groq.com',
      },
      huggingface: {
        name: 'Hugging Face',
        icon: Brain,
        color: 'text-purple-600',
        description: 'Open-source models - FREE tier',
        free: 'FREE (300 req/hr)',
        limits: '300 requests/hour',
        requiresKey: true,
        signupUrl: 'https://huggingface.co/settings/tokens',
      },
      anthropic: {
        name: 'Anthropic Claude',
        icon: DollarSign,
        color: 'text-orange-600',
        description: 'Premium AI - PAID (requires credit card)',
        free: 'PAID ONLY',
        limits: 'Pay per use',
        requiresKey: true,
        signupUrl: 'https://console.anthropic.com',
      },
    };

    return info[backendType];
  };

  const currentBackendInfo = getBackendInfo(backend);
  const Icon = currentBackendInfo.icon;

  if (!isConfigured) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            FREE AI Legal Analysis
          </CardTitle>
          <CardDescription>
            Choose your FREE AI backend - no credit card required!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Backend Selection */}
          <div>
            <Label>Select AI Backend</Label>
            <Select value={backend} onValueChange={(value) => setBackend(value as AIBackend)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="browser">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <span>Browser AI</span>
                    <Badge variant="secondary" className="ml-2">100% FREE</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="groq">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span>Groq</span>
                    <Badge variant="secondary" className="ml-2">FREE</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="huggingface">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span>Hugging Face</span>
                    <Badge variant="secondary" className="ml-2">FREE</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="anthropic">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                    <span>Anthropic Claude</span>
                    <Badge variant="destructive" className="ml-2">PAID</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Backend Info Card */}
          <Card className="border-2">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Icon className={`w-6 h-6 ${currentBackendInfo.color}`} />
                <div className="flex-1">
                  <h3 className="font-semibold">{currentBackendInfo.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {currentBackendInfo.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={backend === 'anthropic' ? 'destructive' : 'secondary'}>
                      {currentBackendInfo.free}
                    </Badge>
                    <span className="text-xs text-gray-500">{currentBackendInfo.limits}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Key Input (if needed) */}
          {currentBackendInfo.requiresKey && (
            <div>
              <Label>API Key / Token</Label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${currentBackendInfo.name} API key`}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your FREE key at:{' '}
                <a
                  href={currentBackendInfo.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {currentBackendInfo.signupUrl}
                </a>
              </p>
            </div>
          )}

          {/* Configure Button */}
          <Button onClick={handleConfigureBackend} className="w-full">
            <Icon className="w-4 h-4 mr-2" />
            {backend === 'browser' ? 'Start Browser AI (FREE)' : `Configure ${currentBackendInfo.name}`}
          </Button>

          {/* Recommended Badge */}
          {backend === 'browser' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-900 dark:text-green-100">
                Recommended: No signup, no limits, 100% private & free!
              </span>
            </div>
          )}

          {backend === 'anthropic' && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Warning: Anthropic requires a credit card and charges per use
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Configured View
  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${currentBackendInfo.color}`} />
                {currentBackendInfo.name} Analysis
              </CardTitle>
              <CardDescription>
                FREE legal case analysis - $0.00 cost
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsConfigured(false)}>
              Change Backend
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={analyzeAllCases}
              disabled={isAnalyzing || scrapedCases.length === 0}
              className="flex-1"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              Analyze All Cases
              <Badge variant="secondary" className="ml-2">
                {scrapedCases.length}
              </Badge>
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

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="results" className="flex-1">
            Results
            <Badge variant="secondary" className="ml-2">
              {caseAnalyses.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          {caseAnalyses.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No analyses yet. Click "Analyze All Cases" to get started!</p>
                <p className="text-xs mt-1">100% FREE - No limits!</p>
              </CardContent>
            </Card>
          ) : (
            caseAnalyses.map((analysis, index) => (
              <CaseAnalysisView key={index} analysis={analysis} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
