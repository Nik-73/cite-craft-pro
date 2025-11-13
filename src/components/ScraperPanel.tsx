import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Download, ExternalLink, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { ScraperManager } from '@/scraper/ScraperManager';
import { ScraperResult, ScraperSourceType } from '@/scraper/types';

const scraper = new ScraperManager();

interface ScraperPanelProps {
  onAddCitation?: (result: ScraperResult) => void;
}

export const ScraperPanel = ({ onAddCitation }: ScraperPanelProps) => {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<string>('all');
  const [jurisdiction, setJurisdiction] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [results, setResults] = useState<ScraperResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    toast.info(`Searching ${source === 'all' ? 'all sources' : source}...`);

    try {
      let searchResults: ScraperResult[];

      const options = {
        query,
        limit: 10,
        jurisdiction: jurisdiction || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      if (source === 'all') {
        searchResults = await scraper.searchAll(options);
      } else {
        searchResults = await scraper.searchWithSource(source as ScraperSourceType, options);
      }

      setResults(searchResults);
      toast.success(`Found ${searchResults.length} results`);
    } catch (error: any) {
      toast.error(`Search failed: ${error.message}`);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToCitations = (result: ScraperResult) => {
    if (onAddCitation) {
      onAddCitation(result);
      toast.success('Added to citations');
    } else {
      toast.info('Citation feature not available');
    }
  };

  const handleExportResults = () => {
    const json = scraper.exportToJSON(results);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-research-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Results exported');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Legal Research Scraper
          </CardTitle>
          <CardDescription>
            Search for legal cases and documents from multiple sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Query */}
          <div className="space-y-2">
            <Label htmlFor="search-query">Search Query</Label>
            <div className="flex gap-2">
              <Input
                id="search-query"
                placeholder="Enter case name, citation, or keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          {/* Source Selection */}
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger id="source">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="courtlistener">CourtListener</SelectItem>
                <SelectItem value="google-scholar">Google Scholar</SelectItem>
                <SelectItem value="justia">Justia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jurisdiction">Jurisdiction (Optional)</Label>
              <Input
                id="jurisdiction"
                placeholder="e.g., federal, california"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-from" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Date From (Optional)
              </Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-to" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Date To (Optional)
            </Label>
            <Input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {/* Export Button */}
          {results.length > 0 && (
            <Button onClick={handleExportResults} variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export Results ({results.length})
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Search Results ({results.length})
          </h3>
          {results.map((result, index) => (
            <Card key={result.id}>
              <CardHeader>
                <CardTitle className="text-base">{result.title}</CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="font-medium">{result.source}</span>
                    {result.date && <span>• {result.date}</span>}
                    {result.metadata?.court && <span>• {result.metadata.court}</span>}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.metadata?.docket && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Docket:</strong> {result.metadata.docket}
                  </p>
                )}

                {result.citation?.bluebook && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Citation:</strong> {result.citation.bluebook}
                  </p>
                )}

                {result.content && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {result.content}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(result.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Source
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCitations(result)}
                    disabled={!onAddCitation}
                  >
                    Add to Citations
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {results.length === 0 && !isSearching && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No results yet. Enter a search query to find legal cases.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
